<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hall;

class HallPriceController extends Controller
{
    public function show($id)
{
    $hall = Hall::find($id);

    if (!$hall) {
        return response()->json(['error' => 'Hall not found'], 404);
    }

    return response()->json([
        'standard_price' => $hall->standard_price ?? 0,
        'vip_price' => $hall->vip_price ?? 0,
    ]);
}


    public function update(Request $request, Hall $hall)
    {
        $request->validate([
            'standard' => 'required|integer|min:0',
            'vip' => 'required|integer|min:0'
        ]);

        $hall->update([
            'standard_price' => $request->standard,
            'vip_price' => $request->vip
        ]);

        return response()->json(['status' => 'success']);
    }
}
