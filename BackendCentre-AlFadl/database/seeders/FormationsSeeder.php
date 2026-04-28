<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Formation;
use App\Models\Module;

class FormationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formations = [
            ['intitule' => 'Informatique', 'masseHoraire' => '800'],
            ['intitule' => 'Construction de balles', 'masseHoraire' => '600'],
            ['intitule' => 'Électricité du bâtiment', 'masseHoraire' => '700'],
            ['intitule' => 'Cuisine et pâtisserie', 'masseHoraire' => '900'],
            ['intitule' => 'Confection et couture', 'masseHoraire' => '750'],
            ['intitule' => 'Rasage Féminin', 'masseHoraire' => '500'],
            ['intitule' => 'Rasage Masculin', 'masseHoraire' => '500'],
        ];

        foreach ($formations as $f) {
            \App\Models\Formation::create($f);
        }
        $modules = [
            ['intitule' => 'Français', 'masseHoraire' => '40'],
            ['intitule' => 'Arabe', 'masseHoraire' => '30'],
            ['intitule' => 'Instruction Islamique', 'masseHoraire' => '30'],
            ['intitule' => 'Activités Parallèles', 'masseHoraire' => '50'],
        ];

        foreach ($modules as $m) {
            \App\Models\Module::create($m);
        }
    }
}
