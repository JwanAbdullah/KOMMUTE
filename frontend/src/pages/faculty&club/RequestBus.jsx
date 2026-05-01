import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function RequestBus({ darkMode, setDarkMode }) {

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
              
              <h1>Request Bus</h1>
              <p>
                Submit a transportation request for an event, exam, or club activity.
              </p>
            </div>

            <div className="card form-card">
              <form onSubmit={handleSubmit} className="form-grid">
                <div className="field">
                  <label>Request Type</label>
                  <select className="select" required>
                    <option value="">Select type</option>
                    <option>Event</option>
                    <option>Exam</option>
                    <option>Club Activity</option>
                  </select>
                </div>

                <div className="field">
                  <label>Date</label>
                  <input className="input" type="date" required />
                </div>

                <div className="field">
                  <label>Departure Time</label>
                  <input className="input" type="time" required />
                </div>

                <div className="field">
                  <label>Return Time</label>
                  <input className="input" type="time" required />
                </div>

                <div className="field full-span">
                  <label>Pickup Location</label>
                  <input className="input" type="text" placeholder="Enter pickup point" required />
                </div>

                <div className="field full-span">
                  <label>Destination</label>
                  <input className="input" type="text" placeholder="Enter destination" required />
                </div>

                <div className="field">
                  <label>Expected Passengers</label>
                  <input className="input" type="number" min="1" placeholder="e.g. 30" required />
                </div>

                <div className="field">
                  <label>Department / Club Name</label>
                  <input className="input" type="text" placeholder="Enter name" required />
                </div>

                <div className="field full-span">
                  <label>Notes</label>
                  <textarea
                    className="textarea"
                    placeholder="Add any special transportation details..."
                  />
                </div>

                <div className="full-span">
                  <button type="submit" className="primary-btn">
                    Submit Request
                  </button>
                </div>
              </form>

              {submitted && (
                <div className="success-box">
                  Your bus request has been submitted successfully.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}