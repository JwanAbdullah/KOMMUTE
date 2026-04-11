import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { stops } from "../services/mockData";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function SubmitReport() {
  const [darkMode, setDarkMode] = useState(false);
  
    const [isLoggedIn] = useState(false);
    const [userRole] = useState("guest");
    
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    reportType: "",
    route: "",
    station: "",
    description: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.email ||
      !form.reportType ||
      !form.route ||
      !form.description
    ) {
      return;
    }

    navigate("/report-confirmation");
  }

  return (
    <div className="app-shell">
      <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
      <div className="container">
        <div className="page-header">
          <Link to="/" className="secondary-btn">← Back Home</Link>
          <h1>Submit a Service Report</h1>
          <p>
            Report delays, safety issues, or other transportation problems. Frontend-only for now.
          </p>
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

              <div className="field">
                <label>Report type</label>
                <select
                  className="select"
                  name="reportType"
                  value={form.reportType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="Delay">Delay</option>
                  <option value="Safety Issue">Safety Issue</option>
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
                >
                  <option value="">Select route</option>
                  <option value="Route One">Route One</option>
                  <option value="Route Two">Route Two</option>
                  <option value="Route Three">Route Three</option>
                  <option value="Route Four">Route Four</option>
                  <option value="Route Five">Route Five</option>
                  <option value="Route Six">Route Six</option>
                </select>
              </div>

              <div className="field full-span">
                <label>Stop / Station</label>
                <select
                  className="select"
                  name="station"
                  value={form.station}
                  onChange={handleChange}
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
                />
              </div>

              <div className="field full-span">
                <label>Image upload</label>
                <input className="input" type="file" accept=".jpg,.jpeg,.png" />
              </div>
            </div>

            <button className="primary-btn" type="submit">Submit Report</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}