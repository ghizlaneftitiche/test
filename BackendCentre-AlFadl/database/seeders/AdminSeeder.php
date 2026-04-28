<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nomComplet' => 'Administrateur Principal',
            'email_genere' => 'admin@centre-alfadl.ma',
            'email_personnel' => 'votre-email@gmail.com',
            'password' => Hash::make('admin123'),
            'numTel' => '0600000000',
            'role' => 'admin',
            'password_clair' => 'admin123',
            'formation_id' => null,
        ]);
    }
}
