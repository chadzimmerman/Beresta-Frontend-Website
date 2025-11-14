import React from "react";
import { useTranslation } from "react-i18next";
import { inherits } from "util";

function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button onClick={toggleLanguage} className="language-toggle">
      {i18n.language === "en" ? "Russian" : "Англиский"}{" "}
      {/* Shows opposite language */}
    </button>
  );
}

export default LanguageToggle;
