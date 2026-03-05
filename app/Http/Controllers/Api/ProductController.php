<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $products = Product::with(['category', 'creator', 'updater'])
            ->latest()
            ->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:active,inactive',

            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        DB::beginTransaction();

        try {

            $validated['slug'] = Str::slug($validated['name']);
            $validated['created_by'] = 1;
            $validated['updated_by'] = 1;

            $product = Product::create($validated);

            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('products', 'public');

                    $product->productImages()->create([
                        'image' => $path
                    ]);
                }
            }

            DB::commit();

            return response()->json(
                $product->load(['category','productImages']),
                201
            );

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'creator', 'updater', 'productImages']);

        $product->productImages->transform(function ($img) {
            $img->image_url = asset('storage/' . $img->image);
            return $img;
        });

        return response()->json($product);
    }

    public function update_(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:active,inactive',

            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        DB::beginTransaction();

        try {

            $validated['slug'] = Str::slug($validated['name']);
            $validated['updated_by'] = 1;

            $product->update($validated);

            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('products', 'public');

                    $product->productImages()->create([
                        'image' => $path
                    ]);
                }
            }

            DB::commit();

            return response()->json(
                $product->load(['category','productImages'])
            );

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ],500);
        }
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:active,inactive',

            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            'existing_images' => 'nullable|array',
            'existing_images.*' => 'exists:product_images,id'
        ]);

        DB::beginTransaction();

        try {

            $validated['slug'] = Str::slug($validated['name']);
            $validated['updated_by'] = 1;

            $product->update($validated);

            /*
            |--------------------------------------------------------------------------
            | DELETE REMOVED IMAGES
            |--------------------------------------------------------------------------
            */

            $existingImageIds = $request->existing_images ?? [];

            $imagesToDelete = $product->productImages()
                ->whereNotIn('id', $existingImageIds)
                ->get();

            foreach ($imagesToDelete as $img) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }

            /*
            |--------------------------------------------------------------------------
            | ADD NEW IMAGES
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('products', 'public');

                    $product->productImages()->create([
                        'image' => $path
                    ]);
                }
            }

            DB::commit();

            return response()->json(
                $product->load(['category','productImages'])
            );

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function destroy(Product $product)
    {
        foreach ($product->images as $image) {

            Storage::disk('public')->delete($image->image);

            $image->delete();
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $product = Product::findOrFail($id);
        $product->status = $validated['status'];
        $product->updated_by = 1; // Replace with auth()->id() later
        $product->save();

        return response()->json([
            'message' => 'Product status updated successfully',
            'product' => $product
        ]);
    }
}
