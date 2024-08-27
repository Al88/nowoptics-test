<?php

use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;
Route::group(['middleware' => ['api']], function() {

    Route::apiResource('items', ItemController::class);
});
