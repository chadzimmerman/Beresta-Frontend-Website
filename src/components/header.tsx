import React, { useState } from "react";
import logo from "../assets/temporary-header-logo.jpg";
import cartIcon from "../assets/shopping-cart-line.png";

// Placeholder categories (You can fetch these dynamically from your database later)
const categories = [
  "Fiction",
  "Non-Fiction",
  "Fairytales",
  "Translation",
  "Japanese",
  "Russian",
  "Children",
  "Poetry",
];

function Header() {
  const [isEnglish, setIsEnglish] = useState(true); // Language toggle state

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <header style={styles.header}>
      {/* Logo on the left */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {/* Categories Dropdown */}
          <li style={styles.navItem}>
            <select style={styles.dropdown}>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </li>

          {/* About Link */}
          <li style={styles.navItem}>
            <a href="#about" style={styles.navLink}>
              About
            </a>
          </li>

          {/* Contact Link */}
          <li style={styles.navItem}>
            <a href="#contact" style={styles.navLink}>
              Contact
            </a>
          </li>

          {/* Language Toggle */}
          <li style={styles.navItem}>
            <button onClick={toggleLanguage} style={styles.languageToggle}>
              {isEnglish ? "EN" : "RU"}
            </button>
          </li>

          {/* Shopping Cart */}
          <li style={styles.navItem}>
            <a href="#cart" style={styles.cartLink}>
              <img src={cartIcon} alt="Cart" style={styles.cartIcon} />
              <span>Cart</span>
            </a>
          </li>

          {/* Search Bar */}
          <li style={styles.navItem}>
            <input
              type="text"
              placeholder="Search books..."
              style={styles.searchInput}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: "50px", // Adjust logo size as needed
  },
  nav: {
    flex: 3,
    display: "flex",
    justifyContent: "space-between",
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginLeft: "20px",
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  dropdown: {
    padding: "5px 10px",
    fontSize: "14px",
  },
  languageToggle: {
    backgroundColor: "#444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  cartLink: {
    display: "flex",
    alignItems: "center",
    color: "white",
    textDecoration: "none",
  },
  cartIcon: {
    width: "20px", // Adjust cart icon size
    marginRight: "5px",
  },
  searchInput: {
    padding: "5px 10px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
  },
};

export default Header;
