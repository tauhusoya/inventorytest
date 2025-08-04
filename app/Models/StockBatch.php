<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'batch_number',
        'initial_quantity',
        'remaining_quantity',
        'expiry_date',
        'notes',
        'user_id'
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'initial_quantity' => 'integer',
        'remaining_quantity' => 'integer'
    ];

    protected $appends = [
        'age',
        'is_depleted',
        'is_expired'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class, 'batch_id', 'batch_number');
    }

    public function getAgeAttribute()
    {
        return $this->created_at->diffInDays(now());
    }

    public function getIsDepletedAttribute()
    {
        return $this->remaining_quantity <= 0;
    }

    public function getIsExpiredAttribute()
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }
}
