<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\Signaling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = $request->input('message');
        $username = $request->input('username');

        $chatMessage = [
            'user' => $username,
            'message' => $message,
            'time' => now()->toDateTimeString(),
        ];

        // Guarda el mensaje en una lista de Redis
        Redis::rpush('chat_messages', json_encode($chatMessage));

        // Publica el evento en Pusher
        event(new MessageSent($username, $message));

        return response()->json(['status' => 'Message Sent!']);
    }

    public function getMessages()
    {
        // Recupera todos los mensajes de Redis
        $messages = Redis::lrange('chat_messages', 0, -1);

        // Decodifica los mensajes
        $messages = array_map(function ($message) {
            return json_decode($message, true);
        }, $messages);


        return response()->json($messages);
    }
}
