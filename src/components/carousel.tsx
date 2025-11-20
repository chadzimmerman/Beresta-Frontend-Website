import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

interface Book {
  id: number;
  title: string;
  cover_photo: string;
  // Add other properties if needed
}

function TrendingBooks() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Supabase client using NEXT_PUBLIC env vars
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // Fetch books from the backend when the component mounts
  // useEffect(() => {
  //   const fetchBooks = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_BASE_URL}/api/books`
  //       ); //changed from const response = await fetch("http://localhost:3000/api/books");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log("Fetched books:", data);
  //       setBooks(data);
  //     } catch (error) {
  //       console.error("Error fetching books:", error);
  //     } finally {
  //       setLoading(false); // Set loading to false after fetch
  //     }
  //   };
  //   fetchBooks();
  // }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase.from("books").select("*");
        if (error) throw error;
        setBooks(data ?? []);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  //sliding functionality
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  return (
    <div className="trending-books-container">
      <h2 className="trending-title">{t("trendingBooks.title")}</h2>
      <div className="carousel-container">
        <button className="arrow-button left" onClick={prevSlide}>
          {"<"}
        </button>

        <div className="carousel">
          {/* This looped display shows 4 books by wrapping the array */}
          {loading ? (
            <p>Loading...</p> // Added loading state for clarity
          ) : (
            books
              .concat(books)
              .slice(currentIndex, currentIndex + 4)
              .map((book, index) => (
                <div className="carousel-item" key={index}>
                  <Link to={`/book/${book.id}`}>
                    <img
                      src={book.cover_photo}
                      alt={book.title}
                      style={{
                        borderRadius: "5px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                  </Link>
                </div>
              ))
          )}
        </div>

        <button className="arrow-button right" onClick={nextSlide}>
          {">"}
        </button>
      </div>
    </div>
  );
}

export default TrendingBooks;
