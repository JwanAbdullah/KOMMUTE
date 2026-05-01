import React, { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const initialRequests = [
  {
    id: "REQ-201",
    requester: "Engineering Club",
    type: "Event",
    date: "2026-04-20",
    route: "Campus Center → Auditorium",
    passengers: 40,
    status: "Pending",
  },
  {
    id: "REQ-202",
    requester: "Math Department",
    type: "Exam",
    date: "2026-04-22",
    route: "Dorms → Building 22",
    passengers: 85,
    status: "Approved",
  },
  {
    id: "REQ-203",
    requester: "Media Club",
    type: "Club Activity",
    date: "2026-04-24",
    route: "Main Gate → External Venue",
    passengers: 25,
    status: "Rejected",
  },
  {
    id: "REQ-204",
    requester: "Physics Department",
    type: "Event",
    date: "2026-04-25",
    route: "Parking 900 → Conference Hall",
    passengers: 30,
    status: "Pending",
  },
];

export default function RequestsDashboard({ darkMode, setDarkMode }) {

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState(initialRequests);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "All" ? true : request.status === statusFilter;

      const matchesSearch =
        request.id.toLowerCase().includes(search.toLowerCase()) ||
        request.requester.toLowerCase().includes(search.toLowerCase()) ||
        request.type.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, search]);

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      )
    );
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
                    placeholder="Search by ID, requester, or type"
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

            <div className="grid-3">
              {filteredRequests.map((request) => (
                <div className="card route-card" key={request.id}>
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
                      <h3>{request.id}</h3>
                      <div className="route-meta">
                        {request.type} • {request.date}
                      </div>
                    </div>

                    <span className={getStatusClassName(request.status)}>
                      {request.status}
                    </span>
                  </div>

                  <div className="list">
                    <div className="list-item">
                      <strong>Requester:</strong> {request.requester}
                    </div>
                    <div className="list-item">
                      <strong>Route:</strong> {request.route}
                    </div>
                    <div className="list-item">
                      <strong>Passengers:</strong> {request.passengers}
                    </div>
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
                      onClick={() => updateRequestStatus(request.id, "Approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => updateRequestStatus(request.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="info-box" style={{ marginTop: 18 }}>
                No requests match the current filters.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}