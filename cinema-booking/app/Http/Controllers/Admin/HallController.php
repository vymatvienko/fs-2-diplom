<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hall;
use Illuminate\Http\Request;

class HallController extends Controller
{
    public function index()
    {
        return response()->json(Hall::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        $defaultLayout = json_encode(array_fill(0, 5, array_fill(0, 6, 'standard')));

        $hall = Hall::create([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'layout' => $defaultLayout, 
        ]);
    
        return response()->json($hall, 201);
    }

    public function update(Request $request, Hall $hall)
    {
        $request->validate([
            'standard_price' => 'required|integer|min:1',
            'vip_price' => 'required|integer|min:1',
            'layout' => 'required|array', 
        ]);

        $hall->update([
            'standard_price' => $request->standard_price,
            'vip_price' => $request->vip_price,
            'layout' => $request->layout,
        ]);

        return response()->json(['message' => 'Hall updated successfully']);
    }

    public function updateSeats(Request $request, Hall $hall)
    {
        $validated = $request->validate([
            'rows' => 'required|integer|min:1',
            'seats' => 'required|integer|min:1'
        ]);

        $hall->capacity = $validated['rows'] * $validated['seats'];
        $hall->layout = array_fill(0, $validated['rows'], array_fill(0, $validated['seats'], 'standard'));
        $hall->save();

        return response()->json(['message' => 'Количество рядов и мест обновлено!']);
    }

    public function destroy($id)
    {
        Hall::findOrFail($id)->delete();
        return response()->json(['message' => 'Hall deleted']);
    }

    public function getLayout($id)
    {
        $hall = Hall::findOrFail($id);
        return response()->json([
            'rows' => $hall->rows ?? 10,
            'seats' => $hall->seats ?? 8,
            'layout' => json_decode($hall->layout) ?? [],
            'standard_price' => $hall->standard_price ?? 0,
            'vip_price' => $hall->vip_price ?? 0,
        ]);
    }

    public function saveLayout(Request $request, $id)
    {
        $hall = Hall::findOrFail($id);

        $validated = $request->validate([
            'rows' => 'required|integer|min:1',
            'seats' => 'required|integer|min:1',
            'layout' => 'required|array',
            'standard_price' => 'required|integer|min:0',
            'vip_price' => 'required|integer|min:0',
        ]);

        $hall->update([
            'rows' => $validated['rows'],
            'seats' => $validated['seats'],
            'layout' => json_encode($validated['layout']),
            'standard_price' => $validated['standard_price'],
            'vip_price' => $validated['vip_price'],
        ]);

        return response()->json(['message' => 'Layout updated successfully']);
    }

}
