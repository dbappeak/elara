<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Product, Category};
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        foreach ($categories as $category) {
            for ($i = 1; $i <= 3; $i++) {

                $name = $category->name . " Product " . $i;

                Product::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => fake()->paragraph(),
                    'image' => 'products/default.png',
                    'status' => 'active',
                    'price' => rand(100, 1000),
                    'quantity' => rand(1, 50),
                    'category_id' => $category->id,
                    'created_by' => 1,
                    'updated_by' => 1,
                ]);
            }
        }
    }
}
