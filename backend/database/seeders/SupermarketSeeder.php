<?php

namespace Database\Seeders;

use App\Models\Supermarket;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupermarketSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $supermarkets = ['OKスーパー', 'まいばすけっと', 'ファミマ'];

        foreach ($supermarkets as $name) {
            Supermarket::create(['name' => $name]);
        }
    }
}
