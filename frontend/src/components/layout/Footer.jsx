import React from "react";
import Resources from "../../pages/Routes";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">
          <span>Kommute</span>
        </div>

        <div className="footer-center">
          © 2026 Kommute. All rights reserved.
        </div>
        <div className="footer-center">
          <a href="mailto:support@kommute.com">
           support@kommute.com
          </a>
        </div>

        <div className="footer-right">
          <span className="footer-title">Resources</span>

          <Link to="/resources" className="footer-link">Routes</Link>
          <Link to="/BusStops" className="footer-link">Bus Stops</Link>
          <Link to="/contact" className="footer-link">Support</Link>
          <Link to="/faq" className="footer-link">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}