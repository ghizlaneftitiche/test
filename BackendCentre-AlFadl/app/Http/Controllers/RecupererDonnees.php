<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\Module;

class RecupererDonnees extends Controller
{
    public function getBranches()
    {
        $formations=Formation::all()
        return response()->json($formations);
    }

    public function getModules()
    {
        $modules=Module::all()
        return response()->json($modules);    }
}
