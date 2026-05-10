<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RecupererDonnees;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\SortieController;
use App\Http\Controllers\NoteController;



Route::post('/login', [LoginController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/create-formateur', [AdminController::class, 'store']);
    Route::get('/admin/get-branches', [RecupererDonnees::class, 'getBranches']);
    Route::get('/admin/get-modules', [RecupererDonnees::class, 'getModules']);
    Route::get('/admin/get-formateurs', [RecupererDonnees::class, 'getFormateurs']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::Delete('/admin/supprimer-formateur/{id}', [AdminController::class, 'destroy']);
    Route::get('/admin/statistiques', [AdminController::class, 'getStatistiques']);

    Route::get('/admin/formations', [AdminController::class, 'getFormations']);

    Route::post('/admin/formations/stagiaires', [AdminController::class, 'storeStagiaire']);

    Route::get('/admin/villes', [VilleController::class, 'index']);

    Route::get('/admin/formationsSelect', [AdminController::class, 'getFormationsSelect']);

    Route::get('/admin/stagiaires/{formation_id}', [AdminController::class, 'getStagiairesFormations']);
    Route::delete('/admin/stagiaires/{stagiaire}', [AdminController::class, 'destroyStagiaire']);
    Route::put('/admin/stagiaires/{stagiaire}', [AdminController::class, 'updateStagiaire']);


    // Cette route est INDISPENSABLE pour corriger l'erreur 404 de la Topbar
    Route::get('/profil-formateur', [NoteController::class, 'getProfilFormateur']);

// --- ROUTES POUR LES FORMATIONS ET STAGIAIRES ---
    Route::get('/formations', [NoteController::class, 'getBranches']);
    Route::get('/stagiaires-par-branche/{id}', [NoteController::class, 'getStagiairesParBranche']);

// --- ROUTES POUR LES NOTES ---
    Route::get('/tableau-notes', [NoteController::class, 'getTableauNotes']);
    Route::post('/notes/bulk-store', [NoteController::class, 'bulkStore']);

// --- ROUTES POUR LES SORTIES ---
    Route::get('/sorties', [SortieController::class, 'index']);
    Route::post('/sorties/store', [SortieController::class, 'store']);
    Route::delete('/sorties/delete/{id}', [SortieController::class, 'destroy']);

    Route::get('/formation',[AdminController::class, 'show']);
    Route::get('/formation/sorties/{id}',[AdminController::class, 'index']);
    Route::get('/formation/{id}/stagiaires',[AdminController::class,'getNotesStagiaires']);
    Route::get('/releveNote/stagiaire/{id}',[AdminController::class,'getSeulReleve']);
    Route::get('/releveNote/formation/{id}/stagiaires',[AdminController::class,'getToutReleve']);
    Route::post('/notes-discipline', [AdminController::class, 'notesDiscipline']);
    Route::get('/releve/pdf/formation/{id}', [AdminController::class, 'exportTousRelevesPdf']);
    Route::get('/releve/pdf/stagiaire/{id}', [AdminController::class, 'exportSeulRelevePdf']);
});
