<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\API\ArticleSuggestionsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/articles/search', [ArticleController::class, 'search']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);
Route::get('/api/articles/suggestions', [ArticleSuggestionsController::class, 'getSuggestions']);
