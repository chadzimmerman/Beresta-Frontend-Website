import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/beresta-logo.png";
import cartIcon from "../assets/shopping-cart-line.png";
import LanguageToggle from "./LanguageToggle";
import { Link, useNavigate } from "react-router-dom";

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

function AltHeader() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer} onClick={goToHome}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.headerName}>Beresta Literary Press</h1>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <button style={styles.trigger} onClick={toggleDropdown}>
              {selectedCategory || t("header.categories")}
            </button>
            {isOpen && (
              <ul style={styles.dropdown}>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    style={styles.dropdownItem}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li style={styles.navItem}>
            <Link to="/about" style={styles.navLink}>
              {t("header.aboutUs")}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/#contact" style={styles.navLink}>
              {t("header.contactUs")}
            </Link>
          </li>
          <li style={styles.navItem}>
            <LanguageToggle />
          </li>
          <li style={styles.navItem}>
            <a href="/cart" style={styles.cartLink}>
              <img src={cartIcon} alt="Cart" style={styles.cartIcon} />
              <span>{t("header.cart")}</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    flexDirection: "column", // Stack logo/name and nav vertically
    alignItems: "center", // Center everything horizontally
    padding: "20px",
    backgroundColor: "#fff", // White background for clarity
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px", // Space between name and nav
  },
  logo: {
    height: "100px",
  },
  headerName: {
    fontSize: "24px", // Slightly larger than original (was implicit ~16px)
    fontFamily: "'inknut antiqua', sans-serif",
    color: "black",
    margin: 0, // Remove default h1 margin
  },
  nav: {
    display: "flex",
    justifyContent: "center", // Center nav items
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    padding: 0,
    margin: 0,
    gap: "20px", // Space between nav items
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    position: "relative", // For dropdown positioning
  },
  trigger: {
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
    fontFamily: "inherit",
    background: "none",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  navLink: {
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
    fontFamily: "inherit",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "50%", // Center dropdown under button
    transform: "translateX(-50%)", // Adjust for true centering
    backgroundColor: "#FFFFFF",
    listStyle: "none",
    padding: "5px 0",
    margin: 0,
    border: "1px solid #ccc",
    zIndex: 1, // Ensure dropdown is above other content
  },
  dropdownItem: {
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
    fontFamily: "'inknut antiqua', sans-serif",
    padding: "5px 10px",
    cursor: "pointer",
    whiteSpace: "nowrap", // Prevent wrapping
  },
  cartLink: {
    display: "flex",
    alignItems: "center",
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
    fontFamily: "inherit",
  },
  cartIcon: {
    width: "20px",
    marginRight: "5px",
  },
};

export default AltHeader;
