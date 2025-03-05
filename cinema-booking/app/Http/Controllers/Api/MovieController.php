<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    // Получение списка фильмов
    public function index()
    {
        return response()->json(Movie::select('id', 'title', 'duration')->get());
    }

    // Добавление нового фильма
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'duration' => 'required|integer|min:1',
                'description' => 'nullable|string'
            ]);

            $movie = Movie::create([
                'title' => $request->title,
                'duration' => $request->duration,
                'description' => $request->description ?? ''
            ]);

            return response()->json($movie, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}