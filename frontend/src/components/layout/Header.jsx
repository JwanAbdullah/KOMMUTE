import React from "react";
import { Link } from "react-router-dom";

export default function Header({
  darkMode,
  setDarkMode,
  isLoggedIn = false,
  userRole = "guest", // guest | user | admin | faculty | driver
}) {
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

          {!isLoggedIn && (
            <>
              {/* Guest / normal public navigation only */}
            </>
          )}

          {isLoggedIn && userRole === "user" && (
            <>
              {/* Normal logged-in user pages can go here later if needed */}
            </>
          )}

          {isLoggedIn && userRole === "admin" && (
            <>
              <Link className="nav-link" to="/admin/reports-dashboard">
                Reports Dashboard
              </Link>
              <Link className="nav-link" to="/admin/requests-dashboard">
                Requests Dashboard
              </Link>
              <Link className="nav-link" to="/admin/drivers-management">
                Drivers Management
              </Link>
            </>
          )}

          {isLoggedIn && userRole === "faculty" && (
            <>
              <Link className="nav-link" to="/faculty/request-bus">
                Request Bus
              </Link>
              {/* Add event/exam request details page here later */}
            </>
          )}

          {isLoggedIn && userRole === "driver" && (
            <>
              <Link className="nav-link" to="/driver/report-delay">
                Report Delay
              </Link>
              {/* Add driver assigned route / trip page here later */}
            </>
          )}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          {!isLoggedIn ? (
            <Link className="secondary-btn" to="/login">Login</Link>
          ) : (
            <Link
              className="profile-icon-link"
              to="/profile"
              aria-label="Go to profile"
              title="Profile"
            >
              <div className="profile-icon">👤</div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}