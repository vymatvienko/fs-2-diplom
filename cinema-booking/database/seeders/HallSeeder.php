<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hall;

class HallSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hall::create([
            'name' => 'Main Hall',
            'capacity' => 200,
        ]);

        Hall::create([
            'name' => 'VIP Hall',
            'capacity' => 50,
        ]);
    }
}
