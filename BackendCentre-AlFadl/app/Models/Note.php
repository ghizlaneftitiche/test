<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    public function typeEvaluation()
    {
        return $this->belongsTo(TypeEvaluation::class);
    }

    public function formationModule()
    {
        return $this->belongsTo(FormationsModules::class, 'idFormationsModules');
    }

    public function stgFormateur()
    {
        return $this->belongsTo(StgFormateur::class, 'idStgFormateur');
    }
}
