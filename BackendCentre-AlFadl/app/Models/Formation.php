<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['intitule', 'masseHoraire'];

    public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class, 'formation_id');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'formation_modules', 'formation_id', 'module_id');
    }


    public function formateur()
    {
        // Un formateur est un User qui a le rôle 'FormateurBranche' et l'id de cette formation
        return $this->hasOne(User::class, 'formation_id')->where('role', 'FormateurBranche');
    }

}
