<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\MovieSeeder;
use Database\Seeders\HallSeeder;
use Database\Seeders\SessionSeeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Запуск всех сидеров
        $this->call([
            MovieSeeder::class,
            HallSeeder::class,
            SessionSeeder::class,
        ]);
    }
}
