<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeEvaluation extends Model
{
    use HasFactory;
    protected $table = 'type_evaluations';

    protected $fillable = ['type'];

    public function notes()
    {
        return $this->hasMany(Note::class, 'typeEvaluation_id');
    }
}
