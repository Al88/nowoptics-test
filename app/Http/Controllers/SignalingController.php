<?php
namespace App\Http\Controllers;

use App\Events\Signaling;
use Illuminate\Http\Request;
use App\Events\SignalingEvent;

class SignalingController extends Controller
{
    public function signal(Request $request)
    {
        $validatedData = $request->validate([
            'channel' => 'required|string',
            'event' => 'required|string',
            'data' => 'required|array',
        ]);

        // Emitir el evento de señalización
        event(new Signaling($validatedData['data']));

        return response()->json(['status' => 'Message sent']);
    }
}
