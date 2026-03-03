<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products'; 
    protected $fillable = [ 'name', 'description', 'image', 'status', 'slug', 'price', 'quantity', 'category_id', 'created_by', 'updated_by', ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
    protected $hidden = ['created_at', 'updated_at'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
