import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-logo-copyright">
        <h3 className="footer-logo">Beresta Literary Press</h3>
        <p className="footer-copyright">Copyright ©2025</p>
      </div>
      <nav className="footer-links">
        <Link to="/">{t("footer.home")}</Link>
        <Link to="/about">{t("footer.aboutUs")}</Link>
        <a href="/#contact">{t("footer.contactUs")}</a>
        <Link to="/books">{t("footer.ourBooks")}</Link>
      </nav>
    </footer>
  );
}

export default Footer;

export {};
