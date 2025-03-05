<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'duration', 'country', 'poster'];

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }
}
