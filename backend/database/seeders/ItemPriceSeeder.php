<?php

namespace Database\Seeders;

use App\Models\ItemPrice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemPriceSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // [item_id, supermarket_id, price]
        $prices = [
            [1, 1, 169],
            [1, 2, 199],
            [1, 3, 143],
            [2, 1, 171],
            [2, 2, 127],
            [2, 3, 222],
            [3, 1, 144],
            [3, 2, 152],
            [3, 3, 188],
        ];

        foreach ($prices as [$itemId, $supermarketId, $price]) {
            ItemPrice::create([
                'item_id'        => $itemId,
                'supermarket_id' => $supermarketId,
                'price'          => $price,
            ]);
        }
    }
}
