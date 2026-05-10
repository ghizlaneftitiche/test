<?php

namespace App\Http\Controllers;

use App\Models\Sortie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SortieController extends Controller
{
    public function index()
    {
        return response()->json(
            Sortie::where('formateur_id', Auth::id())
                ->orderBy('dateSortie', 'desc')
                ->get(),
            200
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'lieuSortie' => 'required|string|max:255',
            'dateSortie' => 'required|date',
        ]);

        try {
            $sortie = new Sortie();
            $sortie->lieuSortie = $request->lieuSortie;
            $sortie->dateSortie = $request->dateSortie;

            $sortie->formateur_id = Auth::id();

            $sortie->save();

            return response()->json([
                'message' => 'Sortie enregistrée avec succès',
                'data' => $sortie
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $sortie = Sortie::findOrFail($id);

            if ($sortie->formateur_id !== Auth::id()) {
                return response()->json(['message' => 'Action non autorisée'], 403);
            }

            $sortie->delete();
            return response()->json(['message' => 'Supprimé avec succès'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la suppression'], 500);
        }
    }
}
