import React from "react";
import { useTranslation } from "react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: "5px 10px",
        fontSize: "12px",
        fontFamily: "'inknut antiqua', sans-serif", // Matches your header
        color: "black",
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
    >
      {i18n.language === "en" ? "Русский" : "English"}{" "}
      {/* Shows opposite language */}
    </button>
  );
}

export default LanguageToggle;
