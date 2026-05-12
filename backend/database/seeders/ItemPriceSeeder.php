<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Supermarket;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemPriceSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $itemIds = Item::pluck('id')->all();
        $supermarketIds = Supermarket::pluck('id')->all();
        $now = now();

        $rows = [];
        foreach ($itemIds as $itemId) {
            foreach ($supermarketIds as $supermarketId) {
                $rows[] = [
                    'item_id'        => $itemId,
                    'supermarket_id' => $supermarketId,
                    'price'          => rand(100, 1000),
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('item_price')->insert($chunk);
        }
    }
}
