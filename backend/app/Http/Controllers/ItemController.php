<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Item::all()->map(fn($item) => [
            'id'         => $item->id,
            'name'       => $item->name,
            'image_url'  => $this->imageUrl($item->image_url),
            'created_at' => $item->created_at->format('Y-m-d\TH:i:s\Z'),
            'updated_at' => $item->updated_at->format('Y-m-d\TH:i:s\Z'),
        ]);

        return response()->json(['items' => $items]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'image' => 'nullable|mimetypes:image/jpeg,image/png,image/gif,image/webp,image/avif|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('items', 'garage');
        }

        $item = Item::create(['name' => $validated['name'], 'image_url' => $imagePath]);

        return response()->json($item, 201);
    }

    public function show(Item $item): JsonResponse
    {
        $item->load('prices.supermarket');

        return response()->json([
            'id'         => $item->id,
            'name'       => $item->name,
            'image_url'  => $this->imageUrl($item->image_url),
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
        try {
            $validated = $request->validate([
                'name'  => 'sometimes|required|string|max:255',
                'image' => 'nullable|mimetypes:image/jpeg,image/png,image/gif,image/webp,image/avif|max:5120',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::info("Validation errors", $e->errors());
            throw $e;
        }
        if ($request->hasFile('image')) {
            $this->deleteOldImage($item->image_url);
            $validated['image_url'] = $request->file('image')->store('items', 'garage');
        }

        unset($validated['image']);
        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(Item $item): JsonResponse
    {
        $item->delete();

        return response()->json(null, 204);
    }

    private function imageUrl(?string $stored): ?string
    {
        if (!$stored) {
            return null;
        }

        $path = $this->extractPath($stored);

        return Cache::remember('signed_url:' . md5($path), now()->addMinutes(55), function () use ($path) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('garage-public');

            return $disk->temporaryUrl($path, now()->addHour(), [
                'ResponseCacheControl' => 'public, max-age=3600',
            ]);
        });
    }

    private function extractPath(string $stored): string
    {
        // Handle legacy rows that stored the full URL
        $base   = rtrim(config('filesystems.disks.garage-public.endpoint'), '/');
        $bucket = config('filesystems.disks.garage-public.bucket');
        $prefix = "{$base}/{$bucket}/";

        if (str_starts_with($stored, $prefix)) {
            return substr($stored, strlen($prefix));
        }

        return $stored;
    }

    private function deleteOldImage(?string $stored): void
    {
        if (!$stored) {
            return;
        }

        $path = $this->extractPath($stored);
        Cache::forget('signed_url:' . md5($path));
        Storage::disk('garage')->delete($path);
    }
}
