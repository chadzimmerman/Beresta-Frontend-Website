'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Book {
  id: number;
  slug: string;
  title: string;
  cover_photo: string;
  carousel_category?: string | null;
}

const CATEGORY_ORDER = ['japanese', 'russian', 'saints', 'philosophy'];

function interleaveByCategory(books: Book[]): Book[] {
  const buckets: Record<string, Book[]> = { japanese: [], russian: [], saints: [], philosophy: [] };
  books.forEach((book) => {
    const cat = book.carousel_category ?? 'philosophy';
    (buckets[cat] ?? buckets['philosophy']).push(book);
  });
  const result: Book[] = [];
  const maxLen = Math.max(...CATEGORY_ORDER.map((cat) => buckets[cat].length));
  for (let i = 0; i < maxLen; i++) {
    CATEGORY_ORDER.forEach((cat) => {
      if (buckets[cat][i]) result.push(buckets[cat][i]);
    });
  }
  return result;
}

function getVisibleCount(): number {
  if (typeof window === 'undefined') return 5;
  if (window.innerWidth >= 1024) return 5;
  if (window.innerWidth >= 768) return 3;
  return 2;
}

export default function Carousel() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const [itemIndex, setItemIndex] = useState(visibleCount);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('books')
      .select('id, slug, title, cover_photo, carousel_category')
      .then(({ data, error }) => {
        if (!error) setBooks(interleaveByCategory(data ?? []));
        setLoading(false);
      });
  }, []);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const vc = getVisibleCount();
    setVisibleCount(vc);
    setItemWidth(containerRef.current.clientWidth / vc);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, books]);

  useEffect(() => {
    setItemIndex(visibleCount);
  }, [visibleCount]);

  const goNext = () => {
    if (animating || books.length === 0) return;
    setAnimating(true);
    setItemIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (animating || books.length === 0) return;
    setAnimating(true);
    setItemIndex((i) => i - 1);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (itemIndex >= books.length + visibleCount) {
      setAnimating(false);
      setItemIndex(visibleCount);
      return;
    }
    if (itemIndex <= 0) {
      setAnimating(false);
      setItemIndex(books.length);
      return;
    }
    setAnimating(false);
  };

  if (loading || books.length === 0) return null;

  const clonesBefore = books.slice(-visibleCount);
  const clonesAfter = books.slice(0, visibleCount);
  const extended = [...clonesBefore, ...books, ...clonesAfter];
  const translateX = -itemIndex * itemWidth;

  return (
    <div className="trending-books-container">
      <h2 className="trending-title">{t('trendingBooks.title')}</h2>
      <div className="carousel-container">
        <button className="arrow-button left" onClick={goPrev} aria-label="Previous">
          &#8249;
        </button>
        <div style={{ overflow: 'hidden', flex: 1 }} ref={containerRef}>
          <div
            style={{
              display: 'flex',
              transform: `translateX(${translateX}px)`,
              transition: animating ? 'transform 0.4s ease' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                style={{
                  flex: `0 0 ${itemWidth}px`,
                  padding: '0 10px',
                  margin: '0',
                  boxSizing: 'border-box',
                }}
                className="carousel-item"
              >
                <Link href={`/book/${book.slug}`}>
                  <img
                    src={book.cover_photo}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '4px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                      display: 'block',
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button className="arrow-button right" onClick={goNext} aria-label="Next">
          &#8250;
        </button>
      </div>
    </div>
  );
}
