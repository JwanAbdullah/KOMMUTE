import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { liveBuses, mapStops, routes, stops } from "../services/mockData";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("route-2");

  const matchedRoute = useMemo(() => {
    if (!currentLocation || !destination) return null;
    if (currentLocation === destination) return "same";

    const found = routes.find((route) => {
      const stopNames = route.stops.map((stop) => stop.name);
      return stopNames.includes(currentLocation) && stopNames.includes(destination);
    });

    return found || "none";
  }, [currentLocation, destination]);

  const visibleRoute = routes.find((route) => route.id === selectedRoute) || routes[0];

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand">
            <div className="brand-badge">K</div>
            <span>Kommute</span>
          </Link>

          <nav className="nav-links">
            <Link className="nav-link" to="/">Home</Link>
            <a className="nav-link" href="#map">Map</a>
            <a className="nav-link" href="#routes">Schedules</a>
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/submit-report">Submit Report</Link>
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? "☀" : "☾"}
            </button>
            <Link className="secondary-btn" to="/login">Login</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="card hero-card">
              <span className="hero-kicker">Campus transportation, made simple</span>
              <h1>Track buses, find routes, and move smarter.</h1>
              <p>
                Kommute gives students and campus users one clean place to view live buses,
                search routes, check schedules, and report transportation issues.
              </p>

              <div className="hero-actions">
                <a href="#map" className="primary-btn">Open Live Map</a>
                <a href="#routes" className="secondary-btn">Browse Schedules</a>
              </div>
            </div>

            <div className="stats-grid">
              <div className="card stat-box">
                <div className="stat-label">Active routes</div>
                <div className="stat-value">8</div>
              </div>
              <div className="card stat-box">
                <div className="stat-label">Live buses now</div>
                <div className="stat-value">3</div>
              </div>
              <div className="card stat-box">
                <div className="stat-label">Average wait time</div>
                <div className="stat-value">6 min</div>
              </div>
              <div className="card stat-box">
                <div className="stat-label">Service status</div>
                <div className="stat-value">Smooth</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="map">
          <div className="container">
            <h2 className="section-title">Live map and route finder</h2>
            <p className="section-subtitle">
              Choose your current location and destination to get the best route.
            </p>

            <div className="map-layout">
              <div className="card panel">
                <h3 className="panel-title">Plan your ride</h3>

                <div className="field">
                  <label>Current location</label>
                  <select
                    className="select"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                  >
                    <option value="">Select location</option>
                    {stops.map((stop) => (
                      <option key={stop} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Destination</label>
                  <select
                    className="select"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    <option value="">Select destination</option>
                    {stops.map((stop) => (
                      <option key={stop} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="helper-row">
                  <span className="chip">Live bus markers</span>
                  <span className="chip">ETA preview</span>
                  <span className="chip">Route highlighting</span>
                </div>

                {matchedRoute && matchedRoute !== "same" && matchedRoute !== "none" && (
                  <div className="route-result">
                    <strong>Recommended:</strong> {matchedRoute.name}
                    <br />
                    <span>
                      ETA: {matchedRoute.eta} • Frequency: {matchedRoute.frequency}
                    </span>
                  </div>
                )}

                {matchedRoute === "same" && (
                  <div className="warning-box">
                    Current location and destination cannot be the same.
                  </div>
                )}

                {matchedRoute === "none" && (
                  <div className="warning-box">
                    No direct route available between the selected points.
                  </div>
                )}

                <div className="info-box">
                  If live GPS becomes unavailable, the interface can fall back to scheduled times only.
                </div>
              </div>

              <div className="card map-card">
                <div className="map-header">
                  <h3 className="panel-title">Interactive campus map</h3>
                  <select
                    className="select"
                    style={{ width: 220 }}
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                  >
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="map-canvas">
                  <div className="fake-map">
                    <div className="map-road road-h" style={{ left: "10%", top: "22%", width: "72%" }} />
                    <div className="map-road road-h" style={{ left: "16%", top: "60%", width: "56%" }} />
                    <div className="map-road road-v" style={{ left: "30%", top: "18%", height: "56%" }} />
                    <div className="map-road road-v" style={{ left: "58%", top: "23%", height: "44%" }} />
                    <div className={`route-line ${visibleRoute.color}`} style={{ left: "13%", top: "22%", width: "60%", height: 8 }} />
                    <div className={`route-line ${visibleRoute.color}`} style={{ left: "57%", top: "22%", width: 8, height: "38%" }} />
                    <div className={`route-line ${visibleRoute.color}`} style={{ left: "30%", top: "58%", width: "28%", height: 8 }} />

                    {mapStops.map((stop) => (
                      <div
                        key={stop.name}
                        className="stop-marker"
                        style={{ left: stop.left, top: stop.top }}
                        title={stop.name}
                      />
                    ))}

                    {liveBuses.map((bus) => (
                      <div
                        key={bus.id}
                        className="bus-marker"
                        style={{ left: bus.left, top: bus.top }}
                        title={`${bus.route} - ${bus.eta}`}
                      >
                        {bus.id}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: "#21a366" }} />
                    Route highlight
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: "#2f5d4e" }} />
                    Stop markers
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: "#111" }} />
                    Live bus chips
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="routes">
          <div className="container">
            <h2 className="section-title">Bus schedules</h2>
            <p className="section-subtitle">
              Search available public routes and compare stops, timing, and service coverage.
            </p>

            <div className="grid-3">
              {routes.map((route) => (
                <div className="card route-card" key={route.id}>
                  <h3>{route.name}</h3>
                  <div className="route-meta">
                    {route.timing} • {route.frequency}
                  </div>

                  <div className="stops-list">
                    {route.stops.slice(0, 5).map((stop) => (
                      <div className="stop-row" key={`${route.id}-${stop.name}`}>
                        <div className="stop-pin" />
                        <div>
                          <div className="stop-name">{stop.name}</div>
                          <div className="stop-served">Served buildings: {stop.served}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            Kommute public frontend — polished mock UI for campus users.
          </div>
        </footer>
      </main>
    </div>
  );
}