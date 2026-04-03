import React from "react";
import { useTranslation } from "react-i18next";
function LanguageToggle() {
  const { i18n } = useTranslation();

  const isEn = i18n.language.startsWith("en");

  const toggleLanguage = () => {
    i18n.changeLanguage(isEn ? "ru" : "en");
  };

  return (
    <button onClick={toggleLanguage} className="language-toggle">
      {isEn ? "Russian" : "Английский"}
    </button>
  );
}

export default LanguageToggle;
