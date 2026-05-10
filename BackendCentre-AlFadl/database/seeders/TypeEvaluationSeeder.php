<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'TH1', 'PR1', 'TH2', 'PR2', 'TH3', 'PR3', 'TH4', 'PR4',
            'CC1', 'CC2', 'CC3', 'CC4',
            'STAGE'
        ];

        foreach ($types as $t) {
            \App\Models\TypeEvaluation::firstOrCreate(['type' => $t]);
        }
    }
}
