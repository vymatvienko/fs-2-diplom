<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up() {
        Schema::table('seances', function (Blueprint $table) {
            $table->date('date')->nullable()->after('start_time'); // Добавляем nullable
        });

        // Устанавливаем текущую дату для уже существующих записей
        DB::statement("UPDATE seances SET date = CURDATE() WHERE date IS NULL");
        
        // Делаем колонку NOT NULL после обновления данных
        Schema::table('seances', function (Blueprint $table) {
            $table->date('date')->nullable(false)->change();
        });
    }

    public function down() {
        Schema::table('seances', function (Blueprint $table) {
            $table->dropColumn('date');
        });
    }
};
