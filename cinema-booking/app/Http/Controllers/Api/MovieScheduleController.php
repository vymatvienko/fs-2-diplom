<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\JsonResponse;

class MovieScheduleController extends Controller
{
    public function index(): JsonResponse
    {
        $movies = Movie::with(['seances.hall'])->get();

        $formattedMovies = $movies->map(function ($movie) {
            return [
                'id' => $movie->id,
                'title' => $movie->title,
                'description' => $movie->description,
                'duration' => $movie->duration,
                'country' => $movie->country,
                'poster' => asset('storage/posters/' . $movie->poster),
                'seances' => $movie->seances->groupBy('hall_id')->map(function ($seances, $hallId) {
                    return [
                        'hall' => $seances->first()->hall->name ?? 'Неизвестный зал',
                        'times' => $seances->pluck('start_time')->map(fn($time) => date('H:i', strtotime($time)))
                    ];
                })->values(),
            ];
        });

        return response()->json($formattedMovies);
    }
}
