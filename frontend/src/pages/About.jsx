import React, { useState } from "react";
import { Link } from "react-router-dom";
import kfupmImage from "../assets/images/kfupm.jpg";
import buses from "../assets/images/buses.jpg";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function About({ darkMode, setDarkMode }) {
  const [isLoggedIn] = useState(false);
  const [userRole] = useState("guest");
  const [activeHighlight, setActiveHighlight] = useState(0);

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
      icon: "🗺️",
      title: "Clear routes",
      text: "Understand bus lines, stops, and timing without confusion.",
      detail:
        "Kommute organizes route names, stop lists, timings, and served buildings in one place so users do not have to guess which bus to take.",
    },
    {
      icon: "⏱️",
      title: "Faster planning",
      text: "Find the best route quickly and reduce unnecessary waiting.",
      detail:
        "Users can compare routes, check current estimates, and choose the trip that gets them across campus with less waiting.",
    },
    {
      icon: "📢",
      title: "Better communication",
      text: "Make transportation updates and support more accessible.",
      detail:
        "Reports, delay notices, and transportation requests help students, drivers, faculty, and admins stay connected.",
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
        <section className="section about-section">
          <div className="container">
            <div className="page-header about-page-header">
              
              <h1>About Kommute</h1>
              <p>
                Kommute is a campus transportation platform designed to centralize public bus
                information, make routes easier to understand, and create a smoother daily travel
                experience for students, faculty, clubs, and staff.
              </p>
            </div>

            <div className="about-highlight-grid">
              {highlights.map((item, index) => (
                <button
                  className={
                    activeHighlight === index
                      ? "card about-highlight-card active"
                      : "card about-highlight-card"
                  }
                  key={item.title}
                  type="button"
                  onClick={() => setActiveHighlight(index)}
                >
                  <div className="about-highlight-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </button>
              ))}
            </div>

            <div className="card about-feature-detail">
              <div>
                <span className="about-section-kicker">Selected focus</span>
                <h2>{highlights[activeHighlight].title}</h2>
                <p>{highlights[activeHighlight].detail}</p>
              </div>
            </div>

            <div className="about-story-layout">
              <div className="about-section-card card">
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

              <div className="about-section-card card">
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