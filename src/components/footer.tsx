import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
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
        <Link to="/">{t("footer.home")}</Link>
        <Link to="/about">{t("footer.aboutUs")}</Link>
        <a href="/#contact">{t("footer.contactUs")}</a>
      </nav>
    </footer>
  );
}

export default Footer;

export {};
