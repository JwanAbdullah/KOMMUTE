import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const driverStops = [
  "Parking 900",
  "Parking 404",
  "27",
  "Station 312",
  "Building 22",
  "Station 319",
  "Building 58",
  "Station 309",
  "Station 310",
  "Station 314",
];

export default function ReportDelay({ darkMode, setDarkMode }) {


  const [routeName, setRouteName] = useState("Route 2");
  const [stopName, setStopName] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("");
  const [reason, setReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const delayPreview = useMemo(() => {
    if (!stopName || !delayMinutes) return null;
    return `Route ${routeName.replace("Route ", "")} will be delayed by ${delayMinutes} minutes at ${stopName}.`;
  }, [routeName, stopName, delayMinutes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
            
              <h1>Report Delay</h1>
              <p>
                Let riders know when a bus will arrive late, which stop is affected,
                and the expected delay duration.
              </p>
            </div>

            <div className="card form-card">
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="field">
                  <label>Route</label>
                  <select
                    className="select"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    required
                  >
                    <option value="Route 1">Route 1</option>
                    <option value="Route 2">Route 2</option>
                    <option value="Route 3">Route 3</option>
                    <option value="Route 4">Route 4</option>
                    <option value="Route 5">Route 5</option>
                    <option value="Route 6">Route 6</option>
                    <option value="Route 7">Route 7</option>
                    <option value="Route 8">Route 8</option>
                  </select>
                </div>

                <div className="field">
                  <label>Affected stop</label>
                  <select
                    className="select"
                    value={stopName}
                    onChange={(e) => setStopName(e.target.value)}
                    required
                  >
                    <option value="">Select stop</option>
                    {driverStops.map((stop) => (
                      <option key={stop} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Delay duration (minutes)</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    value={delayMinutes}
                    onChange={(e) => setDelayMinutes(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Reason</label>
                  <select
                    className="select"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="Traffic congestion">Traffic congestion</option>
                    <option value="Mechanical issue">Mechanical issue</option>
                    <option value="Passenger loading delay">Passenger loading delay</option>
                    <option value="Road closure">Road closure</option>
                    <option value="Weather conditions">Weather conditions</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="field full-span">
                  <label>Additional notes</label>
                  <textarea
                    className="textarea"
                    placeholder="Add any useful details for riders or dispatch..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </div>

                {delayPreview && (
                  <div className="full-span info-box">
                    <strong>Preview:</strong> {delayPreview}
                  </div>
                )}

                <div className="full-span">
                  <button type="submit" className="primary-btn">
                    Submit Delay Report
                  </button>
                </div>
              </form>

              {submitted && (
                <div className="success-box">
                  Delay report submitted. Riders can now be notified about the affected stop and delay.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}