<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    public function formations()
    {
        return $this->belongsToMany(Formation::class, 'formation_modules', 'module_id', 'formation_id');
    }
}
