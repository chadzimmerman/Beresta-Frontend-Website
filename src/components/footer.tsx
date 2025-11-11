import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // scroll is instant, not smooth
    });
  };
  return (
    <footer className="footer">
      <div className="footer-logo-copyright">
        <h3 className="footer-logo" onClick={goToHome}>
          Beresta Literary Press
        </h3>
        <p className="footer-copyright">Copyright ©2025</p>
      </div>
      <nav className="footer-links">
        <Link to="/" onClick={scrollToTop}>
          {t("footer.home")}
        </Link>
        <Link to="/about" onClick={scrollToTop}>
          {t("footer.aboutUs")}
        </Link>
        <a href="/#contact">{t("footer.contactUs")}</a>
      </nav>
    </footer>
  );
}

export default Footer;

export {};
