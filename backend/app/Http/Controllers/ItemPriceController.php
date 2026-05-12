<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemPrice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ItemPriceController extends Controller
{
    public function index(Request $request, Item $item): JsonResponse
    {
        $sortBy  = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'asc') === 'desc' ? 'desc' : 'asc';

        $query = $item->prices()->with('supermarket');

        if ($sortBy === 'supermarket') {
            $query->join('supermarkets', 'item_price.supermarket_id', '=', 'supermarkets.id')
                  ->select('item_price.*')
                  ->orderBy('supermarkets.name', $sortDir);
        } else {
            $column = in_array($sortBy, ['id', 'price', 'created_at']) ? $sortBy : 'id';
            $query->orderBy("item_price.{$column}", $sortDir);
        }

        $paginated = $query->paginate(20);
        // TODO: 動作確認用です。確認が終わり次第、以下のログを削除
        Log::info("return item prices here");
        return response()->json([
            'data' => collect($paginated->items())->map(fn($p) => [
                'id'          => $p->id,
                'price'       => $p->price,
                'created_at'  => $p->created_at->format('Y-m-d\TH:i:s\Z'),
                'supermarket' => ['id' => $p->supermarket->id, 'name' => $p->supermarket->name],
            ]),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

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
