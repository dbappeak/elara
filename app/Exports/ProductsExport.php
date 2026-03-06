<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductsExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Product::with('category');

        if (!empty($this->filters['search'])) {
            $query->where('name', 'like', '%' . $this->filters['search'] . '%');
        }

        if (!empty($this->filters['category'])) {
            $query->where('category_id', $this->filters['category']);
        }

        if (!empty($this->filters['min_price'])) {
            $query->where('price', '>=', $this->filters['min_price']);
        }

        if (!empty($this->filters['max_price'])) {
            $query->where('price', '<=', $this->filters['max_price']);
        }

        if (!empty($this->filters['sort_by'])) {
            $query->orderBy(
                $this->filters['sort_by'],
                $this->filters['sort_dir'] ?? 'desc'
            );
        }

        return $query->get()->map(function ($product) {
            return [
                'Name' => $product->name,
                'Price' => $product->price,
                'Category' => $product->category?->name ?? 'Uncategorized',
                'Status' => $product->status,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Name',
            'Price',
            'Category',
            'Status'
        ];
    }
}