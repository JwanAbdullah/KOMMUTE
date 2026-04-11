import React, { useState } from "react";
import { Link } from "react-router-dom";
import kfupmImage from "../assets/images/kfupm.jpg";
import buses from "../assets/images/buses.jpg";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function About() {
  const [darkMode, setDarkMode] = useState(false);

  const [isLoggedIn] = useState(false);
  const [userRole] = useState("guest");

  const teamMembers = [
    {
      name: "Jwan Alghamdi",
      role: "UI / Frontend",
      details: "Software Engineering Student at KFUPM",
    },
    {
      name: "Lamar Alshehri",
      role: "Backend",
      details: "Software Engineering Student at KFUPM",
    },
  ];

  const highlights = [
    {
      title: "Clear routes",
      text: "Understand bus lines, stops, and timing without confusion.",
    },
    {
      title: "Faster planning",
      text: "Find the best route quickly and reduce unnecessary waiting.",
    },
    {
      title: "Better communication",
      text: "Make transportation updates and support more accessible.",
    },
  ];

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header about-page-header">
              <Link to="/" className="secondary-btn">← Back Home</Link>
              <h1>About Kommute</h1>
              <p>
                Kommute is a campus transportation platform designed to centralize public bus
                information, make routes easier to understand, and create a smoother daily travel
                experience for students, faculty, clubs, and staff.
              </p>
            </div>

            <div className="about-highlight-grid">
              {highlights.map((item) => (
                <div className="card about-highlight-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <div className="about-section-card card">
              <div className="about-section-grid">
                <div className="about-copy">
                  <span className="about-section-kicker">Our Story</span>
                  <h2>Built from a real campus problem</h2>
                  <p>
                    KOMMUTE was born out of a simple frustration: missing the bus. As students
                    at KFUPM, we experienced firsthand how the lack of clear, real-time
                    transportation information made commuting harder than it should be.
                  </p>
                  <p>
                    We wanted one place that makes campus transportation easier to understand,
                    easier to follow, and easier to trust.
                  </p>
                </div>

                <div className="about-media">
                  <img src={buses} alt="Campus buses" className="about-image" />
                </div>
              </div>
            </div>

            <div className="about-section-card card">
              <div className="about-section-grid reverse">
                <div className="about-media">
                  <img src={kfupmImage} alt="KFUPM campus" className="about-image" />
                </div>

                <div className="about-copy">
                  <span className="about-section-kicker">Our Mission</span>
                  <h2>Make campus mobility simpler</h2>
                  <p>
                    Our goal is to improve campus transportation by giving students, faculty,
                    and staff one clear and accessible place for routes, schedules, requests,
                    updates, and support.
                  </p>
                  <p>
                    Kommute is meant to reduce confusion, save time, and create a better daily
                    transportation experience for the whole campus community.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-team-block">
              <div className="about-team-header">
                <span className="about-section-kicker">Our Team</span>
                <h2>The people behind Kommute</h2>
                <p>
                  A student-built project focused on solving real transportation pain points on campus.
                </p>
              </div>

              <div className="about-team-grid-simple">
                {teamMembers.map((member) => (
                  <div className="about-team-card-simple card" key={member.name}>
                    <div className="about-avatar-simple">👤</div>
                    <h3>{member.name}</h3>
                    <p className="about-role-simple">{member.role}</p>
                    <p className="about-details-simple">{member.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}