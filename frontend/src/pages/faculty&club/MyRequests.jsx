import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getMyRequests } from "../../services/requestService";

export default function MyRequests({ darkMode, setDarkMode }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClassName = (status) => {
    if (status === "Approved") return "request-status-badge approved";
    if (status === "Rejected") return "request-status-badge rejected";
    return "request-status-badge pending";
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
              <h1>My Requests</h1>
              <p>View the status of your submitted transportation requests.</p>
            </div>

            {loading && (
              <div className="info-box">Loading your requests...</div>
            )}

            {error && (
              <div className="error-box">{error}</div>
            )}

            {!loading && !error && requests.length === 0 && (
              <div className="info-box">You have not submitted any requests yet.</div>
            )}

            <div className="grid-3">
              {requests.map((request) => (
                <div className="card route-card" key={request._id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3>{request.type}</h3>
                      <div className="route-meta">{request.date}</div>
                    </div>
                    <span className={getStatusClassName(request.status)}>
                      {request.status}
                    </span>
                  </div>

                  <div className="list">
                    <div className="list-item">
                      <strong>From:</strong> {request.pickupLocation}
                    </div>
                    <div className="list-item">
                      <strong>To:</strong> {request.destination}
                    </div>
                    <div className="list-item">
                      <strong>Departure:</strong> {request.departureTime}
                    </div>
                    <div className="list-item">
                      <strong>Return:</strong> {request.returnTime}
                    </div>
                    <div className="list-item">
                      <strong>Passengers:</strong> {request.passengers}
                    </div>
                    {request.notes && (
                      <div className="list-item">
                        <strong>Notes:</strong> {request.notes}
                      </div>
                    )}
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