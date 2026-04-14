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
  const carouselRef = useRef<HTMLDivElement>(null);
  const isJumping = useRef(false);

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

  // After books load, scroll to the middle set so both directions work
  useEffect(() => {
    if (books.length === 0 || !carouselRef.current) return;
    const el = carouselRef.current;
    const itemWidth = el.scrollWidth / (books.length * 3);
    el.scrollLeft = itemWidth * books.length;
  }, [books]);

  // When near the edges, silently teleport to the equivalent position in the middle set
  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el || books.length === 0 || isJumping.current) return;

    const itemWidth = el.scrollWidth / (books.length * 3);
    const setWidth = itemWidth * books.length;

    if (el.scrollLeft < setWidth * 0.25) {
      isJumping.current = true;
      el.scrollLeft += setWidth;
      isJumping.current = false;
    } else if (el.scrollLeft > setWidth * 2 - el.clientWidth * 0.5) {
      isJumping.current = true;
      el.scrollLeft -= setWidth;
      isJumping.current = false;
    }
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el || books.length === 0) return;
    const itemWidth = el.scrollWidth / (books.length * 3);
    el.scrollBy({ left: direction === "right" ? itemWidth : -itemWidth, behavior: "smooth" });
  };

  // Render books three times for seamless infinite wrapping
  const tripleBooks = [...books, ...books, ...books];

  return (
    <div className="trending-books-container">
      <h2 className="trending-title">{t("trendingBooks.title")}</h2>
      <div className="carousel-container">
        <button className="arrow-button left" onClick={() => scroll("left")} aria-label="Previous">
          &#8249;
        </button>

        <div className="carousel" ref={carouselRef} onScroll={handleScroll}>
          {loading ? (
            <p style={{ padding: "20px" }}>Loading...</p>
          ) : (
            tripleBooks.map((book, index) => (
              <div className="carousel-item" key={`${book.id}-${index}`}>
                <Link to={`/book/${book.slug}`}>
                  <img
                    src={book.cover_photo}
                    alt={book.title}
                    style={{
                      borderRadius: "4px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    }}
                  />
                </Link>
              </div>
            ))
          )}
        </div>

        <button className="arrow-button right" onClick={() => scroll("right")} aria-label="Next">
          &#8250;
        </button>
      </div>
    </div>
  );
}

export default TrendingBooks;
