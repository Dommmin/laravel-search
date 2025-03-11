import { Head, Link } from '@inertiajs/react';
import { Article } from '@/types';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface SearchResultsProps {
    results: {
        data: Article[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        first_page_url: string;
        path: string;
        per_page: number;
        from: number;
        to: number;
    };
    query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
    const getPageUrl = (page: number) => {
        return `${results.path}?${new URLSearchParams({
            query: query,
            page: page.toString(),
        })}`;
    };

    return (
        <div className="container mx-auto p-4">
            <Head>
                <title>Search Results</title>
            </Head>

            <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

            {results.data.length > 0 ? (
                <>
                    <div className="space-y-2 mb-6">
                        <p className="text-sm text-muted-foreground">
                            Showing {results.from} to {results.to} results
                        </p>

                        {results.data.map((article) => (
                            <div key={article.id} className="p-2 border rounded">
                                <h3 className="font-bold">{article.title}</h3>
                                <p>{article.body}</p>
                            </div>
                        ))}
                    </div>

                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <Link
                                    href={results.prev_page_url || '#'}
                                    disabled={!results.prev_page_url}
                                    prefetch={['mount', 'hover']}
                                    preserveScroll
                                    cacheFor="1m"
                                >
                                    <PaginationPrevious
                                        className={!results.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}
                                    />
                                </Link>
                            </PaginationItem>

                            <PaginationItem>
                                <Link
                                    href={results.next_page_url || '#'}
                                    disabled={!results.next_page_url}
                                    prefetch={['mount', 'hover']}
                                    cacheFor={['30s', '1m']}
                                    preserveScroll
                                >
                                    <PaginationNext
                                        className={!results.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}
                                    />
                                </Link>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            ) : (
                <p>No results found.</p>
            )}

            <Link href={route('dashboard')} className="mt-4 inline-block text-blue-500">
                Go back
            </Link>
        </div>
    );
}
