import React, { useState } from "react";
import { Link } from "react-router-dom";
import { stops } from "../services/mockData";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

export default function SubmitReport({ darkMode, setDarkMode }) {
  const storedUser = JSON.parse(localStorage.getItem("kommuteUser"));
  const isLoggedIn = storedUser?.isLoggedIn || false;
  const userRole = storedUser?.role || "guest";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: storedUser?.name || "",
    email: storedUser?.email || "",
    reportType: "",
    route: "",
    station: "",
    description: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (
      !form.fullName ||
      !form.email ||
      !form.reportType ||
      !form.route ||
      !form.station ||
      !form.description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!storedUser?.token) {
      setError("You must be logged in to submit a report.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify({
          title: `${form.reportType} report`,
          category: form.reportType,
          route: form.route,
          stop: form.station,
          description: form.description,
          reportType: form.reportType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to submit report.");
        return;
      }

      setSubmitted(true);

      setForm({
        fullName: storedUser?.name || "",
        email: storedUser?.email || "",
        reportType: "",
        route: "",
        station: "",
        description: "",
      });
    } catch (err) {
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
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
          <h1>Submit a Service Report</h1>
          <p>Report delays, safety issues, or other transportation problems.</p>
           {!isLoggedIn && (
              <div className="success-box">
                You need to{" "}
                <Link to="/login" style={{ fontWeight: 800 }}>
                  login
                </Link>{" "}
                before submitting a report.
              </div>
            )}
        </div>

        <div className="card form-card">


          <form onSubmit={handleSubmit}>
            
            <div className="form-grid">
              
              <div className="field">
                <label>Full name</label>
                <input
                  className="input"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
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
                  required
                />
              </div>

              <div className="field">
                <label>Report type</label>
                <select
                  className="select"
                  name="reportType"
                  value={form.reportType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Delay">Delay</option>
                  <option value="Safety Issue">Safety Issue</option>
                  <option value="Capacity">Capacity</option>
                  <option value="Service Issue">Service Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="field">
                <label>Route</label>
                <select
                  className="select"
                  name="route"
                  value={form.route}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select route</option>
                  <option value="Route 1">Route 1</option>
                  <option value="Route 2">Route 2</option>
                  <option value="Route 3">Route 3</option>
                  <option value="Route 4">Route 4</option>
                  <option value="Route 5">Route 5</option>
                  <option value="Route 6">Route 6</option>
                  <option value="Route 7">Route 7</option>
                  <option value="Route 8">Route 8</option>
                </select>
              </div>

              <div className="field full-span">
                <label>Stop / Station</label>
                <select
                  className="select"
                  name="station"
                  value={form.station}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select stop</option>
                  {stops.map((stop) => (
                    <option key={stop} value={stop}>
                      {stop}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field full-span">
                <label>Description</label>
                <textarea
                  className="textarea"
                  name="description"
                  maxLength={500}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the issue..."
                  required
                />
              </div>

              <div className="field full-span">
                <label>Image upload</label>
                <input className="input" type="file" accept=".jpg,.jpeg,.png" />
              </div>
            </div>

            {error && <div className="warning-box">{error}</div>}

      

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </button>
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