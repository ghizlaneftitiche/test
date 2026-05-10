<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VilleController extends Controller
{
    public function index()
    {
        $response = Http::post('https://countriesnow.space/api/v0.1/countries/cities', [
            'country' => 'Morocco',
        ]);

        if (! $response->successful() || null === $response->json('data')) {
            return response()->json([], 200);
        }

        $villes = collect($response->json('data'))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json($villes);
    }
}
