<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query', '');

        $results = Article::search($query)->simplePaginate(10);

        return Inertia::render('SearchResults', [
            'results' => $results,
            'query' => $query,
        ]);
    }

    public function show(Article $article)
    {
        return $article;
    }
}
