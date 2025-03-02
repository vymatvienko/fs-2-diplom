<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Проверяем, авторизован ли пользователь и является ли он админом
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Доступ запрещен'], 403);
        }

        return $next($request);
    }
}

