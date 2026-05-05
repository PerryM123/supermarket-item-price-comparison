<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Supermarket extends Model
{
    protected $fillable = [
        'name',
    ];

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'item_price')
            ->withPivot('price')
            ->withTimestamps();
    }
}
