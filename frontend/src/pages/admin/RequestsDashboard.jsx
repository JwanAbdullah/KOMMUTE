import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getRequests, updateRequestStatus } from "../../services/requestService";

export default function RequestsDashboard({ darkMode, setDarkMode }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "All" ? true : request.status === statusFilter;

      const matchesSearch =
        (request.requester || "").toLowerCase().includes(search.toLowerCase()) ||
        (request.type || "").toLowerCase().includes(search.toLowerCase()) ||
        (request.pickupLocation || "").toLowerCase().includes(search.toLowerCase()) ||
        (request.destination || "").toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    setError("");

    try {
      const updated = await updateRequestStatus(id, newStatus);

      setRequests((prev) =>
        prev.map((request) => (request._id === updated._id ? updated : request))
      );
    } catch (err) {
      setError(err.message || "Failed to update request status.");
    }
  };

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
              <h1>Requests Dashboard</h1>
              <p>
                Review transportation requests from faculty, departments, and clubs.
              </p>
            </div>

            <div className="card form-card" style={{ marginBottom: 20 }}>
              <div className="form-grid">
                <div className="field">
                  <label>Search requests</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Search by requester, type, pickup, or destination"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Status filter</label>
                  <select
                    className="select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {loading && <div className="info-box">Loading requests...</div>}

            {error && <div className="warning-box">{error}</div>}

            {!loading && !error && filteredRequests.length === 0 && (
              <div className="info-box" style={{ marginBottom: 18 }}>
                No requests match the current filters.
              </div>
            )}

            <div className="grid-3">
              {filteredRequests.map((request) => (
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
                    <h3>{request.submittedBy?.name || request.requester || "Unknown requester"}</h3>
                      <span className={getStatusClassName(request.status)}>
                        {request.status}
                      </span>
                    <div className="route-meta">
                      {request.submittedBy?.email && `${request.submittedBy.email} • `}
                      {request.type} • {request.date}
                    </div>

                    
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

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="primary-btn"
                      onClick={() => handleStatusUpdate(request._id, "Approved")}
                      disabled={request.status === "Approved"}
                    >
                      Approve
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => handleStatusUpdate(request._id, "Rejected")}
                      disabled={request.status === "Rejected"}
                    >
                      Reject
                    </button>
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