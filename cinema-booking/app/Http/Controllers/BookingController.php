<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Seance;
use App\Models\Hall;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function index($seanceId)
    {
        $seance = Seance::with(['hall', 'movie'])->findOrFail($seanceId);
        
        // Генерация списка дат для навигации
        $dates = collect();
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->addDays($i);
            $dates->push((object) [
                'day_name' => $date->format('l'), // название дня недели
                'day_number' => $date->format('d'), // число дня
                'is_today' => $date->isToday(),
                'is_selected' => $date->isSameDay(Carbon::today()),
                'formatted' => $date->toDateString(),
            ]);
        }

        return view('layouts.client.booking', compact('seance', 'dates'));
    }

    public function getSeanceLayout($seanceId) {
        $seance = Seance::with('hall')->findOrFail($seanceId);
        $layout = $seance->hall->layout; // JSON из БД
    
        return response()->json([
            'hall_id' => $seance->hall->id,
            'layout' => $layout['layout'], // Массив мест
            'standard_price' => $layout['standard_price'],
            'vip_price' => $layout['vip_price']
        ]);
    }

    public function bookSeats(Request $request)
    {
        $request->validate([
            'seance_id' => 'required|exists:seances,id',
            'seats' => 'required|array',
            'seats.*' => 'string'
        ]);

        $seance = Seance::findOrFail($request->seance_id);
        
        // Преобразуем layout в массив, если он хранится как JSON-строка
        $layout = is_string($seance->layout) ? json_decode($seance->layout, true) : $seance->layout;


        if (!is_array($layout)) {
            Log::info('Update layout request', request()->all());
            return response()->json(['error' => 'Ошибка структуры layout'], 500);
        }

        foreach ($request->seats as $seat) {
            [$row, $seatNumber] = explode("-", $seat);
            $row = (int) $row;
            $seatNumber = (int) $seatNumber;

            // Проверяем существование ряда и места
            if (isset($layout[$row][$seatNumber]) && $layout[$row][$seatNumber] !== "taken") {
                $layout[$row][$seatNumber] = "taken";
            }
        }

        // Сохраняем обратно как JSON
        $seance->layout = json_encode($layout, JSON_UNESCAPED_UNICODE);
        $seance->save();

        return response()->json(['message' => 'Места успешно забронированы', 'layout' => $layout], 200);
    }


}