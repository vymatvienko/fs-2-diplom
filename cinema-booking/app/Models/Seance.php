<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seance extends Model {
    use HasFactory;

    protected $fillable = ['hall_id', 'movie_id', 'start_time'];

    public function hall() {
        return $this->belongsTo(Hall::class);
    }

    public function movie() {
        return $this->belongsTo(Movie::class);
    }
}
