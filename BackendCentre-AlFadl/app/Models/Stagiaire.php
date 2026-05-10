<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stagiaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'dateDeNaissance',
        'lieuDeNaissance',
        'numTel',
        'dateInterruption',
        'statut',
        'dateInscription',
        'moyenneGeneral',
        'noteDiscipline',
        'formation_id'
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class, 'formation_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'stg_formateurs', 'stg_id', 'formateur_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'stagiaire_id');
    }
}


