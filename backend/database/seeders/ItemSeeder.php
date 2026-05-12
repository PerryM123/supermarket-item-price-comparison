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
            '牛乳', '食パン', 'ヨーグルト', '卵', '豆腐', 'バター', '納豆', 'チーズ',
            '鶏もも肉', '豚バラ肉', '牛こま切れ肉', 'サーモン', 'まぐろ', 'えび',
            'キャベツ', '白菜', 'ほうれん草', 'ブロッコリー', 'トマト', 'きゅうり',
            'なす', 'ピーマン', 'にんじん', 'じゃがいも', 'たまねぎ', 'にんにく',
            'しょうが', 'もやし', 'レタス', 'パプリカ', 'ごぼう', 'れんこん',
            'りんご', 'バナナ', 'みかん', 'いちご', 'ぶどう', 'もも', 'なし', 'キウイ',
            'ご飯（パック）', 'うどん', 'そば', 'パスタ', 'ラーメン', 'そうめん',
            '醤油', 'みりん', '酢', '砂糖', '塩', '味噌', 'ケチャップ', 'マヨネーズ',
            'ドレッシング', 'ポン酢', 'めんつゆ', 'だしの素', 'カレールー',
            'サラダ油', 'ごま油', 'オリーブオイル', 'バター（有塩）', 'マーガリン',
            '牛乳（低脂肪）', '豆乳', 'オレンジジュース', 'りんごジュース',
        ];

        foreach ($items as $name) {
            Item::create(['name' => $name, 'image_url' => null]);
        }
    }
}
