import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/temporary-header-logo.jpg";
import cartIcon from "../assets/shopping-cart-line.png";
import LanguageToggle from "./LanguageToggle";
import { Link, useNavigate } from "react-router-dom";

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
  const { t } = useTranslation();
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
    console.log("Selected category:", category);
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer} onClick={goToHome}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 className="header-name">Beresta Literary Press</h1>
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
            <a href="#contact" style={styles.navLink}>
              {t("header.contactUs")}
            </a>
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
          <li style={styles.navItem}>
            <input
              type="text"
              placeholder={t("header.searchBar")}
              style={styles.searchInput}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    color: "white",
  },
  logoContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    height: "50px",
  },
  nav: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    padding: 0,
    margin: 0,
    gap: "20px",
  },
  navItem: {
    marginLeft: "20px",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  trigger: {
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
    fontFamily: "'inknut antiqua', sans-serif",
    background: "none",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  navLink: {
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#FFFFFF",
    listStyle: "none",
    padding: "5px 0",
    margin: 0,
    border: "1px solid #ccc",
  },
  dropdownItem: {
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
    fontFamily: "'inknut antiqua', sans-serif",
    padding: "5px 10px",
    cursor: "pointer",
  },
  cartLink: {
    display: "flex",
    alignItems: "center",
    color: "black",
    textDecoration: "none",
    fontSize: "12px",
  },
  cartIcon: {
    width: "20px",
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
