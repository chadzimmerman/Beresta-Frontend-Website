import React from "react";
import AltHeader from "./altHeader";
import Footer from "./footer";
import { useTranslation } from "react-i18next";

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div style={styles.page}>
      <AltHeader />
      <div style={styles.container}>
        <img
          src="http://localhost:3000/assets/chad-and-svetlana-photo.jpg"
          alt="Chad and Svetlana Zimmerman"
          style={styles.cover}
        />
        <div style={styles.rightColumn}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>{t("aboutUs.mainTitle")}</h1>
            <h3 style={styles.sectionTitle}>{t("aboutUs.ourJourneyTitle")}</h3>
            <p style={styles.text}>{t("aboutUs.ourJourney")}</p>
            {/* Chad Section */}
            <h3 style={styles.sectionTitle}>{t("aboutUs.aboutChadTitle")}</h3>
            <p style={styles.text}>{t("aboutUs.aboutChad")}</p>
            {/* Svetlana Section */}
            <h3 style={styles.sectionTitle}>
              {t("aboutUs.aboutSvetlanaTitle")}
            </h3>
            <p style={styles.text}>{t("aboutUs.aboutSvetlana")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    padding: "0 20px 20px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
    flex: 1,
  },
  cover: {
    maxWidth: "300px",
    height: "auto",
    marginTop: 0,
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    fontFamily: "'inknut antiqua', sans-serif",
    marginTop: 0,
  },
  titleSection: {
    margin: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: "28px",
    margin: "0 0 10px 0",
    lineHeight: 1,
  },
  text: {
    fontSize: "16px",
    margin: "5px 0",
    color: "#000000", // Black for body text
  },
  sectionTitle: {
    fontSize: "20px",
    margin: "20px 0 10px 0", // More space above sections
  },
};

export default AboutPage;
