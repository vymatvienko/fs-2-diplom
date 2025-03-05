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

        $movies = Movie::with(['seances.hall'])
            ->whereHas('seances', function ($query) use ($selectedDate) {
                $query->whereDate('start_time', $selectedDate);
            })
            ->get()
            ->map(function ($movie) {
                return (object) [
                    'id'          => $movie->id,
                    'title'       => $movie->title,
                    'poster'      => $movie->poster 
                        ? asset('client/i/poster1.jpg' . $movie->poster) 
                        : asset('client/i/poster2.jpg'),
                    'description' => $movie->description,
                    'duration'    => $movie->duration,
                    'country'     => $movie->country,
                    'seances'     => $movie->seances, // Оставляем как есть, чтобы в шаблоне работать с коллекцией
                ];
            });

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