<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Movie;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Movie::create([
            'title' => 'Inception',
            'description' => 'A mind-bending thriller about dreams within dreams.',
            'release_date' => '2010-07-16',
            'duration' => 148,  // В минутах
        ]);

        Movie::create([
            'title' => 'The Dark Knight',
            'description' => 'Batman faces his greatest challenge yet against the Joker.',
            'release_date' => '2008-07-18',
            'duration' => 152,
        ]);
    }
}
