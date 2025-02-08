<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Session;
use Carbon\Carbon;

class SessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Session::create([
            'movie_id' => 1,  // ID фильма (например, Inception)
            'hall_id' => 1,    // ID зала (например, Main Hall)
            'start_time' => Carbon::now()->addDay(),  // Сеанс завтра
        ]);

        Session::create([
            'movie_id' => 2,  // ID фильма (например, The Dark Knight)
            'hall_id' => 2,    // ID зала (например, VIP Hall)
            'start_time' => Carbon::now()->addDays(2),  // Сеанс через два дня
        ]);
    }
}
