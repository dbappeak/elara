<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{ProductController, CategoryController};

Route::apiResource('products', ProductController::class);
Route::patch('/product-status/{id}', [ProductController::class, 'updateStatus']);
Route::get('/product-export', [ProductController::class, 'export'])->name('product.export');
Route::post('/product-import', [ProductController::class, 'import']);
Route::get('/product-demo-sheet', [ProductController::class, 'demoSheet'])->name('product.demoSheet');

Route::apiResource('categories', CategoryController::class);
Route::patch('/category-status/{id}', [CategoryController::class, 'updateStatus']);
Route::get('/active-categories', [CategoryController::class, 'getAllCategories']);


