import React from "react";
import AltHeader from "./altHeader";
import Footer from "./footer";
import { useTranslation } from "react-i18next";
// Assuming you'll import a dedicated image or just use the URL
// import chadSvetlanaPhoto from "../assets/chad-and-svetlana-photo.jpg";

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      {" "}
      {/* Wrapper for minHeight: 100vh */}
      <AltHeader />
      <div className="about-container">
        {" "}
        {/* Replaces styles.container */}
        <img
          src="http://localhost:3000/assets/chad-and-svetlana-photo.jpg"
          alt="Chad and Svetlana Zimmerman"
          className="about-cover-image"
        />
        <div className="about-content-column">
          {" "}
          {/* Replaces styles.rightColumn */}
          <div className="about-title-section">
            <h1 className="about-main-title">{t("aboutUs.mainTitle")}</h1>

            {/* Our Journey Section */}
            <h3 className="about-section-title">
              {t("aboutUs.ourJourneyTitle")}
            </h3>
            <p className="about-section-text">{t("aboutUs.ourJourney")}</p>

            {/* Chad Section */}
            <h3 className="about-section-title">
              {t("aboutUs.aboutChadTitle")}
            </h3>
            <p className="about-section-text">{t("aboutUs.aboutChad")}</p>

            {/* Svetlana Section */}
            <h3 className="about-section-title">
              {t("aboutUs.aboutSvetlanaTitle")}
            </h3>
            <p className="about-section-text">{t("aboutUs.aboutSvetlana")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// 🚨 REMOVE the 'styles' object entirely, as it will be replaced by CSS in app.css 🚨

export default AboutPage;
