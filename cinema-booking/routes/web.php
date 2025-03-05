<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\HallController;
use App\Http\Controllers\Admin\HallPriceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;


Route::get('/', [IndexController::class, 'index'])->name('index');

Route::get('/booking/{seance}', function ($seance) {
    return "Страница бронирования для сеанса $seance пока не реализована.";
})->name('booking');


Route::get('/admin_index', function () {
    return view('layouts.admin.admin_index');
});

Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::get('/admin_index', function () {
    return view('layouts.admin.admin_index');
})->middleware(['auth', 'admin']);


Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin_index', function () {
        return view('layouts.admin.admin_index');
    })->name('admin.index');
});
Route::middleware('auth')->group(function () {
    // Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/halls', [HallController::class, 'index']); // Получить список залов
Route::post('/halls', [HallController::class, 'store']); // Создать зал
Route::delete('/halls/{id}', [HallController::class, 'destroy']); // Удалить зал

Route::get('/halls/{hall}/prices', [HallPriceController::class, 'show']);
Route::post('/halls/{hall}/prices', [HallPriceController::class, 'update']);

Route::get('/halls/{id}/layout', [HallController::class, 'getLayout']); // Получить схему зала
Route::post('/halls/{id}/layout', [HallController::class, 'saveLayout']); // Сохранить схему зала

require __DIR__.'/auth.php';