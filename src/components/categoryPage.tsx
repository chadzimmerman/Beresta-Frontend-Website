import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AltHeader from "./altHeader";
import Footer from "./footer";
import { supabase } from "../lib/supabaseClient";

interface Book {
  id: number;
  title: string;
  authors: string;
  cover_photo: string;
}

function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) return;

    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, authors, cover_photo")
        .contains("tags", [category]);
      if (!error && data) setBooks(data);
    };

    fetchBooks();
  }, [category]);

  const goToBook = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="app-page-wrapper">
      <AltHeader />
      <div className="category-content-and-stretch">
        <div className="category-page-container">
          <h1 className="category-title">{category}</h1>
          <div className="category-grid">
            {books.map((book) => (
              <div key={book.id} className="category-card">
                <img
                  src={book.cover_photo}
                  alt={book.title}
                  className="category-cover-image"
                  onClick={() => goToBook(book.id)}
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

export default CategoryPage;
