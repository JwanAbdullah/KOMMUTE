import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function FAQ({ darkMode, setDarkMode }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I find the best bus route?",
      a: "Use the live map on the home page. Select your current location and destination, and Kommute will suggest the best route for you.",
    },
    {
      q: "Are bus timings real-time?",
      a: "Some routes provide estimated real-time updates. Others follow fixed schedules depending on service availability.",
    },
    {
      q: "What should I do if a bus is delayed?",
      a: "You can report delays using the 'Report a delay' page. Drivers and admins can also update delays in the system.",
    },
    {
      q: "Who can request special transportation?",
      a: "Faculty members and clubs can submit transportation requests through the system for events or activities.",
    },
    {
      q: "Why is there no live GPS for some routes?",
      a: "Some routes operate on fixed schedules without real-time tracking, so only estimated timing is shown.",
    },
    {
      q: "How do I contact support?",
      a: "You can use the Contact page or email support@kommute.com for assistance.",
    },
  ];

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        <section className="section">
          <div className="container">

            <div className="page-header">
<div className="back-btn-wrap">
                    <Link to="/" className="secondary-btn">← Back Home</Link>
                </div>              <h1>Frequently Asked Questions</h1>
              <p>
                Find answers to common questions about using Kommute and campus transportation.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((item, index) => (
                <div
                  key={index}
                  className={openIndex === index ? "faq-item open" : "faq-item"}
                >
                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  >
                    <span>{item.q}</span>
                    <span>{openIndex === index ? "−" : "+"}</span>
                  </button>

                  {openIndex === index && (
                    <div className="faq-answer">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}