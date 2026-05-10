<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationModule extends Model
{
    use HasFactory;

    protected $fillable = [
        'formation_id',
        'module_id',
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class, 'formation_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

}
