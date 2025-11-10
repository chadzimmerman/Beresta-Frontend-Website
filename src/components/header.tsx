import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/beresta-logo.png";
import cartIcon from "../assets/shopping-cart-line.png";
import LanguageToggle from "./LanguageToggle";
import { Link, useNavigate } from "react-router-dom";
// 🚨 New: Import the dedicated CSS file
import "./header.css";

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
  const { t } = useTranslation();
  // State for mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  // Toggles for Category Dropdown and Mobile Menu
  const toggleCategoryDropdown = () => setIsCategoryOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMenuOpen((prev) => !prev);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
    // Close the mobile menu after selecting a category
    if (isMenuOpen) setIsMenuOpen(false);
    navigate(`/category/${encodeURIComponent(category)}`);
  };

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
            />
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

// 🚨 Removed inline 'styles' object 🚨

export default Header;
