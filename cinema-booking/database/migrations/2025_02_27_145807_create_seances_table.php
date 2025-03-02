<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->onDelete('cascade'); // Зал
            $table->foreignId('movie_id')->constrained()->onDelete('cascade'); // Фильм
            $table->time('start_time'); // Время начала
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('seances');
    }
};
