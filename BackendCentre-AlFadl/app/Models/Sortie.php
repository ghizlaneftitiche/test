<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sortie extends Model
{
    use HasFactory;

    protected $fillable = ['lieuSortie', 'dateSortie', 'formateur_id'];

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

}
