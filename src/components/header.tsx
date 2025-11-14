import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/beresta-logo.png";
import cartIcon from "../assets/shopping-cart-line.png";
import LanguageToggle from "./LanguageToggle";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { CartContext } from "../App";

const categories = [
  "Fiction",
  "Non-Fiction",
  "Fairy Tales",
  "Translation",
  "Japanese",
  "Russian",
  "Children",
  "Poetry",
  "Coloring",
];

function Header() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { searchQuery, setSearchQuery } = useContext(CartContext);
  // State for mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
    setSearchQuery("");
  };

  // Toggles for Category Dropdown and Mobile Menu
  const toggleCategoryDropdown = () => setIsCategoryOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMenuOpen((prev) => !prev);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
    // Close the mobile menu after selecting a category
    if (isMenuOpen) setIsMenuOpen(false);
    setSearchQuery("");
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  interface BookSuggestion {
    id: number;
    title: string;
    authors: string;
  }

  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch suggestions when the user types in the search bar
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/books/search?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300); // debounce user typing
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // closes search after a user clicks away or hits escape
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="header-main">
      <div className="logo-container" onClick={goToHome}>
        <img src={logo} alt="Logo" className="logo-image" />
        <h1 className="header-name">Beresta Literary Press</h1>
      </div>

      {/* Hamburger Menu Button for Mobile */}
      <button className="menu-toggle" onClick={toggleMobileMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* Navigation - Conditionally show on mobile */}
      <nav className={`nav-main ${isMenuOpen ? "is-open" : ""}`}>
        <ul className="nav-list">
          <li className="nav-item category-item">
            <button className="nav-trigger" onClick={toggleCategoryDropdown}>
              {selectedCategory || t("header.categories")}
            </button>
            {isCategoryOpen && (
              <ul className="dropdown-menu">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link
              to="/about"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("header.aboutUs")}
            </Link>
          </li>
          <li className="nav-item">
            <a
              href="#contact"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("header.contactUs")}
            </a>
          </li>

          <li className="nav-item language-toggle-wrapper">
            <LanguageToggle />
          </li>

          <li className="nav-item search-item">
            <input
              type="text"
              placeholder={t("header.searchBar")}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* drop down for the search bar */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((book) => (
                  <li
                    key={book.id}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(book.title);
                      setShowSuggestions(false);
                      navigate(`/book/${book.id}`);
                    }}
                  >
                    <span className="suggestion-title">{book.title}</span>
                    <span className="suggestion-author"> — {book.authors}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link
              to="/cart"
              className="cart-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={cartIcon} alt="Cart" className="cart-icon" />
              <span>{t("header.cart")}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
