import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";

function MailingList() {
  const { t } = useTranslation() as { t: (key: string) => string };

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_signups")
        .insert({ email });

      if (error && error.code === "23505") {
        setMessage(t("newsletter.alreadySubscribed"));
      } else if (error) {
        setMessage(t("newsletter.networkError"));
      } else {
        setMessage(t("newsletter.successMessage"));
        setEmail("");
      }
    } catch {
      setMessage(t("newsletter.networkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mailing-list-container">
      <h2 className="mailing-list-h1">{t("newsletter.title")}</h2>
      <p className="mailing-list-text">{t("newsletter.description")}</p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="mailing-list-input"
          placeholder={t("newsletter.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="mailing-list-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "..." : t("newsletter.submit")}
        </button>
      </form>

      {message && <p className="submission-message">{message}</p>}
    </div>
  );
}

export default MailingList;
