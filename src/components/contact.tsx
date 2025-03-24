import React from "react";
import { useTranslation } from "react-i18next";

function ContactUs() {
  const { t } = useTranslation();

  return (
    <form style={styles.form}>
      <h1 style={styles.contactHeader}>{t("contactUs.title")}</h1>
      <input
        type="text"
        placeholder={t("contactUs.fullName")}
        style={styles.fullName}
      />

      <div style={styles.row}>
        <input
          type="email"
          placeholder={t("contactUs.email")}
          style={styles.email}
        />
        <input
          type="tel"
          placeholder={t("contactUs.phone")}
          style={styles.phone}
        />
      </div>

      <textarea
        placeholder={t("contactUs.message")}
        style={styles.message}
      ></textarea>

      <button type="submit" style={styles.submitButton}>
        {t("contactUs.submit")}
      </button>
    </form>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    paddingBottom: "200px",
    paddingTop: "20px",
  },
  contactHeader: {
    textAlign: "center",
  },
  fullName: {
    width: "93.5%",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  row: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  email: {
    flex: "1.5",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  phone: {
    flex: "1",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  message: {
    width: "93.5%",
    height: "120px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "none",
  },
  submitButton: {
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#AC3737",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default ContactUs;
