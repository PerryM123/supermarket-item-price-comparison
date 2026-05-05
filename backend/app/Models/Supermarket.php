<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Supermarket extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
    ];

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d\TH:i:s\Z');
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'item_price')
            ->withPivot('price')
            ->withTimestamps();
    }
}
