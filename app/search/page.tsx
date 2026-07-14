'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AltHeader from '@/components/AltHeader';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import '@/lib/i18n';

interface Book {
  id: number;
  slug: string;
  title: string;
  authors: string;
  cover_photo: string;
  status: 'available' | 'upcoming';
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Strip characters with special meaning in PostgREST filter strings
    // (clause separators, wildcards, array-literal braces) to prevent injection
    const safeQuery = query.replace(/[%_(){},"\\]/g, ' ').trim();
    if (!safeQuery) { setBooks([]); setLoading(false); return; }
    setLoading(true);
    supabase
      .from('books')
      .select('id, slug, title, authors, cover_photo, status')
      .or(`title.ilike.%${safeQuery}%,authors.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,tags.cs.{"${safeQuery}"}`)
      .then(({ data }) => { setBooks(data ?? []); setLoading(false); });
  }, [query]);

  return (
    <div className="app-page-wrapper">
      <AltHeader />
      <div className="search-results-content">
        <h1 className="search-results-title">
          {loading ? 'Searching...' : `${books.length} result${books.length !== 1 ? 's' : ''} for "${query}"`}
        </h1>
        {!loading && books.length === 0 && (
          <p className="search-no-results">No books found matching your search. Try a different keyword.</p>
        )}
        <div className="search-results-grid">
          {books.map((book) => (
            <div key={book.id} className="search-result-card" onClick={() => router.push(`/book/${book.slug}`)}>
              <div className="search-result-cover-wrapper">
                <img src={book.cover_photo} alt={book.title} className="search-result-cover" />
                {book.status === 'upcoming' && <span className="search-result-badge">Coming Soon</span>}
              </div>
              <h3 className="search-result-book-title">{book.title}</h3>
              <p className="search-result-author">{book.authors}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Searching...</div>}>
      <SearchResults />
    </Suspense>
  );
}
