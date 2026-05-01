import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ darkMode, setDarkMode }) {
  const [user, setUser] = useState({ isLoggedIn: false, role: "guest" });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("kommuteUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kommuteUser");
    setUser({ isLoggedIn: false, role: "guest" });
    navigate("/");
  };

  const isLoggedIn = user.isLoggedIn;
  const userRole = user.role;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span>Kommute</span>
        </Link>

        <nav className="nav-links">
          <Link className="nav-link" to="/">Home</Link>

          {!isLoggedIn && (
            <>
            <Link className="nav-link" to="/#routes">Schedules</Link>
            <Link className="nav-link" to="/#map">Map</Link>
              <Link className="nav-link" to="/about">About</Link>
              <Link className="nav-link" to="/contact">Contact us</Link>
              <Link className="nav-link" to="/submit-report">Report a delay</Link>
            </>
          )}

          {isLoggedIn && userRole === "user" && (
            <>
              <Link className="nav-link" to="/#routes">Schedules</Link>
              <Link className="nav-link" to="/#map">Map</Link>
              <Link className="nav-link" to="/about">About</Link>
              <Link className="nav-link" to="/contact">Contact us</Link>
              <Link className="nav-link" to="/submit-report">Report a delay</Link>
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
              <Link className="nav-link" to="/admin/users-management">
                Users Management
              </Link>
              <Link className="nav-link" to="/admin/drivers-management">
                Drivers Management
              </Link>
            </>
          )}

          {isLoggedIn && userRole === "faculty" && (
            <>
            <Link className="nav-link" to="/#routes">Schedules</Link>
              <Link className="nav-link" to="/#map">Map</Link>
              <Link className="nav-link" to="/about">About</Link>
              <Link className="nav-link" to="/contact">Contact us</Link>
              <Link className="nav-link" to="/faculty&club/request-bus">
                Request Bus
              </Link>
              <Link className="nav-link" to="/faculty&club/my-requests">
                My Requests
              </Link>
            </>
          )}

          {isLoggedIn && userRole === "driver" && (
            <>
              <Link className="nav-link" to="/driver/report-delay">
                Report a Delay
              </Link>
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
            <>
              <Link
                className="profile-icon-link"
                to="/profile"
                aria-label="Go to profile"
                title="Profile"
              >
                <div className="profile-icon">👤</div>
              </Link>

              <button className="secondary-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}