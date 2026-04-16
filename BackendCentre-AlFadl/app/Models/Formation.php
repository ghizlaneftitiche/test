<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class, 'formation_id');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'formation_modules', 'formation_id', 'module_id');
    }

}
