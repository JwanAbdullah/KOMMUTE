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
      role: "UI / Backend",
      details: "Software Engineering Student at KFUPM",
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
            <div className="page-header">
              <Link to="/" className="secondary-btn">← Back Home</Link>
              <h1>About Kommute</h1>
              <p>
                Kommute is a campus transportation platform designed to centralize public bus
                information, make routes easier to understand, and create a smoother daily travel
                experience for students, faculty, clubs, and staff.
              </p>
            </div>

            <div className="about-block about-block-story">
              <div className="about-block-text">
                <h2>Our Story</h2>
                <p>
                  KOMMUTE was born out of a simple frustration: missing the bus. As students
                  at KFUPM, we experienced firsthand how the lack of real-time bus information
                  made daily commuting unnecessarily stressful and inefficient.
                </p>
                <p>
                  We created KOMMUTE to build one clear platform for route tracking,
                  scheduling, issue reporting, and transportation support on campus.
                </p>
              </div>

              <div className="about-block-image">
                <img src={buses} alt="Buses" className="about-image" />
              </div>
            </div>

            <div className="about-block about-block-mission">
              <div className="about-block-image">
                <img src={kfupmImage} alt="KFUPM" className="about-image" />
              </div>

              <div className="about-block-text mission-text">
                <h2>Our Mission</h2>
                <p>
                  To improve campus transportation by giving students, faculty, and staff one
                  clear and accessible place for schedules, route information, support, and
                  transportation requests.
                </p>
              </div>
            </div>

            <div className="about-team-block">
              <h2>Our Team</h2>
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