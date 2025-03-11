<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleSuggestionsController extends Controller
{
    public function getSuggestions(Request $request)
    {
        $query = $request->input('query', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $suggestions = Article::search($query)
            ->take(5)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'excerpt' => \Str::limit(strip_tags($article->body), 80),
                ];
            });

        return response()->json($suggestions);
    }
}
