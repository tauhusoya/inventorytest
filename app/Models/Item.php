<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'name',
        'description',
        'brand',
        'model',
        'cost',
        'retail',
        'quantity',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'retail' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class);
    }

    public function stockBatches()
    {
        return $this->hasMany(StockBatch::class);
    }
}
