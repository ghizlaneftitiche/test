<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->foreignId('formationModule_id')->constrained('formation_modules')->onDelete('cascade');

            $table->foreignId('typeEvaluation_id')
                ->constrained('type_evaluations')
                ->onDelete('cascade');
            $table->foreignId('stagiaire_id')->constrained('stagiaires')->onDelete('cascade');
            $table->float('note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
