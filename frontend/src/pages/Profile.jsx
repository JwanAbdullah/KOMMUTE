import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sessions } from "../services/mockData";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function formatRole(role) {
  if (!role) return "Guest";
  if (role === "user") return "Regular User";
  if (role === "faculty") return "Faculty & Club";
  if (role === "driver") return "Driver";
  if (role === "admin") return "Admin";
  return role;
}

export default function Profile() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const savedUser = useMemo(() => {
    const raw = localStorage.getItem("kommuteUser");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [profile, setProfile] = useState({
    name: savedUser?.name || "Guest User",
    phone: "",
    email: savedUser?.email || "",
    address: "KFUPM Campus",
    role: savedUser?.role || "guest",
  });

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GU";

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = () => {
    const existing = savedUser || {};
    const updatedUser = {
      ...existing,
      isLoggedIn: true,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    localStorage.setItem("kommuteUser", JSON.stringify(updatedUser));
    alert("Profile updated.");
  };

  const handleLogout = () => {
    localStorage.removeItem("kommuteUser");
    navigate("/login");
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <div className="container">
          <div className="page-header">
            <div className="back-btn-wrap">
              <Link to="/" className="secondary-btn">← Back Home</Link>
            </div>
            <h1>Profile & Security</h1>
            <p>
              Personal info, profile photo, password update, session history, and logout UI.
            </p>
          </div>

          <div className="profile-grid">
            <div className="card profile-side">
              <div className="avatar-big">{initials}</div>
              <h3 style={{ margin: "0 0 8px" }}>{profile.name}</h3>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                {formatRole(profile.role)}
              </p>

              <button
                className="secondary-btn"
                style={{ width: "100%", marginBottom: 12 }}
              >
                Upload Profile Photo
              </button>

              <button
                className="danger-btn"
                style={{ width: "100%" }}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>

            <div className="card profile-main">
              <h3 style={{ color: "var(--primary-dark)" }}>Personal info</h3>

              <div className="form-grid">
                <div className="field">
                  <label>Real name</label>
                  <input
                    className="input"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Phone number</label>
                  <input
                    className="input"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                  />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    className="input"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Role</label>
                  <input
                    className="input"
                    value={formatRole(profile.role)}
                    readOnly
                  />
                </div>

                <div className="field full-span">
                  <label>Address</label>
                  <input
                    className="input"
                    value={profile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <button className="primary-btn" onClick={handleUpdateProfile}>
                  Update Profile
                </button>
              </div>

              <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "24px 0" }} />

              <h3 style={{ color: "var(--primary-dark)" }}>Login & security</h3>
              <div className="form-grid">
                <div className="field">
                  <label>Current password</label>
                  <input className="input" type="password" />
                </div>
                <div className="field">
                  <label>New password</label>
                  <input className="input" type="password" />
                </div>
                <div className="field full-span">
                  <label>Confirm new password</label>
                  <input className="input" type="password" />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <button className="primary-btn">Update Password</button>
              </div>

              <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "24px 0" }} />

              <h3 style={{ color: "var(--primary-dark)" }}>Device history</h3>
              <div className="list">
                {sessions.map((session) => (
                  <div className="list-item" key={session.device}>
                    <strong>{session.device}</strong>
                    <div>{session.time}</div>
                    <div>{session.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}