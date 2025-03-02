<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    public function index()
    {
        return response()->json(Seance::with(['hall', 'movie'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hall_id' => 'required|exists:halls,id',
            'movie_id' => 'required|exists:movies,id',
            'start_time' => 'required|date_format:H:i',
        ]);

        $seance = Seance::create($validated);
        return response()->json($seance, 201);
    }

    public function destroy($id)
    {
        $seance = Seance::findOrFail($id);
        $seance->delete();

        return response()->json(['message' => 'Сеанс удален']);
    }
}
