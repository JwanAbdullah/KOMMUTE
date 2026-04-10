import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">
          <div className="brand-badge">K</div>
          <span>Kommute</span>
        </div>

        <div className="footer-center">
          © 2026 Kommute. All rights reserved.
        </div>

        <div className="footer-right">
          <a href="mailto:support@kommute.com">
           support@kommute.com
          </a>
        </div>
      </div>
    </footer>
  );
}