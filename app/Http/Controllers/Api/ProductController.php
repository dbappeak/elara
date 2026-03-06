<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ApiResponse;
use Symfony\Component\HttpFoundation\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsExport;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 10;

        $products = Product::with('category')

            ->when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            })

            ->when($request->category, function ($q) use ($request) {
                $q->where('category_id', $request->category);
            })

            ->when($request->min_price, function ($q) use ($request) {
                $q->where('price', '>=', $request->min_price);
            })

            ->when($request->max_price, function ($q) use ($request) {
                $q->where('price', '<=', $request->max_price);
            })

            ->orderBy(
                $request->sort_by ?? 'id',
                $request->sort_dir ?? 'desc'
            )

            ->paginate($perPage);

        return ApiResponse::success($products, "Products fetched successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
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

            return ApiResponse::success(
                $product->load(['category', 'productImages']),
                "Product created successfully blah blah",
                Response::HTTP_CREATED
            );

        } catch (\Exception $e) {

            DB::rollBack();
            return ApiResponse::error(
                null,
                'Something went wrong: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
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

        return ApiResponse::success($product, "Product retrieved successfully");
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
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

            $existingImageIds = $request->existing_images ?? [];

            $imagesToDelete = $product->productImages()
                ->whereNotIn('id', $existingImageIds)
                ->get();

            foreach ($imagesToDelete as $img) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }

            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('products', 'public');

                    $product->productImages()->create([
                        'image' => $path
                    ]);
                }
            }

            DB::commit();

            return ApiResponse::success(
                $product->load(['category', 'productImages']),
                "Product updated successfully"
            );

        } catch (\Exception $e) {

            DB::rollBack();

            return ApiResponse::error(
                null,
                'Something went wrong: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function destroy(Product $product)
    {
        if ($product->productImages()->count() > 0) {
            foreach ($product->images as $image) {

                Storage::disk('public')->delete($image->image);

                $image->delete();
            }
        }

        $product->delete();

        return ApiResponse::success(null, "Product deleted successfully");
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

        return ApiResponse::success($product, "Product status updated successfully");
    }
    public function export(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'category' => $request->category,
            'min_price' => $request->min_price,
            'max_price' => $request->max_price,
            'sort_by' => $request->sort_by,
            'sort_dir' => $request->sort_dir,
        ];

        return Excel::download(new ProductsExport($filters), 'products.xlsx');
    }

    public function demoSheet()
    {
        $data = collect([
            ['Name','Price','Category','Status'],
            ['iPhone 15',1000,'Electronics','active'],
            ['Samsung TV',700,'Electronics','active'],
        ]);

        return Excel::download(new class($data) implements \Maatwebsite\Excel\Concerns\FromCollection {

            private $data;

            public function __construct($data)
            {
                $this->data = $data;
            }

            public function collection()
            {
                return $this->data;
            }

        }, 'product_demo.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        $rows = Excel::toArray([], $request->file('file'))[0];

        unset($rows[0]); // remove header

        foreach ($rows as $row) {

            $category = Category::where('name',$row[2])->first();

            if (!$category) {
                $category = Category::create([
                    'name' => $row[2]
                ]);
            }

            Product::create([
                'name' => $row[0],
                'price' => $row[1],
                'category_id' => $category?->id,
                'status' => $row[3] ?? 'active',
            ]);
        }

        return ApiResponse::success([], "Products imported successfully");
    }
}
