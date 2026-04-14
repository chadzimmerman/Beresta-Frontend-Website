import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AltHeader from "./altHeader";
import Footer from "./footer";
import { supabase } from "../lib/supabaseClient";

interface Book {
  id: number;
  slug: string;
  title: string;
  authors: string;
  cover_photo: string;
  status: "available" | "upcoming";
}

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("books")
        .select("id, slug, title, authors, cover_photo, status")
        .or(
          `title.ilike.%${query}%,authors.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
        );

      setBooks(data ?? []);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="app-page-wrapper">
      <AltHeader />
      <div className="search-results-content">
        <h1 className="search-results-title">
          {loading
            ? "Searching..."
            : `${books.length} result${books.length !== 1 ? "s" : ""} for "${query}"`}
        </h1>

        {!loading && books.length === 0 && (
          <p className="search-no-results">
            No books found matching your search. Try a different keyword.
          </p>
        )}

        <div className="search-results-grid">
          {books.map((book) => (
            <div
              key={book.id}
              className="search-result-card"
              onClick={() => navigate(`/book/${book.slug}`)}
            >
              <div className="search-result-cover-wrapper">
                <img
                  src={book.cover_photo}
                  alt={book.title}
                  className="search-result-cover"
                />
                {book.status === "upcoming" && (
                  <span className="search-result-badge">Coming Soon</span>
                )}
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

export default SearchResultsPage;
