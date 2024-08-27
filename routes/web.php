<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SignalingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/chat', function () {
    return view('welcome');
});
Route::get('/videochat', function () {
    return view('welcome');
});

Route::apiResource('api/items', ItemController::class);

Route::post('/send-message', [ChatController::class, 'sendMessage']);
Route::get('/get-messages', [ChatController::class, 'getMessages']);

Route::post('/signal', [SignalingController::class, 'signal']);

