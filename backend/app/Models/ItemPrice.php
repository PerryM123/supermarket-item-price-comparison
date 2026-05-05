<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemPrice extends Model
{
    protected $table = 'item_price';

    protected $fillable = [
        'item_id',
        'supermarket_id',
        'price',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function supermarket(): BelongsTo
    {
        return $this->belongsTo(Supermarket::class);
    }
}
