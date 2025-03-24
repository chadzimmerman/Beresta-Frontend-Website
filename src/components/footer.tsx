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
        <p>{t("footer.home")}</p>
        <Link to="/about">{t("footer.aboutUs")}</Link>
        <p>{t("footer.contactUs")}</p>
        <p>{t("footer.ourBooks")}</p>
      </nav>
    </footer>
  );
}

export default Footer;

export {};
