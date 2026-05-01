import React, { useEffect, useState } from "react";
import { routes } from "../services/mockData";
import busImg from "../assets/images/kfupm buss.png";

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

const routeTheme = {
  orange: {
    accent: "#f59e0b",
    soft: "#fff3d6",
    text: "#7a4300",
    darkSoft: "#2f2413",
    darkText: "#ffd18a",
  },
  green: {
    accent: "#22c55e",
    soft: "#dcfce7",
    text: "#166534",
    darkSoft: "#142c1d",
    darkText: "#9af0b8",
  },
  blue: {
    accent: "#3b82f6",
    soft: "#dbeafe",
    text: "#1e3a8a",
    darkSoft: "#14233d",
    darkText: "#a9caff",
  },
  brown: {
    accent: "#92400e",
    soft: "#f3e8dc",
    text: "#5c2e0f",
    darkSoft: "#2b2118",
    darkText: "#e8c09c",
  },
  red: {
    accent: "#ef4444",
    soft: "#fee2e2",
    text: "#991b1b",
    darkSoft: "#341919",
    darkText: "#ffaaaa",
  },
  "light red": {
    accent: "#fb7185",
    soft: "#ffe4e6",
    text: "#9f1239",
    darkSoft: "#351b22",
    darkText: "#ffb3c0",
  },
  yellow: {
    accent: "#eab308",
    soft: "#fef9c3",
    text: "#854d0e",
    darkSoft: "#312a12",
    darkText: "#ffe58a",
  },
  grey: {
    accent: "#64748b",
    soft: "#e2e8f0",
    text: "#334155",
    darkSoft: "#1f2933",
    darkText: "#cbd5e1",
  },
};

function getBusProgress(route, now) {
  if (
    !route.startTime ||
    !route.endTime ||
    !route.frequencyMinutes ||
    !route.stops?.length
  ) {
    return {
      status: "unavailable",
      progressPercent: 0,
      currentStop: null,
      nextStop: null,
      message: "Live estimate unavailable for this route.",
    };
  }

  const currentSeconds =
    (now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds();

  const startMinutes = parseTimeToMinutes(route.startTime);
  const endMinutes = parseTimeToMinutes(route.endTime);

  const startSeconds = startMinutes * 60;
  const endSeconds = endMinutes * 60;

  if (currentSeconds < startSeconds) {
    return {
      status: "not_started",
      progressPercent: 0,
      currentStop: null,
      nextStop: null,
      message: `Service starts at ${formatMinutesToTime(startMinutes)}.`,
    };
  }

  if (currentSeconds > endSeconds) {
    return {
      status: "ended",
      progressPercent: 100,
      currentStop: null,
      nextStop: null,
      message: "Service has ended for today.",
    };
  }

  const cycleSeconds = route.frequencyMinutes * 60;
  const secondsIntoCycle = (currentSeconds - startSeconds) % cycleSeconds;
  const progressPercent = (secondsIntoCycle / cycleSeconds) * 100;

  const segmentCount = route.stops.length - 1;
  const segmentLength = cycleSeconds / segmentCount;

  const currentSegment = Math.min(
    Math.floor(secondsIntoCycle / segmentLength),
    segmentCount - 1
  );

  const currentStop = route.stops[currentSegment];
  const nextStop = route.stops[currentSegment + 1];

  const secondsToNextStop =
    segmentLength - (secondsIntoCycle - currentSegment * segmentLength);

  const minutesToNextStop = Math.max(1, Math.ceil(secondsToNextStop / 60));

  return {
    status: "running",
    progressPercent,
    currentStop,
    nextStop,
    message: `Estimated between ${currentStop.name} and ${nextStop.name}. Next stop in about ${minutesToNextStop} min.`,
  };
}

export default function RoutePreview({ darkMode = false }) {
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const selectedRoute = routes.find((route) => route.id === selectedRouteId);
  const theme = routeTheme[selectedRoute.color] || routeTheme.green;

  const softColor = darkMode ? theme.darkSoft : theme.soft;
  const textColor = darkMode ? theme.darkText : theme.text;

  const cardGradient = darkMode
    ? `linear-gradient(180deg, ${softColor} 0%, var(--card) 90%)`
    : `linear-gradient(180deg, ${softColor} 0%, var(--card) 72%)`;

  const busProgress = getBusProgress(selectedRoute, now);

  const statusLabel =
    busProgress.status === "ended"
      ? "Service ended"
      : busProgress.status === "not_started"
      ? "Not started"
      : busProgress.status === "running" && busProgress.currentStop
      ? `At ${busProgress.currentStop.name}`
      : selectedRoute.frequency || "Scheduled trips";

  const showBus =
    busProgress.status === "running" || busProgress.status === "ended";

  return (
    <section className="section route-preview-section" id="routes">
      <div className="container">
        <div className="route-preview-header">
          <div>
            <h2 className="section-title">Bus schedules</h2>
            <p className="section-subtitle">
              Select a route to view timing, frequency, stops, and current bus estimate.
            </p>
          </div>
        </div>

        <div className="route-tabs">
          {routes.map((route) => {
            const isActive = selectedRouteId === route.id;

            return (
              <button
                key={route.id}
                className={isActive ? "route-tab active" : "route-tab"}
                onClick={() => setSelectedRouteId(route.id)}
                type="button"
              >
                {route.name}
              </button>
            );
          })}
        </div>

        <div
          className="route-ticket-card"
          style={{
            borderColor: theme.accent,
            background: cardGradient,
          }}
        >
          <div className="route-ticket-header">
            <div>
              <h3 style={{ color: textColor }}>{selectedRoute.name}</h3>

              <span
                className="route-color-pill"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.08)" : "#ffffff",
                  color: textColor,
                  borderColor: theme.accent,
                }}
              >
                {selectedRoute.color}
              </span>
            </div>

            <strong className="route-ticket-eta" style={{ color: textColor }}>
              {selectedRoute.eta}
            </strong>
          </div>

          <div className="route-ticket-time">
            <div>
              <strong style={{ color: textColor }}>
                {selectedRoute.startTime || selectedRoute.trips?.[0]?.depart || "--"}
              </strong>
              <span>{busProgress.status === "not_started" ? "Starts" : "Start"}</span>
            </div>

            <div
              className="route-duration-pill"
              style={{
                borderColor: theme.accent,
                color: textColor,
              }}
            >
              {statusLabel}
            </div>

            <div>
              <strong style={{ color: textColor }}>
                {selectedRoute.endTime || selectedRoute.trips?.[0]?.return || "--"}
              </strong>
              <span>End</span>
            </div>
          </div>

          <div className="route-ticket-meta">
            <span
              style={{
                background: darkMode ? "rgba(255,255,255,0.08)" : softColor,
                color: textColor,
              }}
            >
              {selectedRoute.timing}
            </span>
            <span
              style={{
                background: darkMode ? "rgba(255,255,255,0.08)" : softColor,
                color: textColor,
              }}
            >
              {selectedRoute.stops.length} stops
            </span>
          </div>

          <div className="bus-track-box">
            <div className="bus-track-line">
              <div
                className="bus-track-fill"
                style={{
                  width: `${busProgress.progressPercent}%`,
                  background: theme.accent,
                }}
              />

              {showBus && (
                <div
                  className="moving-bus"
                  style={{
                    left: `${busProgress.progressPercent}%`,
                  }}
                >
                  <img src={busImg} alt="Bus" className="bus-img" />
                </div>
              )}
            </div>

            <div className="bus-location-text">
              <strong style={{ color: textColor }}>Current estimate:</strong>{" "}
              {busProgress.message}
            </div>
          </div>
        </div>

        <div className="stops-ticket-list">
          {selectedRoute.stops.map((stop, index) => {
            const isCurrentStop =
              busProgress.status === "running" &&
              busProgress.currentStop?.name === stop.name;

            const isNextStop =
              busProgress.status === "running" &&
              busProgress.nextStop?.name === stop.name;

            const isHighlighted = isCurrentStop || isNextStop;

            return (
              <div
                className="stop-ticket-row"
                key={`${stop.name}-${index}`}
                style={{
                  borderColor: isHighlighted ? theme.accent : undefined,
                  background: isHighlighted
                    ? `linear-gradient(90deg, ${softColor} 0%, var(--card) 82%)`
                    : "var(--card)",
                }}
              >
                <div
                  className="stop-number"
                  style={{
                    background: isHighlighted ? theme.accent : softColor,
                    color: isHighlighted ? "#ffffff" : textColor,
                  }}
                >
                  {index + 1}
                </div>

                <div className="stop-ticket-content">
                  <h3 style={{ color: textColor }}>
                    {stop.name}
                    {isCurrentStop && <span className="stop-badge">Current</span>}
                    {isNextStop && <span className="stop-badge">Next</span>}
                  </h3>
                  <p>Served buildings: {stop.served}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}