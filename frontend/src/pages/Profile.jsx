import React from "react";
import { Link } from "react-router-dom";
import { sessions } from "../services/mockData";

export default function Profile() {
  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="secondary-btn">← Back Home</Link>
          <h1>Profile & Security</h1>
          <p>
            Personal info, profile photo, password update, session history, and logout UI.
          </p>
        </div>

        <div className="profile-grid">
          <div className="card profile-side">
            <div className="avatar-big">A</div>
            <h3 style={{ margin: "0 0 8px" }}>Ahmad User</h3>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>Regular user account</p>
            <button className="secondary-btn" style={{ width: "100%", marginBottom: 12 }}>
              Upload Profile Photo
            </button>
            <button className="danger-btn" style={{ width: "100%" }}>
              Log Out
            </button>
          </div>

          <div className="card profile-main">
            <h3 style={{ color: "var(--primary-dark)" }}>Personal info</h3>
            <div className="form-grid">
              <div className="field">
                <label>Real name</label>
                <input className="input" defaultValue="Ahmad User" />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input className="input" defaultValue="+966 5X XXX XXXX" />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="input" defaultValue="ahmad@kfupm.edu.sa" />
              </div>
              <div className="field">
                <label>Address</label>
                <input className="input" defaultValue="KFUPM Campus" />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <button className="primary-btn">Update Profile</button>
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
    </div>
  );
}