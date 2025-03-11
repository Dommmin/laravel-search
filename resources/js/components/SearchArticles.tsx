import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Article } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Suggestion extends Pick<Article, 'id' | 'title'> {
    excerpt?: string;
}

interface FormData {
    query: string;
}

export default function SearchArticles() {
    const { data, setData, get, processing } = useForm<FormData>({
        query: '',
    });

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const fetchSuggestions = () => {
        if (data.query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        setSuggestions([]);

        axios.get<Suggestion[]>('/api/articles/suggestions', { params: { query: data.query } })
            .then(response => {
                setSuggestions(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.query.trim()) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [data.query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (data.query.trim()) {
            get('/articles/search');
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setData('query', suggestion.title);
        setShowSuggestions(false);
        window.location.href = `/articles/${suggestion.id}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col relative">
                <form ref={formRef} onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={data.query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setData('query', e.target.value);
                            setShowSuggestions(true);
                            if (e.target.value.trim().length < 2) {
                                setSuggestions([]);
                                setIsLoading(false);
                            }
                        }}
                        placeholder="Search articles..."
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? 'Searching...' : 'Search'}
                    </Button>
                </form>

                {showSuggestions && data.query.trim().length > 1 && (
                    <div
                        ref={suggestionsRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground rounded-md border shadow-lg z-50"
                    >
                        <ScrollArea className="h-60 rounded-md border">
                            {isLoading ? (
                                <div className="p-4 text-muted-foreground text-sm">Loading suggestions...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-4 hover:bg-accent cursor-pointer transition-colors border-b"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <div className="font-medium">{suggestion.title}</div>
                                        {suggestion.excerpt && (
                                            <div className="text-sm text-muted-foreground mt-1">{suggestion.excerpt}</div>
                                        )}
                                    </div>
                                ))
                            ) : data.query.trim().length >= 2 && !isLoading ? (
                                <div className="p-4 text-muted-foreground text-sm">No suggestions found</div>
                            ) : null}
                        </ScrollArea>
                    </div>
                )}
            </div>
        </div>
    );
}
