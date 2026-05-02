import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function Register({ darkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("user");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      const userData = {
        isLoggedIn: true,
        token: data.token,
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      localStorage.setItem("kommuteUser", JSON.stringify(userData));

      navigate("/");
    } catch (err) {
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "login-wrap dark" : "login-wrap"}>
      <div className="card login-card">
        <div className="brand" style={{ marginBottom: 18 }}>
          <span>Kommute</span>
        </div>

        <h1 style={{ marginTop: 0, color: "var(--primary-dark)" }}>
          Register
        </h1>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label>Name</label>
            <input
              className="input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Role</label>
            <select
                className="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="user">Regular User</option>
                <option value="faculty">Faculty & Club</option>
            </select>
            </div>

          {error && <div className="warning-box">{error}</div>}

          <button
            type="submit"
            className="primary-btn"
            style={{ width: "100%", marginTop: 14 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="info-box">
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 800 }}>
            Login
          </Link>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/" className="secondary-btn">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}