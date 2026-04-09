import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { routes } from "../services/mockData";

const busStops = {
  "Parking 900": [26.302444966152986, 50.14819680562582],
  "Parking 404": [26.301801857328226, 50.15343689744041],
  "27": [26.30577658598772, 50.14997505511192],
  "Station 312": [26.30888286081298, 50.14323318208968],
  "Building 22": [26.30578534978167, 50.14657250801729],
  "Station 319": [26.313217445633892, 50.14996101895771],
  "Building 58": [26.31536295087514, 50.14876797575579],
  "Station 309": [26.31388614973035, 50.14994185229807],
  "Station 310": [26.313487765868626, 50.14465303758838],
  "Station 314": [26.304920814005092, 50.14971838241092],
};

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [60, 60] });
    }
  }, [positions, map]);
  return null;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [homeRouteCoords, setHomeRouteCoords] = useState([]);
  const [homeRouteLoading, setHomeRouteLoading] = useState(false);
  const [homeRouteError, setHomeRouteError] = useState("");

  const matchedRoute = useMemo(() => {
    if (!currentLocation || !destination) return null;
    if (currentLocation === destination) return "same";
    const found = routes.find((route) => {
      const stopNames = route.stops.map((stop) => stop.name);
      return stopNames.includes(currentLocation) && stopNames.includes(destination);
    });
    return found || "none";
  }, [currentLocation, destination]);

  useEffect(() => {
    if (!currentLocation || !destination || currentLocation === destination) {
      setHomeRouteCoords([]);
      setHomeRouteError("");
      return;
    }

    const [oLat, oLng] = busStops[currentLocation];
    const [dLat, dLng] = busStops[destination];

    setHomeRouteLoading(true);
    setHomeRouteError("");

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setHomeRouteCoords(coords);
        } else {
          setHomeRouteError("No route found.");
        }
      })
      .catch(() => setHomeRouteError("Failed to fetch route."))
      .finally(() => setHomeRouteLoading(false));
  }, [currentLocation, destination]);

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
            <Link className="nav-link" to="/map">Map</Link>
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
                <Link to="/map" className="primary-btn">Open Live Map</Link>
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
            <h2 className="section-title">Live Campus Map</h2>
            <p className="section-subtitle">Track buses and explore routes in real time.</p>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Current Location</label>
                <select value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} className="select">
                  <option value="">Select location</option>
                  {Object.keys(busStops).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Destination</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="select">
                  <option value="">Select destination</option>
                  {Object.keys(busStops).filter((s) => s !== currentLocation).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {homeRouteLoading && <p style={{ alignSelf: "flex-end" }}>Fetching route...</p>}
              {homeRouteError && <p style={{ alignSelf: "flex-end", color: "red" }}>{homeRouteError}</p>}
            </div>

            <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
              <MapContainer
                center={[26.308, 50.147]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                {currentLocation && (
                  <Marker position={busStops[currentLocation]}>
                    <Popup>{currentLocation}</Popup>
                  </Marker>
                )}
                {destination && (
                  <Marker position={busStops[destination]}>
                    <Popup>{destination}</Popup>
                  </Marker>
                )}
                {homeRouteCoords.length > 0 && (
                  <>
                    <Polyline positions={homeRouteCoords} color="blue" weight={4} />
                    <FitBounds positions={homeRouteCoords} />
                  </>
                )}
              </MapContainer>
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