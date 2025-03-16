import React, { useState } from "react";
import MarvelousMiracles1 from "../assets/marvelous-miracles-1.jpg";
import LearnKanjiFromYokai from "../assets/learn-kanji-with-yokai.jpg";
import LearnKanaFromYokai from "../assets/learn-kana-with-yokai.jpg";
import JohnTemporaryCover from "../assets/john-malinovski-temp-cover.jpg";
import TikhonTemporaryCover from "../assets/tikhon-temp-cover.jpg";

const books = [
  { title: "Marvelous Miracles and Somber Stories", image: MarvelousMiracles1 },
  { title: "Learn Kanji From Yokai", image: LearnKanjiFromYokai },
  { title: "Learn Kana From Yokai", image: LearnKanaFromYokai },
  { title: "The Complete Works of John Malinovsky", image: JohnTemporaryCover },
  {
    title: "The Moral Theology of St. Tikhon of Moscow",
    image: TikhonTemporaryCover,
  },
];

function TrendingBooks() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  return (
    <div className="trending-books-container">
      <h2 className="trending-title">Trending Titles</h2>
      <div className="carousel-container">
        <button className="arrow-button left" onClick={prevSlide}>
          {"<"}
        </button>

        <div className="carousel">
          {/* This looped display shows 4 books by wrapping the array */}
          {books
            .concat(books) // Duplicate the books array to enable wrapping
            .slice(currentIndex, currentIndex + 4) // Always show 4 books
            .map((book, index) => (
              <div className="carousel-item" key={index}>
                <img src={book.image} alt={book.title} />
              </div>
            ))}
        </div>

        <button className="arrow-button right" onClick={nextSlide}>
          {">"}
        </button>
      </div>
    </div>
  );
}

export default TrendingBooks;
