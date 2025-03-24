import React from "react";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();
  return (
    <div className="about-us-container">
      <h1 className="about-us-header">{t("aboutUs.title")}</h1>
      <p className="about-us-paragraph">{t("aboutUs.description")}</p>
    </div>
  );
}

export default About;
