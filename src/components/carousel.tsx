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

function TrendingBooks() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // itemIndex into the extended array [lastBook, ...books, firstBook]
  // index 1 = first real book, index N = last real book
  const [itemIndex, setItemIndex] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);
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

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 768) return 3;
    return 2;
  };

  const updateItemWidth = useCallback(() => {
    if (containerRef.current) {
      setItemWidth(containerRef.current.clientWidth / getVisibleCount());
    }
  }, []);

  useEffect(() => {
    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, [updateItemWidth, books]);

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
    // Land on clone of first → instantly jump to real first (index 1)
    if (itemIndex >= books.length + 1) {
      setAnimating(false);
      setItemIndex(1);
      return;
    }
    // Land on clone of last → instantly jump to real last (index books.length)
    if (itemIndex <= 0) {
      setAnimating(false);
      setItemIndex(books.length);
      return;
    }
    setAnimating(false);
  };

  if (books.length === 0) return null;

  // Extended array: clone of last + all books + clone of first
  const extended = [books[books.length - 1], ...books, books[0]];
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
            {loading ? (
              <p style={{ padding: "20px" }}>Loading...</p>
            ) : (
              extended.map((book, index) => (
                <div
                  key={`${book.id}-${index}`}
                  style={{
                    flex: `0 0 ${itemWidth}px`,
                    padding: "0 10px",
                    boxSizing: "border-box",
                    transition: "transform 0.2s ease",
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
              ))
            )}
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
