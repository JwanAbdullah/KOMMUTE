import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="secondary-btn">← Back Home</Link>
          <h1>About Kommute</h1>
          <p>
            Kommute is a campus transportation platform designed to centralize public bus
            information, make routes easier to understand, and create a smoother daily travel
            experience for students, faculty, clubs, and staff.
          </p>
        </div>

        <div className="grid-3">
          <div className="card form-card">
            <h3>Our story</h3>
            <p>
              Campus movement should feel predictable and easy. Kommute brings schedules,
              route guidance, and service communication into one modern interface.
            </p>
          </div>

          <div className="card form-card">
            <h3>Our mission</h3>
            <p>
              Improve transparency, reduce confusion, and help the university community plan
              transportation more efficiently.
            </p>
          </div>

          <div className="card form-card">
            <h3>Our values</h3>
            <p>Trust, efficiency, service, and community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}