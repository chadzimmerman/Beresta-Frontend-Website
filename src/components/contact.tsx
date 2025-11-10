import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./contact.css";

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  // State for feedback and submission status
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsSubmitting(true);

    // --- 🚨 START API Submission Logic 🚨 ---
    try {
      const response = await fetch("/api/contact", {
        // Target your new serverless function
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send all form data
      });

      if (response.ok) {
        // Success: Clear form and show success message
        setMessage(t("contactUs.successMessage")); // e.g., "Your message has been sent!"
        setFormData({ fullName: "", email: "", phoneNumber: "", message: "" });
      } else {
        // Error: Show error message from server
        const errorData = await response.json();
        setMessage(errorData.message || t("contactUs.genericError"));
      }
    } catch (error) {
      // Network failure
      console.error("Submission error:", error);
      setMessage(t("contactUs.networkError"));
    } finally {
      setIsSubmitting(false);
    }
    // --- 🚨 END API Submission Logic 🚨 ---
  };

  return (
    <div id="contact" className="contact-us-container">
      <h2 className="contact-us-header">{t("contactUs.title")}</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        {/* ... (input fields remain the same) ... */}

        <input
          type="text"
          name="fullName"
          placeholder={t("contactUs.fullName")}
          className="form-input full-width-input"
          value={formData.fullName}
          onChange={handleChange}
          required // Added required attribute
        />
        {/* ... (inline fields wrapper) ... */}
        <div className="inline-fields-wrapper">
          <input
            type="email"
            name="email"
            placeholder={t("contactUs.email")}
            className="form-input inline-field-item"
            value={formData.email}
            onChange={handleChange}
            required // Added required attribute
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder={t("contactUs.phone")}
            className="form-input inline-field-item"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        {/* ... (message field) ... */}
        <textarea
          name="message"
          placeholder={t("contactUs.message")}
          className="form-textarea full-width-input"
          value={formData.message}
          onChange={handleChange}
          required // Added required attribute
        />

        <button
          type="submit"
          className="form-submit-button"
          disabled={isSubmitting} // Disable during submission
        >
          {isSubmitting ? t("contactUs.submitting") : t("contactUs.submit")}
        </button>
      </form>

      {/* Display feedback message */}
      {message && <p className="submission-message">{message}</p>}
    </div>
  );
}

export default Contact;
