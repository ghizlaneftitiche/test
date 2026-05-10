<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\Module;
use App\Models\User;

class RecupererDonnees extends Controller
{
    public function getBranches()
    {
        $formations = Formation::all();
        return response()->json($formations);
    }

    public function getModules()
    {
        $modules = Module::all();
        return response()->json($modules);
    }

public function getFormateurs(){
    $formateurs = User::whereIn('role', ['FormateurBranche', 'FormateurModule'])
        ->with(['formation', 'module'])
        ->get();

    return response()->json($formateurs);

}
}
