<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RecupererDonnees;
use App\Http\Controllers\LoginController;





Route::post('/login', [LoginController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
Route::post('/admin/create-formateur', [AdminController::class, 'store']);
Route::get('/admin/get-branches', [RecupererDonnees::class, 'getBranches']);
Route::get('/admin/get-modules', [RecupererDonnees::class, 'getModules']);
Route::post('/logout', [LoginController::class, 'logout']);
});
