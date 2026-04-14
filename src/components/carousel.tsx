import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface Book {
  id: number;
  slug: string;
  title: string;
  cover_photo: string;
}

function getVisibleCount(): number {
  if (typeof window === "undefined") return 5;
  if (window.innerWidth >= 1024) return 5;
  if (window.innerWidth >= 768) return 3;
  return 2;
}

function TrendingBooks() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  // itemIndex points into the extended array.
  // extended = [last N clones | real books | first N clones]
  // Real books start at index `visibleCount`, so we initialize there.
  const [itemIndex, setItemIndex] = useState(visibleCount);
  const [animating, setAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("id, slug, title, cover_photo");
        if (error) throw error;
        setBooks(data ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const vc = getVisibleCount();
    setVisibleCount(vc);
    setItemWidth(containerRef.current.clientWidth / vc);
  }, []);

  // Measure on mount, after books load, and on resize
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, books]);

  // When visibleCount changes (resize), keep itemIndex pointing at the
  // same real book by clamping to the new clone boundary
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

  const handleTransitionEnd = () => {
    // Entered the trailing clone zone → jump back to real start
    if (itemIndex >= books.length + visibleCount) {
      setAnimating(false);
      setItemIndex(visibleCount);
      return;
    }
    // Entered the leading clone zone → jump to real end
    if (itemIndex <= 0) {
      setAnimating(false);
      setItemIndex(books.length);
      return;
    }
    setAnimating(false);
  };

  if (loading || books.length === 0) return null;

  // Clone visibleCount items at each end so every visible slot is filled
  const clonesBefore = books.slice(-visibleCount);
  const clonesAfter = books.slice(0, visibleCount);
  const extended = [...clonesBefore, ...books, ...clonesAfter];

  const translateX = -itemIndex * itemWidth;

  return (
    <div className="trending-books-container">
      <h2 className="trending-title">{t("trendingBooks.title")}</h2>
      <div className="carousel-container">
        <button className="arrow-button left" onClick={goPrev} aria-label="Previous">
          &#8249;
        </button>

        {/* Clipping window */}
        <div style={{ overflow: "hidden", flex: 1 }} ref={containerRef}>
          {/* Sliding track */}
          <div
            style={{
              display: "flex",
              transform: `translateX(${translateX}px)`,
              transition: animating ? "transform 0.4s ease" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                style={{
                  flex: `0 0 ${itemWidth}px`,
                  padding: "0 10px",
                  boxSizing: "border-box",
                }}
                className="carousel-item"
              >
                <Link to={`/book/${book.slug}`}>
                  <img
                    src={book.cover_photo}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                      display: "block",
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

export default TrendingBooks;
