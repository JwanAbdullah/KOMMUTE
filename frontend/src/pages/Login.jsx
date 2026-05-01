import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ darkMode }) {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = {
      isLoggedIn: true,
      role,
      email,
    };

    localStorage.setItem("kommuteUser", JSON.stringify(userData));

    navigate("/");
  };

  return (
    <div className={darkMode ? "login-wrap dark" : "login-wrap"}>
      <div className="card login-card">
        <div className="brand" style={{ marginBottom: 18 }}>
          <span>Kommute</span>
        </div>

        <h1 style={{ marginTop: 0, color: "var(--primary-dark)" }}>Login</h1>

        <form onSubmit={handleLogin}>
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
              placeholder="••••••••"
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
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="primary-btn" style={{ width: "100%" }}>
            Login
          </button>
        </form>

        <div className="info-box">
          Selected role: <strong>{role}</strong>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/" className="secondary-btn">Back Home</Link>
        </div>
      </div>
    </div>
  );
}