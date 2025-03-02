<?php

use App\Models\Movie;
use App\Models\Seance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\Admin\HallController;
use App\Http\Controllers\Admin\HallPriceController;
use App\Http\Controllers\Api\MovieController;

Route::post('/halls', [HallController::class, 'store']);
Route::get('/halls', [HallController::class, 'index']);

Route::get('/halls/{id}/layout', [HallController::class, 'getLayout']);
Route::post('/halls/{id}/layout', [HallController::class, 'saveLayout']);
Route::post('/halls/{hall}/update-seats', [HallController::class, 'updateSeats']);

Route::get('/movies', function () {
    return response()->json(Movie::all());
});

Route::get('/seances', function () {
    return response()->json(Seance::with('hall', 'movie')->get());
});

Route::get('/seances', [SeanceController::class, 'index']); // Получить все сеансы
Route::post('/seances', [SeanceController::class, 'store']); // Добавить новый сеанс
Route::delete('/seances/{id}', [SeanceController::class, 'destroy']); // Удалить сеанс

Route::get('/movies', [MovieController::class, 'index']);
Route::post('/movies', [MovieController::class, 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});