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
        try {
            $validated = $request->validate([
                'hall_id' => 'required|exists:halls,id',
                'movie_id' => 'required|exists:movies,id',
                'start_time' => 'required|date_format:H:i',
                'date' => 'required|date',
                'standard_price' => 'required|numeric|min:0',
                'vip_price' => 'required|numeric|min:0',
            ]);

            $hall = \App\Models\Hall::findOrFail($validated['hall_id']);

            // Проверяем, есть ли layout у зала
            if (!$hall->layout) {
                throw new \Exception('У зала нет layout');
            }

            $layout = json_decode($hall->layout, true);

            // Если layout некорректный
            if (!is_array($layout)) {
                throw new \Exception('Ошибка при разборе JSON layout');
            }

            // Добавляем цены в layout
            foreach ($layout as $rowIndex => $row) {
                foreach ($row as $seatIndex => $seat) {
                    if ($seat === 'standard') {
                        $layout[$rowIndex][$seatIndex] = [
                            'type' => 'standard',
                            'price' => $validated['standard_price']
                        ];
                    } elseif ($seat === 'vip') {
                        $layout[$rowIndex][$seatIndex] = [
                            'type' => 'vip',
                            'price' => $validated['vip_price']
                        ];
                    }
                }
            }

            $validated['layout'] = json_encode($layout);

            \Log::info('Перед сохранением:', $validated);

            $seance = Seance::create($validated);

            return response()->json($seance, 201);
        } catch (\Exception $e) {
            \Log::error('Ошибка при создании сеанса: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка при создании сеанса', 'message' => $e->getMessage()], 500);
        }
    }

    public function payment($seanceId)
    {
        $seance = Seance::with(['movie', 'hall'])->find($seanceId);

        if (!$seance) {
            abort(404, 'Сеанс не найден');
        }

        view()->share('seance', $seance);

        return view('layouts.client.payment');
    }

    public function destroy($id)
    {
        $seance = Seance::findOrFail($id);
        $seance->delete();

        return response()->json(['message' => 'Сеанс удален']);
    }

    public function getSeanceLayout($seanceId)
    {
        $seance = Seance::findOrFail($seanceId);

        return response()->json([
            'layout' => json_decode($seance->layout),
            'standard_price' => $seance->standard_price,
            'vip_price' => $seance->vip_price
        ]);
    }

    public function updateLayout(Request $request, $seanceId)
    {
        try {
            $seance = Seance::findOrFail($seanceId);
            $newLayout = json_encode($request->input('layout'));

            // Логируем, какие данные пытаемся записать
            \Log::info("Updating layout for seance {$seanceId}: " . $newLayout);

            // Обновляем layout
            $seance->update([
                'layout' => $newLayout
            ]);

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            \Log::error('Error updating seating layout: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getSeance($seanceId)
    {
        $seance = Seance::findOrFail($seanceId);

        return response()->json([
            'id' => $seance->id,
            'hall_id' => $seance->hall_id,
            'movie_id' => $seance->movie_id,
            'start_time' => $seance->start_time,
            'layout' => $seance->layout ? json_decode($seance->layout) : null,
        ]);
    }
}