import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { routes } from "../services/mockData";

export default function Resources({ darkMode, setDarkMode }) {
  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
              <div className="back-btn-wrap">
                    <Link to="/" className="secondary-btn">← Back Home</Link>
                </div>
              <h1>Routes Resources</h1>
              <p>
                Static reference of all campus routes, stops, and service coverage.
              </p>
            </div>

            <div className="grid-3">
              {routes.map((route) => (
                <div className="card route-card" key={route.id}>
                  <h3>{route.name}</h3>
                  <div className="route-meta">
                    {route.timing} • {route.frequency}
                  </div>

                  <div className="stops-list">
                    {route.stops.map((stop, i) => (
                      <div className="stop-row" key={i}>
                        <div className="stop-pin" />
                        <div>
                          <div className="stop-name">{stop.name}</div>
                          <div className="stop-served">
                            Served buildings: {stop.served}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}