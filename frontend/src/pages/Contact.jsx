import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header"; 
import Footer from "../components/layout/Footer";

export default function Contact({ darkMode, setDarkMode }) {
  
    const [isLoggedIn] = useState(false);
    const [userRole] = useState("guest");
  
  const [form, setForm] = useState({
    topic: "",
    name: "",
    email: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.topic || !form.name || !form.email) return;
    setSubmitted(true);
  }

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
      <div className="container">
        <div className="page-header">
          
          <h1>Contact Us</h1>
          <p>
            Send a general enquiry, schedule question, lost and found message, accessibility request, or suggestion.
          </p>
        </div>

        <div className="card form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Topic</label>
                <select
                  className="select"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                >
                  <option value="">Select topic</option>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Schedule Information">Schedule Information</option>
                  <option value="Lost & Found">Lost & Found</option>
                  <option value="Accessibility Request">Accessibility Request</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="field">
                <label>Name</label>
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="field full-span">
                <label>Description</label>
                <textarea
                  className="textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                />
              </div>
            </div>

            <button className="primary-btn" type="submit">Send Message</button>

            {submitted && (
              <div className="success-box">
                Thank you for reaching out. Your enquiry has been submitted successfully.
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}