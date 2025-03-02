<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use HasFactory;

class Hall extends Model
{
    protected $fillable = ['name', 'capacity', 'rows', 'seats', 'layout', 'standard_price', 'vip_price'];
    public $timestamps = false; 
}
