import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function ContactUs() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); // <-- new state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Thank you! Your message has been sent.");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSuccessMessage("");
        alert("Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    }
  };

  return (
    <form id="contact" style={styles.form} onSubmit={handleSubmit}>
      <h1 style={styles.contactHeader}>{t("contactUs.title")}</h1>
      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        type="text"
        placeholder={t("contactUs.fullName")}
        style={styles.fullName}
      />

      <div style={styles.row}>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder={t("contactUs.email")}
          style={styles.email}
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="tel"
          placeholder={t("contactUs.phone")}
          style={styles.phone}
        />
      </div>

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder={t("contactUs.message")}
        style={styles.message}
      />

      <button type="submit" style={styles.submitButton}>
        {t("contactUs.submit")}
      </button>

      {successMessage && (
        <p style={{ color: "green", textAlign: "center", marginTop: "10px" }}>
          {successMessage}
        </p>
      )}
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
