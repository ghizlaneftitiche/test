<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'note',
        'stagiaire_id',
        'typeEvaluation_id',
        'formation_id',
        'formationModule_id',
    ];

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class, 'stagiaire_id');
    }


    public function typeEvaluation()
    {
        return $this->belongsTo(TypeEvaluation::class, 'typeEvaluation_id');
    }


    public function formation()
    {
        return $this->belongsTo(Formation::class, 'formation_id');
    }
    public function formationModule()
    {
        return $this->belongsTo(FormationModule::class, 'formationModule_id');
    }

}

