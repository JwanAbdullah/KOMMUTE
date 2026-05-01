import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { createRequest } from "../../services/requestService";

export default function RequestBus({ darkMode, setDarkMode }) {
  const [form, setForm] = useState({
    type: "",
    date: "",
    departureTime: "",
    returnTime: "",
    pickupLocation: "",
    destination: "",
    passengers: "",
    requester: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createRequest({ ...form, passengers: Number(form.passengers) });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
                  <select
                    className="select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Event">Event</option>
                    <option value="Exam">Exam</option>
                    <option value="Club Activity">Club Activity</option>
                  </select>
                </div>

                <div className="field">
                  <label>Date</label>
                  <input
                    className="input"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Departure Time</label>
                  <input
                    className="input"
                    type="time"
                    name="departureTime"
                    value={form.departureTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Return Time</label>
                  <input
                    className="input"
                    type="time"
                    name="returnTime"
                    value={form.returnTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field full-span">
                  <label>Pickup Location</label>
                  <input
                    className="input"
                    type="text"
                    name="pickupLocation"
                    value={form.pickupLocation}
                    onChange={handleChange}
                    placeholder="Enter pickup point"
                    required
                  />
                </div>

                <div className="field full-span">
                  <label>Destination</label>
                  <input
                    className="input"
                    type="text"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="Enter destination"
                    required
                  />
                </div>

                <div className="field">
                  <label>Expected Passengers</label>
                  <input
                    className="input"
                    type="number"
                    name="passengers"
                    value={form.passengers}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 30"
                    required
                  />
                </div>

                <div className="field">
                  <label>Department / Club Name</label>
                  <input
                    className="input"
                    type="text"
                    name="requester"
                    value={form.requester}
                    onChange={handleChange}
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className="field full-span">
                  <label>Notes</label>
                  <textarea
                    className="textarea"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any special transportation details..."
                  />
                </div>

                {error && (
                  <div className="full-span error-box">
                    {error}
                  </div>
                )}

                <div className="full-span">
                  <button type="submit" className="primary-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Request"}
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