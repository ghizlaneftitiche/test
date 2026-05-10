<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\PDF;
use App\Models\Formation;
use App\Models\Stagiaire;
use App\Models\Note;
use App\Models\Sortie;
use App\Models\TypeEvaluation;
use App\Models\FormationModule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function getStatistiques()
    {
        $stagiaires = Stagiaire::count();
        $formateurs = User::whereIn('role', ['formateurBranche', 'formateurModule'])->count();
        $formations = Formation::count();
        return response()->json([
            'stagiaires' => $stagiaires,
            'formateurs' => $formateurs,
            'formations' => $formations,
        ]);
    }

    public function getFormations()
    {
        $formations = Formation::with(['formateur', 'stagiaires'])->get();

        $resultat = $formations->map(function ($formation) {
            return [
                'formation' => $formation->intitule,
                'formation_id' => $formation->id,
                'formateur' => $formation->formateur ? $formation->formateur->nomComplet : 'Aucun formateur',
                'nombreStagaires' => $formation->stagiaires->count(),
            ];
        });

        return response()->json($resultat);
    }

    public function storeStagiaire(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'dateDeNaissance' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $age = Carbon::parse($value)->age;
                    if ($age < 15 || $age > 20) {
                        $fail('L âge doit être entre 15 et 20 ans.');
                    }
                }
            ],
            'lieuDeNaissance' => 'required|string',
            'numTel' => [
                'required',
                'regex:/^(06|07)[0-9]{8}$/'
            ],
            'dateInterruption' => 'nullable|date',
            'formation_id' => 'required|exists:formations,id',
        ]);

        $formation = Formation::findOrFail($request->formation_id);
        $nbStagiairesValides = $formation->stagiaires()->where('statut', 'validé')->count();

        $statut = $nbStagiairesValides >= 20 ? 'en attente' : 'validé';

        $stagiaire = Stagiaire::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'dateDeNaissance' => $request->dateDeNaissance,
            'lieuDeNaissance' => $request->lieuDeNaissance,
            'numTel' => $request->numTel,
            'dateInterruption' => $request->dateInterruption,
            'dateInscription' => Carbon::now(),
            'formation_id' => $request->formation_id,
            'statut' => $statut,
        ]);
        return response()->json($stagiaire);
    }


    public function getStagiairesFormations($formation_id)
    {

        $stagiaires = Stagiaire::with('formation')
            ->where('formation_id', $formation_id)
            ->get();

        return response()->json($stagiaires);
    }

    public function destroyStagiaire(Stagiaire $stagiaire)
    {
        $formationId = $stagiaire->formation_id;
        $statutSupprime = $stagiaire->statut;

        $stagiaire->delete();

        if ($statutSupprime === 'validé') {

            $countValides = Stagiaire::where('formation_id', $formationId)
                ->where('statut', 'validé')
                ->count();

            $placesRestantes = 20 - $countValides;

            if ($placesRestantes > 0) {

                $stagiairesAValider = Stagiaire::where('formation_id', $formationId)
                    ->where('statut', 'en attente')
                    ->orderBy('created_at', 'asc')
                    ->take($placesRestantes)
                    ->get();

                foreach ($stagiairesAValider as $s) {
                    $s->update(['statut' => 'validé']);
                }
            }
        }

        return response()->json([
            'message' => 'Stagiaire supprimé et mise à jour automatique effectuée'
        ]);
    }

    public function updateStagiaire(Request $request, Stagiaire $stagiaire)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'dateDeNaissance' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $age = \Carbon\Carbon::parse($value)->age;
                    if ($age < 15 || $age > 20) {
                        $fail('L’âge doit être entre 15 et 20 ans.');
                    }
                }
            ],
            'lieuDeNaissance' => 'required|string',
            'numTel' => [
                'required',
                'regex:/^(06|07)[0-9]{8}$/'
            ],
            'formation_id' => 'required|exists:formations,id',
            'dateInterruption' => 'nullable|date',
        ], [
            'numTel.required' => 'Le numéro de téléphone est obligatoire.',
            'numTel.regex' => 'Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres.',
        ]);

        $stagiaire->update([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'dateDeNaissance' => $request->dateDeNaissance,
            'lieuDeNaissance' => $request->lieuDeNaissance,
            'numTel' => $request->numTel,
            'formation_id' => $request->formation_id,
            'dateInterruption' => $request->dateInterruption,
        ]);

        return response()->json($stagiaire->refresh());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomComplet' => 'required|string|max:255',
            'emailPro' => 'required|email|unique:users,email_personnel',
            'telephone' => 'required|string',
            'affectationId' => 'required',
            'typeAffectation' => 'required'
        ]);

        $slugNom = Str::slug($request->nomComplet, '.');
        $emailGenere = $slugNom . '@centre-alfadl.ma';

        $count = User::where('email_genere', 'like', $slugNom . '%')->count();
        if ($count > 0) {
            $emailGenere = $slugNom . ($count + 1) . '@centre-alfadl.ma';
        }

        $passwordClair = Str::random(8);
        $role = ($request->typeAffectation === 'Branche') ? 'FormateurBranche' : 'FormateurModule';

        try {
            return DB::transaction(function () use ($request, $emailGenere, $role, $passwordClair) {

                $user = User::create([
                    'nomComplet' => $request->nomComplet,
                    'email_genere' => $emailGenere,
                    'email_personnel' => $request->emailPro,
                    'numTel' => $request->telephone,
                    'role' => $role,
                    'formation_id' => ($request->typeAffectation === 'Branche') ? $request->affectationId : null,
                    'module_id' => ($request->typeAffectation === 'Module') ? $request->affectationId : null,
                    'password' => Hash::make($passwordClair),
                    'password_clair' => $passwordClair,
                ]);

                // LOGIQUE D'AFFECTATION AUTOMATIQUE
                if ($role === 'FormateurModule') {
                    $moduleId = $request->affectationId;

                    // 1. Récupérer tous les IDs de toutes les formations (branches)
                    $allFormationIds = DB::table('formations')->pluck('id');

                    // 2. Préparer les données pour l'insertion en masse
                    $dataToInsert = [];
                    foreach ($allFormationIds as $fId) {
                        $dataToInsert[] = [
                            'formation_id' => $fId,
                            'module_id' => $moduleId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    // 3. Insérer dans la table formation_modules
                    // On utilise updateOrInsert ou insert ignore pour éviter les doublons si le module existe déjà pour une branche
                    foreach ($dataToInsert as $data) {
                        DB::table('formation_modules')->updateOrInsert(
                            ['formation_id' => $data['formation_id'], 'module_id' => $data['module_id']],
                            ['updated_at' => now()]
                        );
                    }
                }

                return response()->json([
                    'message' => 'Formateur créé et affecté à toutes les branches avec succès',
                    'user' => $user,
                    'credentials' => [
                        'email_genere' => $emailGenere,
                        'password' => $passwordClair
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la création : ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'message' => 'Formateur supprimé avec succès'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression : ' . $e->getMessage()
            ], 500);
        }
    }

    public function getFormationsSelect()
    {
        $formations = Formation::all();
        return response()->json($formations);
    }

    public function show()
    {
        $formations = Formation::all();
        return response()->json($formations);
    }

    public function index($id)
    {
        $sorties = Sortie::whereHas('formateur', function ($query) use ($id) {
            $query->where('formation_id', $id);
        })
            ->with('formateur:id,nomComplet')
            ->get();

        return response()->json($sorties);
    }


    public function notesDiscipline(Request $request)
    {
        $request->validate([
            'notes' => 'required|array',
        ]);

        foreach ($request->notes as $noteData) {

            $stagiaire = Stagiaire::find($noteData['stagiaire_id']);

            if ($stagiaire) {
                $stagiaire->noteDiscipline = $noteData['noteDiscipline'];
                $stagiaire->save();
                // 🔥 recalcul immédiat
                $data = $this->calculerReleve($stagiaire);
                $stagiaire->moyenneGeneral = $data['moyenneGenerale'] ?? null;
                $stagiaire->save();
            }
        }

        return response()->json(['message' => 'Notes mises à jour']);
    }

// Fonction pour calculer le relevé d'un stagiaire
    private function calculerReleve($stagiaire)
    {
        // 1. LOGIQUE POUR L'ANNÉE SCOLAIRE DYNAMIQUE (Session)
        $now = \Carbon\Carbon::now();
        $year = $now->year;
        // Si nous sommes avant Septembre (mois 9), la session a commencé l'année dernière (ex: 2023-2024)
        // Sinon, elle commence cette année (ex: 2024-2025)
        $anneeEnCours = ($now->month < 9) ? ($year - 1) . '-' . $year : $year . '-' . ($year + 1);

        $examensTypes = ['TH1', 'PR1', 'TH2', 'PR2', 'TH3', 'PR3', 'TH4', 'PR4'];
        $modulesTypes = ['CC1', 'CC2', 'CC3', 'CC4'];
        $stageType = 'STAGE';

        // Récupération des notes avec les relations nécessaires
        $notes = Note::with(['typeEvaluation', 'formationModule.module'])
            ->where('stagiaire_id', $stagiaire->id)
            ->get();

        // Vérifier s'il existe au moins une note valide (> 0)
        $hasRealNotes = $notes->contains(function ($n) {
            return $n->note > 0;
        });

        $noteDiscipline = $stagiaire->noteDiscipline ?? 0;

        // Si aucune note n'est trouvée, on retourne un tableau vide mais structuré
        if (!$hasRealNotes) {
            return [
                'anneeEnCours' => $anneeEnCours,
                'moyenneBranche' => 0,
                'moyennesParModule' => [],
                'noteStage' => null,
                'noteDiscipline' => $noteDiscipline,
                'moyenneGenerale' => null,
            ];
        }

        //  CALCUL EXAMENS (coef 4)
        $examens = $notes->filter(fn($n) => in_array($n->typeEvaluation->type ?? null, $examensTypes) && $n->note > 0);

        $sumExamens = $examens->sum(fn($n) => $n->note * 4);
        $coefExamens = $examens->count() * 4;

        $moyenneBranche = $coefExamens > 0 ? $sumExamens / $coefExamens : 0;

        // CALCUL MODULES (CC)
        $modulesNotes = $notes->filter(fn($n) =>
            in_array($n->typeEvaluation->type ?? null, $modulesTypes) &&
            $n->note > 0 &&
            $n->formationModule !== null
        );

        $moyennesParModule = $modulesNotes
            ->groupBy('formationModule.module_id')
            ->map(function ($notesDuModule) {
                $formationModule = $notesDuModule->first()->formationModule;

                $module = $formationModule ? $formationModule->module : null;

                if (!$module) return null;

                $sum = $notesDuModule->sum('note');
                $count = $notesDuModule->count();

                return [
                    'module_id' => $module->id,
                    'module_nom' => $module->intitule,
                    'moyenneModule' => $count > 0 ? round($sum / $count, 2) : 0,
                ];
            })
            ->filter() 
            ->values();

        $sumModules = $modulesNotes->sum('note');
        $coefModules = $modulesNotes->count();

        //  STAGE
        $noteStageObj = $notes->first(function ($n) use ($stageType) {
            return ($n->typeEvaluation->type ?? null) === $stageType && $n->note > 0;
        });

        $valeurStage = $noteStageObj ? $noteStageObj->note : 0;


        // Formule : (Somme Examens + Somme CC + Discipline) / (Coeff Examens + Coeff CC + 1)
        $sumGlobal = $sumExamens + $sumModules + $noteDiscipline;
        $coefGlobal = $coefExamens + $coefModules + 1;

        $moyenneSansStage = $coefGlobal > 0 ? $sumGlobal / $coefGlobal : 0;

        // MOYENNE GENERALE (75% Scolarité + 25% Stage)
        $moyenneGenerale = ($moyenneSansStage * 0.75) + ($valeurStage * 0.25);

        // Retour du résultat final avec toutes les clés nécessaires au Blade
        return [
            'anneeEnCours' => $anneeEnCours,
            'moyenneBranche' => round($moyenneBranche, 2),
            'moyennesParModule' => $moyennesParModule,
            'noteStage' => $noteStageObj ? round($noteStageObj->note, 2) : null,
            'noteDiscipline' => $noteDiscipline,
            'moyenneGenerale' => round($moyenneGenerale, 2),
        ];
    }

// Récupérer les notes de tous les stagiaires d'une formation
    public function getNotesStagiaires($id)
    {
        $stagiaires = Stagiaire::where('formation_id', $id)->get();
        $result = [];

        foreach ($stagiaires as $stagiaire) {

            $data = $this->calculerReleve($stagiaire);

            //  stockage automatique
            $stagiaire->moyenneGeneral = $data['moyenneGenerale'] ?? null;
            $stagiaire->save();

            $result[] = [
                'stagiaire_id' => $stagiaire->id,
                'stagiaire' => $stagiaire->nom . ' ' . $stagiaire->prenom,
                ...$data
            ];
        }

        return response()->json($result);
    }

// Récupérer les notes de tous les stagiaires d'une formation


// Récupérer les relevés de tous les stagiaires d'une formation
    public function getToutReleve($id)
    {
        $stagiaires = Stagiaire::where('formation_id', $id)->get();

        $result = [];

        foreach ($stagiaires as $stagiaire) {
            $data = $this->calculerReleve($stagiaire);
            $result[] = array_merge([
                'stagiaire_id' => $stagiaire->id,
                'stagiaire' => $stagiaire->nom . ' ' . $stagiaire->prenom,
            ], $data);
        }

        return response()->json($result);
    }

// Exporter les relevés de tous les stagiaires d'une formation en PDF
    public function exportTousRelevesPdf($formationId)
    {
        $stagiaires = Stagiaire::where('formation_id', $formationId)->get();


        $result = [];

        foreach ($stagiaires as $stagiaire) {
            $result[] = [
                'stagiaire_id' => $stagiaire->id,
                'stagiaire' => $stagiaire,
                'data' => $this->calculerReleve($stagiaire)
            ];
        }

        $pdf = Pdf::loadView('imprimeReleveNotes', [
            'result' => $result,

        ]);

        $pdf->setPaper('A4', 'portrait');

        return $pdf->stream('releves_formation_' . $formationId . '.pdf');
    }

// Exporter le relevé d'un seul stagiaire en PDF
    public function exportSeulRelevePdf($id)
    {
        $stagiaire = Stagiaire::findOrFail($id);


        $result = [
            [
                'stagiaire_id' => $stagiaire->id,
                'stagiaire' => $stagiaire,
                'data' => $this->calculerReleve($stagiaire)
            ]
        ];

        $pdf = Pdf::loadView('imprimeReleveNotes', [
            'result' => $result,
        ]);

        return $pdf->stream('releve_stagiaire_' . $id . '.pdf');

    }
}
