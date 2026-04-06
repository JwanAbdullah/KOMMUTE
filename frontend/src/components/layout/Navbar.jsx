import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-badge">K</div>
          <span>Kommute</span>
        </Link>

        <nav className="nav-links">
          <Link className="nav-link" to="/">Home</Link>
          <a className="nav-link" href="#map">Map</a>
          <a className="nav-link" href="#routes">Schedules</a>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          <Link className="nav-link" to="/submit-report">Submit Report</Link>
        </nav>

        <div className="nav-actions">
          <Link className="secondary-btn" to="/login">Login</Link>
        </div>
      </div>
    </header>
  );
}