import React from "react";
import AltHeader from "./altHeader";
import Footer from "./footer";
import { useTranslation } from "react-i18next";

function AboutPage() {
  const { t } = useTranslation() as { t: (key: string) => string };
  return (
    <div className="about-page">
      {" "}
      {/* Wrapper for minHeight: 100vh */}
      <AltHeader />
      <div className="about-container">
        {" "}
        <img
          src="assets/chad-and-svetlana-photo.jpg"
          alt="Chad and Svetlana Zimmerman"
          className="about-cover-image"
        />
        <div className="about-content-column">
          {" "}
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

export default AboutPage;
