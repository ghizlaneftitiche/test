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

        $user = User::create([
            'nomComplet' => $request->nomComplet,
            'email_genere' => $emailGenere,
            'email_personnel' => $request->emailPro,
            'numTel' => $request->telephone,
            'role' => $role,
            'formation_id' => ($request->typeAffectation === 'Branche') ? $request->affectationId : null,
            'password' => Hash::make($passwordClair),
            'password_clair' => $passwordClair,
        ]);

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
