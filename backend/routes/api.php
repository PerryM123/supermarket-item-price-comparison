<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemPriceController;
use App\Http\Controllers\SupermarketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('items', ItemController::class);
Route::get('/items/{item}/prices', [ItemPriceController::class, 'index']);
Route::post('/items/{item}/prices', [ItemPriceController::class, 'store']);
Route::put('/items/{item}/prices/{itemPrice}', [ItemPriceController::class, 'update']);
Route::apiResource('supermarkets', SupermarketController::class);

Route::get('/health', fn() => response('ok', 200));
