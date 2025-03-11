<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Article extends Model
{
    use HasFactory, Searchable;

    protected $guarded = [];

    public function toSearchableArray()
    {
        return [
            'article_id' => (string) $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'created_at' => $this->created_at->timestamp,
        ];
    }
}
