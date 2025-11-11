import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function MailingList() {
  const { t } = useTranslation() as { t: (key: string) => string };

  // 1. State to manage the user's email input
  const [email, setEmail] = useState("");

  // State for feedback (optional, but helpful)
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handler function for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form reload

    // Simple email validation
    if (!email || !email.includes("@")) {
      setMessage(t("newsletter.invalidEmail"));
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      // 3. Send POST request to your Vercel Serverless Function endpoint
      // Assuming your function is located at /api/subscribe
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        // 4. Handle success
        setMessage(t("newsletter.successMessage")); // "Check your inbox for the free ebook!"
        setEmail(""); // Clear the input field
      } else {
        // 5. Handle error response from the serverless function
        const errorData = await response.json();
        setMessage(errorData.message || t("newsletter.genericError"));
      }
    } catch (error) {
      // 6. Handle network/fetch errors
      console.error("Submission error:", error);
      setMessage(t("newsletter.networkError")); // "A network error occurred."
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mailing-list-container">
      <h2 className="mailing-list-h1">{t("newsletter.title")}</h2>
      <p className="mailing-list-text">{t("newsletter.description")}</p>

      {/* 7. Change div to form and assign onSubmit handler */}
      <form className="newsletter-form" onSubmit={handleSubmit}>
        {/* 8. Input is now controlled */}
        <input
          type="email" // Use type="email" for better mobile keyboard and validation
          className="mailing-list-input"
          placeholder={t("newsletter.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* 9. Button now uses the disabled state */}
        <button
          className="mailing-list-button"
          type="submit" // Ensure button submits the form
          disabled={isSubmitting} // Prevent double-submits
        >
          {isSubmitting ? t("newsletter.submitting") : t("newsletter.submit")}
        </button>
      </form>

      {/* 10. Display feedback message */}
      {message && <p className="submission-message">{message}</p>}
    </div>
  );
}

export default MailingList;
// Remove 'export {};' as it's not needed here
