<?php

namespace App\Http\Controllers;

use App\Models\Supermarket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupermarketController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['supermarkets' => Supermarket::all()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $supermarket = Supermarket::create($validated);

        return response()->json($supermarket, 201);
    }

    public function show(Supermarket $supermarket): JsonResponse
    {
        return response()->json($supermarket);
    }

    public function update(Request $request, Supermarket $supermarket): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
        ]);

        $supermarket->update($validated);

        return response()->json($supermarket);
    }

    public function destroy(Supermarket $supermarket): JsonResponse
    {
        $supermarket->delete();

        return response()->json(null, 204);
    }
}
