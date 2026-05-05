<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $items = [
            ['name' => '牛乳',     'image_url' => 'some_url.com/1.jpg'],
            ['name' => '食パン',   'image_url' => 'some_url.com/2.jpg'],
            ['name' => 'ヨーグルト', 'image_url' => 'some_url.com/3.jpg'],
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
    }
}
