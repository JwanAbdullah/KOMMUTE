import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

function formatRole(role) {
  if (role === "user") return "Regular User";
  if (role === "faculty") return "Faculty & Club";
  if (role === "driver") return "Driver";
  if (role === "admin") return "Admin";
  return "Guest";
}

function isValidEmail(email) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export default function Profile({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("kommuteUser");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  useEffect(() => {
    async function fetchProfile() {
      if (!storedUser?.token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setProfileError(data.message || data.error || "Failed to fetch profile.");
          return;
        }

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          role: data.role || "",
        });
      } catch (err) {
        setProfileError("Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [storedUser, navigate]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    setProfileError("");
    setProfileMessage("");

    if (!isValidEmail(profile.email)) {
      setProfileError("Please enter a valid email address, like name@example.com.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.message || data.error || "Failed to update profile.");
        return;
      }

      const updatedLocalUser = {
        ...storedUser,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("kommuteUser", JSON.stringify(updatedLocalUser));
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError("Could not connect to backend.");
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");
    setPasswordMessage("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || data.error || "Failed to update password.");
        return;
      }

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage("Password updated successfully.");
    } catch (err) {
      setPasswordError("Could not connect to backend.");
    }
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
              <Link to="/" className="secondary-btn">
                ← Back Home
              </Link>
            </div>

            <h1>Profile & Security</h1>
            <p>Manage your personal information and password.</p>
          </div>

          {loading && <div className="info-box">Loading profile...</div>}

          {!loading && (
            <div className="profile-grid">
              <div className="card profile-side">
                <div className="avatar-big">{initials}</div>

                <h3 style={{ margin: "0 0 8px" }}>{profile.name}</h3>

                <p style={{ color: "var(--muted)", marginTop: 0 }}>
                  {formatRole(profile.role)}
                </p>

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

                {profileError && (
                  <div className="warning-box" style={{ marginBottom: 16 }}>
                    {profileError}
                  </div>
                )}

                

                <form
                  className="form-grid"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfile();
                  }}
                >
                  <div className="field">
                    <label>Real name</label>
                    <input
                      className="input"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
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
                      type="text"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="name@example.com"
                      required
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
                    {profileMessage && (
                  <div className="info-box" style={{ marginBottom: 16 }}>
                    {profileMessage}
                  </div>
                )}
                  <div className="full-span" style={{ marginTop: 18 }}>
                    <button type="submit" className="primary-btn">
                      Update Profile
                    </button>
                  </div>
                </form>

                <hr
                  style={{
                    border: 0,
                    borderTop: "1px solid var(--border)",
                    margin: "24px 0",
                  }}
                />

                <h3 style={{ color: "var(--primary-dark)" }}>
                  Login & security
                </h3>

                {passwordError && (
                  <div className="warning-box" style={{ marginBottom: 16 }}>
                    {passwordError}
                  </div>
                )}

                {passwordMessage && (
                  <div className="info-box" style={{ marginBottom: 16 }}>
                    {passwordMessage}
                  </div>
                )}

                <form
                  className="form-grid"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdatePassword();
                  }}
                >
                  <div className="field">
                    <label>Current password</label>
                    <input
                      className="input"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="field">
                    <label>New password</label>
                    <input
                      className="input"
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="field full-span">
                    <label>Confirm new password</label>
                    <input
                      className="input"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="full-span" style={{ marginTop: 18 }}>
                    <button type="submit" className="primary-btn">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}