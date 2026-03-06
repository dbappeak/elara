<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Helpers\ApiResponse;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $per_page = request()->input('per_page', 10);
        $categories = Category::latest()->paginate($per_page);
        return ApiResponse::success($categories, "Categories retrieved successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //'name', 'slug', 'status'
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $category = Category::create($validated);
        return ApiResponse::success($category, "Category created successfully", Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::findOrFail($id);
        return ApiResponse::success($category, "Category retrieved successfully");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $category->update($validated);

        return ApiResponse::success($category, "Category updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return ApiResponse::success(null, "Category deleted successfully");
    }

    // Route::patch('/categories/{id}/status', [CategoryController::class, 'updateStatus']);
    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $category = Category::findOrFail($id);
        $category->status = $validated['status'];
        $category->save();

        return ApiResponse::success($category, "Category status updated successfully");
    }

    public function getAllCategories()
    {
        $categories = Category::where('status', 'active')->get();
        return ApiResponse::success($categories, "Categories retrieved successfully");
    }
}
