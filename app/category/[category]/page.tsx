'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!category) return;
    supabase
      .from('books')
      .select('id, slug, title, authors, cover_photo')
      .contains('tags', [category])
      .then(({ data, error }) => {
        if (!error && data) setBooks(data);
      });
  }, [category]);

  return (
    <div className="app-page-wrapper">
      <AltHeader />
      <div className="category-content-and-stretch">
        <div className="category-page-container">
          <h1 className="category-title">{decodeURIComponent(category ?? '')}</h1>
          <div className="category-grid">
            {books.map((book) => (
              <div key={book.id} className="category-card">
                <img
                  src={book.cover_photo}
                  alt={book.title}
                  className="category-cover-image"
                  onClick={() => router.push(`/book/${book.slug}`)}
                />
                <h3 className="category-book-title">{book.title}</h3>
                <p className="category-author">{book.authors}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
