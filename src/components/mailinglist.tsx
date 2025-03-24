import React from "react";
import { useTranslation } from "react-i18next";

function MailingList() {
  const { t } = useTranslation();
  return (
    <div className="mailing-list-container">
      <h2 className="mailing-list-h1">{t("newsletter.title")}</h2>
      <p className="mailing-list-text">{t("newsletter.description")}</p>
      <div className="newsletter-form">
        <input type="text" className="mailing-list-input" />
        <button className="mailing-list-button">
          {t("newsletter.submit")}
        </button>
      </div>
    </div>
  );
}

export default MailingList;

export {};
