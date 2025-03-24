<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movie;
use Carbon\Carbon;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $selectedDate = $request->query('date', Carbon::today()->toDateString());

        // Загружаем фильмы, у которых есть сеансы на выбранную дату
        $movies = Movie::with(['seances.hall'])
            ->whereHas('seances', function ($query) use ($selectedDate) {
                $query->where('date', $selectedDate);
            })
            ->get()
            ->map(function ($movie) use ($selectedDate) {
                $filteredSeances = $movie->seances->filter(fn($seance) => $seance->date === $selectedDate);

                return (object) [
                    'id'          => $movie->id,
                    'title'       => $movie->title,
                    'poster'      => $movie->poster 
                        ? asset('client/i/' . $movie->poster) 
                        : asset('client/i/poster2.jpg'),
                    'description' => $movie->description,
                    'duration'    => $movie->duration,
                    'country'     => $movie->country,
                    'seances'     => $filteredSeances->values(), // Очищаем ключи коллекции
                ];
            })
            ->filter(fn($movie) => $movie->seances->isNotEmpty()); // Оставляем только фильмы с сеансами

        // Формируем список дат для навигации (7 дней)
        $dates = collect(range(0, 6))->map(fn($dayOffset) => (object) [
            'formatted'   => Carbon::today()->addDays($dayOffset)->toDateString(),
            'day_name'    => Carbon::today()->addDays($dayOffset)->translatedFormat('D'),
            'day_number'  => Carbon::today()->addDays($dayOffset)->format('j'),
            'is_today'    => Carbon::today()->addDays($dayOffset)->isToday(),
            'is_selected' => Carbon::today()->addDays($dayOffset)->toDateString() === $selectedDate,
        ]);

        return view('layouts.client.index', compact('movies', 'dates', 'selectedDate'));
    }
}