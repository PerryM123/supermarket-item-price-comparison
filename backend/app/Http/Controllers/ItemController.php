<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Item::all()->map(fn($item) => [
            'id'         => $item->id,
            'name'       => $item->name,
            'image_url'  => $item->image_url,
            'created_at' => $item->created_at->format('Y-m-d\TH:i:s\Z'),
            'updated_at' => $item->updated_at->format('Y-m-d\TH:i:s\Z'),
        ]);

        return response()->json(['items' => $items]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image_url' => 'nullable|url|max:255',
        ]);

        $item = Item::create($validated);

        return response()->json($item, 201);
    }

    public function show(Item $item): JsonResponse
    {
        $item->load('prices.supermarket');

        return response()->json([
            'id'         => $item->id,
            'name'       => $item->name,
            'image_url'  => $item->image_url,
            'created_at' => $item->created_at->format('Y-m-d\TH:i:s\Z'),
            'updated_at' => $item->updated_at->format('Y-m-d\TH:i:s\Z'),
            'prices'     => $item->prices->map(fn($p) => [
                'id'          => $p->id,
                'price'       => $p->price,
                'supermarket' => ['id' => $p->supermarket->id, 'name' => $p->supermarket->name],
            ]),
        ]);
    }

    public function update(Request $request, Item $item): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image_url' => 'nullable|url|max:255',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(Item $item): JsonResponse
    {
        $item->delete();

        return response()->json(null, 204);
    }
}
