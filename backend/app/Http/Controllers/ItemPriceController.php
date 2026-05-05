<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemPrice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemPriceController extends Controller
{
    public function store(Request $request, Item $item): JsonResponse
    {
        $validated = $request->validate([
            'supermarket_id' => 'required|integer|exists:supermarkets,id',
            'price'          => 'required|integer|min:0',
        ]);

        $price = $item->prices()->create($validated);

        return response()->json([
            'id'          => $price->id,
            'price'       => $price->price,
            'supermarket' => ['id' => $price->supermarket->id, 'name' => $price->supermarket->name],
        ], 201);
    }

    public function update(Request $request, Item $item, ItemPrice $itemPrice): JsonResponse
    {
        $validated = $request->validate([
            'supermarket_id' => 'sometimes|required|integer|exists:supermarkets,id',
            'price'          => 'sometimes|required|integer|min:0',
        ]);

        $itemPrice->update($validated);

        return response()->json([
            'id'          => $itemPrice->id,
            'price'       => $itemPrice->price,
            'supermarket' => ['id' => $itemPrice->supermarket->id, 'name' => $itemPrice->supermarket->name],
        ]);
    }
}
