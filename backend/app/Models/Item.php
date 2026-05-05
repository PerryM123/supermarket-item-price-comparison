<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'image_url',
    ];

    public function prices(): HasMany
    {
        return $this->hasMany(ItemPrice::class);
    }

    public function supermarkets(): BelongsToMany
    {
        return $this->belongsToMany(Supermarket::class, 'item_price')
            ->withPivot('price')
            ->withTimestamps();
    }
}
