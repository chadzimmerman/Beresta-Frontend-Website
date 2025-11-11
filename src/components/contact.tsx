import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./contact.css";

function Contact() {
  const { t } = useTranslation();

  return (
    <div id="contact" className="contact-us-container">
      <h2 className="contact-us-header">{t("contactUs.title")}</h2>
      <form
        action="https://formspree.io/f/mgvrelql"
        method="POST"
        className="contact-form"
      >
        <input
          type="text"
          name="fullName"
          placeholder={t("contactUs.fullName")}
          className="form-input full-width-input"
          required
        />
        <div className="inline-fields-wrapper">
          <input
            type="email"
            name="email"
            placeholder={t("contactUs.email")}
            className="form-input inline-field-item"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder={t("contactUs.phone")}
            className="form-input inline-field-item"
          />
        </div>
        <textarea
          name="message"
          placeholder={t("contactUs.message")}
          className="form-textarea full-width-input"
          required
        />

        <button type="submit" className="form-submit-button">
          {t("contactUs.submit")}
        </button>
      </form>
    </div>
  );
}

export default Contact;
