<?php

namespace Database\Seeders;

use App\Models\Supermarket;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupermarketSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $prefixes = [
            'スーパー', 'マート', 'フレッシュ', 'ライフ', 'コープ', 'フード',
            'グリーン', 'サニー', 'ハッピー', 'ビッグ', 'デイリー', 'エコ',
            'ナチュラル', 'シティ', 'タウン', 'ファミリー', 'セレクト', 'プレミアム',
            'ローカル', 'ネクスト',
        ];

        $suffixes = [
            '東京店', '渋谷店', '新宿店', '池袋店', '品川店', '上野店', '銀座店',
            '横浜店', '川崎店', '大宮店', '千葉店', '船橋店', '柏店', '浦和店',
            '大阪店', '梅田店', '難波店', '天王寺店', '京都店', '神戸店',
            '名古屋店', '栄店', '金山店', '福岡店', '天神店', '博多店',
            '札幌店', '仙台店', '広島店', '高松店',
            '本店', '北店', '南店', '東店', '西店', '中央店',
            '駅前店', '駅南店', '駅北店', '大型店',
            'モール店', 'ショッピング店', '郊外店', '24時間店', '旗艦店',
            'アベニュー店', 'プラザ店', 'ヒルズ店', 'ゲート店', 'タワー店',
        ];

        $names = [];
        foreach ($prefixes as $prefix) {
            foreach ($suffixes as $suffix) {
                $names[] = $prefix . $suffix;
            }
        }

        shuffle($names);
        $names = array_slice($names, 0, 200);
        $now = now();

        $rows = array_map(fn($name) => [
            'name'       => $name,
            'created_at' => $now,
            'updated_at' => $now,
        ], $names);

        DB::table('supermarkets')->insert($rows);
    }
}
