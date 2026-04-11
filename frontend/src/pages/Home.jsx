import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { routes } from "../services/mockData";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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

function parseTimeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function getFixedRouteWaitInfo(route, now) {
  if (!route?.trips?.length) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const nextTrip = route.trips.find(
    (trip) => parseTimeToMinutes(trip.depart) >= currentMinutes
  );

  if (!nextTrip) {
    return {
      status: "ended",
      waitMinutes: null,
      nextArrival: null,
      nextReturn: null,
    };
  }

  const departMinutes = parseTimeToMinutes(nextTrip.depart);

  return {
    status: "scheduled",
    waitMinutes: departMinutes - currentMinutes,
    nextArrival: formatMinutesToTime(departMinutes),
    nextReturn: formatMinutesToTime(parseTimeToMinutes(nextTrip.return)),
  };
}

function getIntervalRouteWaitInfo(route, now) {
  if (!route?.startTime || !route?.endTime || !route?.frequencyMinutes) {
    return null;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = parseTimeToMinutes(route.startTime);
  const endMinutes = parseTimeToMinutes(route.endTime);
  const frequency = route.frequencyMinutes;

  if (currentMinutes < startMinutes) {
    return {
      status: "not_started",
      waitMinutes: startMinutes - currentMinutes,
      nextArrival: formatMinutesToTime(startMinutes),
    };
  }

  if (currentMinutes > endMinutes) {
    return {
      status: "ended",
      waitMinutes: null,
      nextArrival: null,
    };
  }

  const minutesSinceStart = currentMinutes - startMinutes;
  const remainder = minutesSinceStart % frequency;
  const waitMinutes = remainder === 0 ? 0 : frequency - remainder;
  const nextArrival = currentMinutes + waitMinutes;

  return {
    status: "running",
    waitMinutes,
    nextArrival: formatMinutesToTime(nextArrival),
  };
}

function getRouteWaitInfo(route, now) {
  if (!route) return null;

  if (route.scheduleType === "fixed") {
    return getFixedRouteWaitInfo(route, now);
  }

  return getIntervalRouteWaitInfo(route, now);
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  // Temporary frontend-only auth state for testing header behavior
  const [isLoggedIn] = useState(false);
  const [userRole] = useState("guest");
  // Example test values:
  // const [isLoggedIn] = useState(true);
  // const [userRole] = useState("admin");
  // const [userRole] = useState("faculty");
  // const [userRole] = useState("driver");
  // const [userRole] = useState("user");

  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [now, setNow] = useState(new Date());
  const [homeRouteCoords, setHomeRouteCoords] = useState([]);
  const [homeRouteLoading, setHomeRouteLoading] = useState(false);
  const [homeRouteError, setHomeRouteError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const matchedRoute = useMemo(() => {
    if (!currentLocation || !destination) return null;
    if (currentLocation === destination) return "same";

    const found = routes.find((route) => {
      const stopNames = route.stops.map((stop) => stop.name);
      const currentIndex = stopNames.indexOf(currentLocation);
      const destinationIndex = stopNames.indexOf(destination);

      return (
        currentIndex !== -1 &&
        destinationIndex !== -1 &&
        currentIndex < destinationIndex
      );
    });

    return found || "none";
  }, [currentLocation, destination]);

  const matchedRouteWaitInfo = useMemo(() => {
    if (!matchedRoute || matchedRoute === "same" || matchedRoute === "none") {
      return null;
    }

    return getRouteWaitInfo(matchedRoute, now);
  }, [matchedRoute, now]);



  const activeRoutesCount = useMemo(() => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return routes.filter((route) => {
    if (route.scheduleType === "fixed" && route.trips?.length) {
      return route.trips.some((trip) => {
        const depart = parseTimeToMinutes(trip.depart);
        const ret = parseTimeToMinutes(trip.return);
        return currentMinutes >= depart && currentMinutes <= ret;
      });
    }

    if (route.scheduleType === "interval" && route.startTime && route.endTime) {
      const start = parseTimeToMinutes(route.startTime);
      const end = parseTimeToMinutes(route.endTime);
      return currentMinutes >= start && currentMinutes <= end;
    }

    if (route.timing) {
      const match = route.timing.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);

      if (!match) return false;

      const [, startTime, startPeriod, endTime, endPeriod] = match;

      const to24h = (time, period) => {
        let [h, m] = time.split(":").map(Number);
        const upper = period.toUpperCase();

        if (upper === "PM" && h !== 12) h += 12;
        if (upper === "AM" && h === 12) h = 0;

        return h * 60 + m;
      };

      const start = to24h(startTime, startPeriod);
      const end = to24h(endTime, endPeriod);

      return currentMinutes >= start && currentMinutes <= end;
    }

    return false;
  }).length;
}, [now]);

  const busesInOperation = useMemo(() => {
    if (activeRoutesCount === 0) return 0;
    return 20; //assumption of 20 buses total in operation across all active routes 
  }, [activeRoutesCount]);

  const averageWaitDisplay = useMemo(() => {
  const waits = routes
    .map((route) => {
      if (route.frequency) {
        const match = route.frequency.match(/(\d+)/);
        if (match) {
          const frequencyMinutes = Number(match[1]);
          return Math.round(frequencyMinutes / 2);
        }
      }

      if (route.scheduleType === "fixed" || route.trips?.length) {
        const info = getRouteWaitInfo(route, now);
        if (info && typeof info.waitMinutes === "number") {
          return info.waitMinutes;
        }
      }

      return null;
    })
    .filter((wait) => wait !== null && wait <= 20);

  if (!waits.length) return "6 min";

  const avg = Math.round(
    waits.reduce((sum, value) => sum + value, 0) / waits.length
  );

  return `${avg} min`;
}, [now]);

  const nextDepartureDisplay = useMemo(() => {
    const times = routes
      .map((r) => getRouteWaitInfo(r, now))
      .filter((i) => i && i.nextArrival)
      .map((i) => i.nextArrival);

    return times.length ? times[0] : "--";
  }, [now]);
  useEffect(() => {
    if (!currentLocation || !destination || currentLocation === destination) {
      setHomeRouteCoords([]);
      setHomeRouteError("");
      return;
    }

    const currentStop = busStops[currentLocation];
    const destinationStop = busStops[destination];

    if (!currentStop || !destinationStop) {
      setHomeRouteCoords([]);
      setHomeRouteError("Missing stop coordinates.");
      return;
    }

    const [oLat, oLng] = currentStop;
    const [dLat, dLng] = destinationStop;

    setHomeRouteLoading(true);
    setHomeRouteError("");

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
            lat,
            lng,
          ]);
          setHomeRouteCoords(coords);
        } else {
          setHomeRouteCoords([]);
          setHomeRouteError("No route found.");
        }
      })
      .catch(() => {
        setHomeRouteCoords([]);
        setHomeRouteError("Failed to fetch route.");
      })
      .finally(() => setHomeRouteLoading(false));
  }, [currentLocation, destination]);

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="card hero-card">
              <span className="hero-kicker">Campus transportation, made simple</span>

              <h1>Track buses, find routes, and move smarter.</h1>

              <p>
                Kommute gives students and campus users one clean place to view live
                buses, search routes, check schedules, and report transportation issues.
              </p>

              <div className="hero-actions">
                <a href="#map" className="primary-btn">Open Live Map</a>
                <a href="#routes" className="secondary-btn">Browse Schedules</a>
              </div>
            </div>

            <div className="stats-grid">
              <div className="card stat-box">
                <div className="stat-label stat-label-live">
                  <span>Active routes</span>
                  <span className="live-dot" />
                </div>
                <div className="stat-value">{activeRoutesCount}</div>
              </div>

              <div className="card stat-box">
                <div className="stat-label">Buses in operation</div>
                <div className="stat-value">{busesInOperation}</div>
              </div>

              <div className="card stat-box">
                <div className="stat-label">Average wait time</div>
                <div className="stat-value">{averageWaitDisplay}</div>
              </div>

              <div className="card stat-box">
                <div className="stat-label">Approximate next departure</div>
                <div className="stat-value">{nextDepartureDisplay}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="map">
          <div className="container">
            <h2 className="section-title">Live Campus Map</h2>
            <p className="section-subtitle">
              Track buses and explore routes in real time.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Current Location</label>
                <select
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="select"
                >
                  <option value="">Select location</option>
                  {Object.keys(busStops).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="select"
                >
                  <option value="">Select destination</option>
                  {Object.keys(busStops)
                    .filter((s) => s !== currentLocation)
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>

              <p style={{ width: "100%", marginTop: "6px", color: "gray" }}>
                Current time: {now.toLocaleTimeString()}
              </p>

              {homeRouteLoading && (
                <p style={{ alignSelf: "flex-end" }}>Fetching route...</p>
              )}

              {homeRouteError && (
                <p style={{ alignSelf: "flex-end", color: "red" }}>
                  {homeRouteError}
                </p>
              )}

              {matchedRoute && matchedRoute !== "same" && matchedRoute !== "none" && (
                <div className="route-result" style={{ width: "100%", marginTop: "8px" }}>
                  <strong>Suggested bus route:</strong> {matchedRoute.name}
                  <br />

                  {matchedRoute.scheduleType === "fixed" ? (
                    <>
                      <span>Schedule type: Fixed departure times</span>

                      {matchedRouteWaitInfo?.status === "scheduled" && (
                        <>
                          <br />
                          <span>
                            Next departure: {matchedRouteWaitInfo.nextArrival} •
                            Return: {matchedRouteWaitInfo.nextReturn} • Wait time:{" "}
                            {matchedRouteWaitInfo.waitMinutes} min
                          </span>
                        </>
                      )}

                      {matchedRouteWaitInfo?.status === "ended" && (
                        <>
                          <br />
                          <span>All trips for this route have ended for today.</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <span>
                        Timing: {matchedRoute.timing} • Frequency: every{" "}
                        {matchedRoute.frequencyMinutes} minutes
                      </span>

                      {matchedRouteWaitInfo?.status === "running" && (
                        <>
                          <br />
                          <span>
                            Next bus: {matchedRouteWaitInfo.nextArrival} • Wait time:{" "}
                            {matchedRouteWaitInfo.waitMinutes} min
                          </span>
                        </>
                      )}

                      {matchedRouteWaitInfo?.status === "not_started" && (
                        <>
                          <br />
                          <span>
                            Route has not started yet • Starts in{" "}
                            {matchedRouteWaitInfo.waitMinutes} min at{" "}
                            {matchedRouteWaitInfo.nextArrival}
                          </span>
                        </>
                      )}

                      {matchedRouteWaitInfo?.status === "ended" && (
                        <>
                          <br />
                          <span>Service for this route has ended for today.</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {matchedRoute === "same" && (
                <div className="warning-box" style={{ width: "100%", marginTop: "8px" }}>
                  Current location and destination cannot be the same.
                </div>
              )}

              {matchedRoute === "none" && (
                <div className="warning-box" style={{ width: "100%", marginTop: "8px" }}>
                  No matching bus route was found for this trip.
                </div>
              )}
            </div>

            <div
              style={{
                height: "500px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
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
              Search available public routes and compare stops, timing, and service
              coverage.
            </p>

            <div className="grid-3">
              {routes.map((route) => (
                <div className="card route-card" key={route.id}>
                  <h3>{route.name}</h3>
                  <div className="route-meta">
                    {route.timing} • {route.frequency}
                  </div>
                  <div className="stops-list">
                    {route.stops.map((stop, index) => (
                      <div className="stop-row" key={`${route.id}-${stop.name}-${index}`}>
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