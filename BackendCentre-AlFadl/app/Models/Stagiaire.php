<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stagiaire extends Model
{
    use HasFactory;

    public function formation()
    {
        return $this->belongsTo(Formation::class, 'formation_id');
    }

    public function formateurs()
    {
        return $this->belongsToMany(User::class, 'stg_formateurs', 'stg_id', 'formateur_id');
    }
}


