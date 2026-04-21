<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nomComplet' => 'required|string|max:255',
            'email_personnel' => 'required|email|unique:users,email_personnel',
            'numTel' => 'required|string',
            'formation_id' => 'nullable|exists:formations,id',
            'role' => 'required|string'
        ]);


        $slugNom = Str::slug($request->nomComplet, '.');
        $emailGenere = $slugNom . '@centre-alfadl.ma';

// on vérifier si l'email généré existe déjà (doublons)
        $count = User::where('email_genere', 'like', $slugNom . '%')->count();
        if ($count > 0) {
            $emailGenere = $slugNom . ($count + 1) . '@centre-alfadl.ma';
        }

//  génération d'un mot de passe aléatoire (8 caractères)
        $passwordClair = Str::random(8);

//  Création de l'utilisateur
        $user = User::create([
            'nomComplet' => $request->nomComplet,
            'email_genere' => $emailGenere,
            'email_personnel' => $request->email_personnel,
            'numTel' => $request->numTel,
            'role' => $request->role,
            'formation_id' => $request->formation_id,
            'password' => Hash::make($passwordClair), // On hache le mot de passe
        ]);

// (pour que l'admin puisse voir/copier le mot de passe généré)
        return response()->json([
            'message' => 'Formateur créé avec succès',
            'user' => $user,
            'credentials' => [
                'email_genere' => $emailGenere,
                'password' => $passwordClair
            ]
        ], 201);
    }
}
