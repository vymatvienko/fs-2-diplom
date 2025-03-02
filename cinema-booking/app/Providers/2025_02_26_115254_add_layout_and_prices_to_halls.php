<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('halls', function (Blueprint $table) {
            $table->integer('rows')->default(10);
            $table->integer('seats')->default(8);
            $table->json('layout')->nullable();
        });
    }

    public function down()
    {
        Schema::table('halls', function (Blueprint $table) {
            $table->dropColumn(['rows', 'seats', 'layout']);
        });
    }
};
