<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stagiaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->date('dateDeNaissance');
            $table->string('lieuDeNaissance');
            $table->integer('numTel');;
            $table->date('dateInterruption');
            $table->string('statut');
            $table->date('dateInscription');
            $table->float('moyenneGeneral');
            $table->float('noteDiscipline');
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stagiaires');
    }
};
