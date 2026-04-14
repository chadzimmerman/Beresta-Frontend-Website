import React, { useEffect, useState, useRef } from "react";
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

  // Once books load, jump to the middle set so both directions have room
  useEffect(() => {
    if (books.length === 0 || !carouselRef.current) return;
    const el = carouselRef.current;
    const itemWidth = el.scrollWidth / (books.length * 3);
    el.scrollLeft = itemWidth * books.length;
  }, [books]);

  // Teleport silently ONLY after all scroll momentum has fully stopped
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || books.length === 0) return;

    const teleport = () => {
      const itemWidth = el.scrollWidth / (books.length * 3);
      const setWidth = itemWidth * books.length;
      if (el.scrollLeft < setWidth * 0.5) {
        el.scrollLeft += setWidth;
      } else if (el.scrollLeft > setWidth * 2 - el.clientWidth) {
        el.scrollLeft -= setWidth;
      }
    };

    // scrollend fires after momentum + snap animation fully settle — no visible jump
    el.addEventListener("scrollend", teleport, { passive: true });
    return () => el.removeEventListener("scrollend", teleport);
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el || books.length === 0) return;
    const itemWidth = el.scrollWidth / (books.length * 3);
    el.scrollBy({ left: direction === "right" ? itemWidth : -itemWidth, behavior: "smooth" });
  };

  const tripleBooks = [...books, ...books, ...books];

  return (
    <div className="trending-books-container">
      <h2 className="trending-title">{t("trendingBooks.title")}</h2>
      <div className="carousel-container">
        <button className="arrow-button left" onClick={() => scroll("left")} aria-label="Previous">
          &#8249;
        </button>

        <div className="carousel" ref={carouselRef}>
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
