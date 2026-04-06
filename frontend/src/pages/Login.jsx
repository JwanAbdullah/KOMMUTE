import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("regular");

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="brand" style={{ marginBottom: 18 }}>
          <div className="brand-badge">K</div>
          <span>Kommute</span>
        </div>

        <h1 style={{ marginTop: 0, color: "var(--primary-dark)" }}>Login</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          Mock frontend login for role-based access.
        </p>

        <div className="field">
          <label>Email</label>
          <input className="input" type="email" placeholder="you@example.com" />
        </div>

        <div className="field">
          <label>Password</label>
          <input className="input" type="password" placeholder="••••••••" />
        </div>

        <div className="field">
          <label>Role preview</label>
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="regular">Regular User</option>
            <option value="faculty">Faculty & Club</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="primary-btn" style={{ width: "100%" }}>
          Login
        </button>

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