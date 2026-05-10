<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\User;
use App\Models\TypeEvaluation;
use App\Models\Stagiaire;
use App\Models\Formation;
use App\Models\Module;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Récupère le profil du formateur connecté via son Token
     */
    public function getProfilFormateur()
    {
        try {
            $user = Auth::user(); // Laravel récupère l'utilisateur grâce au Bearer Token

            return response()->json([
                'nom' => $user->nomComplet,
                'role' => $user->role,
                'formation_id' => $user->formation_id,
                'module_id' => $user->module_id
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Récupère les stagiaires de la branche du formateur connecté
     */
    public function getTableauNotes()
    {
        try {
            $user = Auth::user();

            // 1. Si c'est un formateur de Branche
            if ($user->role === 'FormateurBranche') {
                $formation = \App\Models\Formation::find($user->formation_id);
                $stagiaires = \App\Models\Stagiaire::where('formation_id', $user->formation_id)
                    ->with(['notes.typeEvaluation'])
                    ->get();

                return response()->json([
                    'userName' => $user->nomComplet,
                    'nomBranche' => $formation ? $formation->intitule : 'Inconnue',
                    'stagiaires' => $this->formatStagiaires($stagiaires)
                ], 200);
            }

            // 2. Si c'est un formateur de Module
            if ($user->role === 'FormateurModule') {
                $module = \App\Models\Module::find($user->module_id);
                return response()->json([
                    'userName' => $user->nomComplet,
                    'nomModule' => $module ? $module->intitule : 'Module inconnu',
                    'stagiaires' => [] // Le module teacher charge les stagiaires via le Select
                ], 200);
            }

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function formatStagiaires($stagiaires)
    {
        return $stagiaires->map(function ($stg) {
            $notesFormatted = [];
            foreach ($stg->notes as $n) {
                if ($n->typeEvaluation) {
                    $notesFormatted[strtoupper($n->typeEvaluation->type)] = $n->note;
                }
            }
            return [
                'id' => $stg->id,
                'nomComplet' => strtoupper($stg->nom) . ' ' . ucfirst($stg->prenom),
                'notesExistantes' => $notesFormatted
            ];
        });
    }

    /**
     * Enregistrement massif des notes envoyées par le tableau React
     */
    public function bulkStore(Request $request)
    {
        $user = Auth::user();
        $notesData = $request->input('notes');

        if (empty($notesData)) {
            return response()->json(['error' => 'Aucune donnée de note fournie.'], 400);
        }

        try {
            DB::beginTransaction();

            $allTypes = TypeEvaluation::all()->mapWithKeys(function ($item) {
                return [strtoupper(trim($item->type)) => $item->id];
            });

            $stagiaireIds = collect($notesData)->pluck('stagiaire_id')->unique();
            $stagiaires = Stagiaire::whereIn('id', $stagiaireIds)->get()->keyBy('id');

            foreach ($notesData as $item) {
                $typeId = $allTypes->get(strtoupper(trim($item['type_code'])));

                if ($typeId) {
                    $formationId = null;
                    $formationModuleId = null;

                    if ($user->role === 'FormateurBranche') {
                        $formationId = $user->formation_id;
                        // Pour un formateur branche, peut-être que formationModule_id reste null
                    } else if ($user->role === 'FormateurModule') {
                        $stagiaire = $stagiaires->get($item['stagiaire_id']);

                        if ($stagiaire) {
                            $formationId = $stagiaire->formation_id;

                            // On cherche l'ID de la liaison Formation-Module
                            $pivot = DB::table('formation_modules')
                                ->where('formation_id', $formationId)
                                ->where('module_id', $user->module_id)
                                ->first();

                            if ($pivot) {
                                $formationModuleId = $pivot->id;
                            }
                        }
                    }

                    // On utilise 'formationModule_id' pour différencier les notes des profs.
                    Note::updateOrCreate(
                        [
                            'stagiaire_id' => $item['stagiaire_id'],
                            'typeEvaluation_id' => $typeId,
                            'formation_id' => $formationId,
                            'formationModule_id' => $formationModuleId, // C'est cette clé qui isole le module !
                        ],
                        ['note' => $item['note']]
                    );
                }
            }

            DB::commit();
            return response()->json(['message' => 'Notes enregistrées avec succès !']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()], 500);
        }
    }

    public function getBranches()
    {
        try {
            $formations = Formation::all();
            return response()->json($formations, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getStagiairesParBranche($id)
    {
        try {
            $user = Auth::user();

            $stagiaires = Stagiaire::where('formation_id', $id)
                ->with(['notes' => function ($query) use ($user, $id) {
                    // On filtre les notes pour qu'elles correspondent :
                    // 1. Au module du formateur connecté
                    // 2. ET à la branche (formation) sélectionnée actuellement
                    $query->whereIn('formationModule_id', function ($subQuery) use ($user, $id) {
                        $subQuery->select('id')
                            ->from('formation_modules')
                            ->where('module_id', $user->module_id)
                            ->where('formation_id', $id); // Filtre précis pour n'avoir qu'une seule ligne
                    });
                }, 'notes.typeEvaluation'])
                ->get()
                ->map(function ($stg) {
                    $notesFormatted = [];
                    foreach ($stg->notes as $n) {
                        if ($n->typeEvaluation) {
                            $notesFormatted[strtoupper($n->typeEvaluation->type)] = $n->note;
                        }
                    }
                    return [
                        'id' => $stg->id,
                        'nomComplet' => strtoupper($stg->nom) . ' ' . ucfirst($stg->prenom),
                        'notesExistantes' => $notesFormatted
                    ];
                });

            return response()->json(['stagiaires' => $stagiaires], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
