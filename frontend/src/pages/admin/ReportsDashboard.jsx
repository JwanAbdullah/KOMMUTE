import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

export default function ReportsDashboard({ darkMode, setDarkMode }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");

  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editedStatus, setEditedStatus] = useState("Open");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStoredUser = () => {
    return JSON.parse(localStorage.getItem("kommuteUser"));
  };

  const getReportId = (report) => report._id || report.id || "No ID";

  const getSubmittedByLabel = (report) => {
    return report.submittedByUser?.role || report.submittedBy || "Unknown";
  };

  const getSubmittedName = (report) => {
    return report.submittedByUser?.name || report.fullName || "Unknown";
  };

  const getSubmittedEmail = (report) => {
    return report.submittedByUser?.email || report.email || "No email";
  };

  const getReportDate = (report) => {
    return report.createdAt
      ? new Date(report.createdAt).toLocaleDateString()
      : report.date || "No date";
  };

  const fetchReports = async () => {
    const storedUser = getStoredUser();

    if (!storedUser?.token) {
      setError("You must be logged in as an admin to view reports.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/reports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to fetch reports.");
        setReports([]);
        return;
      }

      const backendReports = Array.isArray(data)
        ? data
        : Array.isArray(data.reports)
        ? data.reports
        : [];

      setReports(backendReports);
    } catch (err) {
      setError("Could not connect to the backend.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const reportId = String(getReportId(report)).toLowerCase();
      const submittedByLabel = getSubmittedByLabel(report);

      const searchValue = search.toLowerCase();

      const matchesSearch =
        reportId.includes(searchValue) ||
        (report.title || "").toLowerCase().includes(searchValue) ||
        (report.category || "").toLowerCase().includes(searchValue) ||
        (report.reportType || "").toLowerCase().includes(searchValue) ||
        (report.stop || "").toLowerCase().includes(searchValue) ||
        (report.route || "").toLowerCase().includes(searchValue) ||
        (report.description || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ? true : report.status === statusFilter;

      const matchesUser =
        userFilter === "All" ? true : submittedByLabel === userFilter;

      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [reports, search, statusFilter, userFilter]);

  const openDetailsModal = (report) => {
    setShowStatusModal(false);
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const openStatusModal = (report) => {
    setShowDetailsModal(false);
    setSelectedReport(report);
    setEditedStatus(report.status || "Open");
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    const storedUser = getStoredUser();
    const reportId = getReportId(selectedReport);

    if (!storedUser?.token) {
      alert("You must be logged in.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify({
          status: editedStatus,
        }),
      });

      const updatedReport = await res.json();

      if (!res.ok) {
        alert(updatedReport.message || updatedReport.error || "Failed to update status.");
        return;
      }

      setReports((prev) =>
        prev.map((report) =>
          getReportId(report) === reportId ? updatedReport : report
        )
      );

      setShowStatusModal(false);
      setSelectedReport(null);
    } catch (err) {
      alert("Could not connect to the backend.");
    }
  };

  const getStatusClassName = (status) => {
    if (status === "Resolved") return "request-status-badge approved";
    if (status === "In Progress") return "request-status-badge pending";
    return "request-status-badge rejected";
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
              <h1>Reports Dashboard</h1>
              <p>Review all reports submitted through the backend.</p>
            </div>

            <div className="card form-card" style={{ marginBottom: 20 }}>
              <div className="form-grid">
                <div className="field">
                  <label>Search reports</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Search by ID, title, category, stop, route, or description"
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
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="field">
                  <label>User filter</label>
                  <select
                    className="select"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="user">Regular User</option>
                    <option value="faculty">Faculty</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {loading && <div className="info-box">Loading reports from backend...</div>}

            {error && <div className="warning-box">{error}</div>}

            {!loading && !error && (
              <>
                <div className="grid-3">
                  {filteredReports.map((report) => {
                    const reportId = getReportId(report);
                    const submittedByLabel = getSubmittedByLabel(report);

                    return (
                      <div
                        className={`card route-card ${
                          submittedByLabel === "driver" ? "driver-report-card" : ""
                        }`}
                        key={reportId}
                      >
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
                            <h3>{report.title || "Untitled Report"}</h3>
                            <div className="route-meta">
                              {reportId} • {report.category || report.reportType || "No category"}
                            </div>

                            {submittedByLabel === "driver" && (
                              <span className="driver-source-badge">
                                Driver Report
                              </span>
                            )}
                          </div>

                          <span className={getStatusClassName(report.status)}>
                            {report.status || "Open"}
                          </span>
                        </div>

                        <div className="list">
                          <div className="list-item">
                            <strong>Submitted by:</strong> {submittedByLabel}
                          </div>

                          <div className="list-item">
                            <strong>Location:</strong> {report.stop || "No stop"}
                          </div>

                          <div className="list-item">
                            <strong>Date:</strong> {getReportDate(report)}
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
                            onClick={() => openDetailsModal(report)}
                          >
                            View Details
                          </button>

                          <button
                            className="secondary-btn"
                            onClick={() => openStatusModal(report)}
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredReports.length === 0 && (
                  <div className="info-box" style={{ marginTop: 18 }}>
                    No reports found from the backend.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {showDetailsModal && selectedReport && (
        <div className="modal-overlay">
          <div className="card modal-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>
                Report Details
              </h3>

              <button
                className="icon-btn"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedReport(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="list">
              <div className="list-item">
                <strong>Report ID:</strong> {getReportId(selectedReport)}
              </div>

              <div className="list-item">
                <strong>Full name:</strong> {getSubmittedName(selectedReport)}
              </div>

              <div className="list-item">
                <strong>Email:</strong> {getSubmittedEmail(selectedReport)}
              </div>

              <div className="list-item">
                <strong>Submitted by:</strong> {getSubmittedByLabel(selectedReport)}
              </div>

              <div className="list-item">
                <strong>Report type:</strong>{" "}
                {selectedReport.reportType || selectedReport.category || "No type"}
              </div>

              <div className="list-item">
                <strong>Route:</strong> {selectedReport.route || "No route"}
              </div>

              <div className="list-item">
                <strong>Stop / Station:</strong> {selectedReport.stop || "No stop"}
              </div>

              <div className="list-item">
                <strong>Date:</strong> {getReportDate(selectedReport)}
              </div>

              <div className="list-item">
                <strong>Status:</strong> {selectedReport.status || "Open"}
              </div>

              <div className="list-item">
                <strong>Image upload:</strong>{" "}
                {selectedReport.imageName || "No image"}
              </div>

              <div className="list-item">
                <strong>Description:</strong>{" "}
                {selectedReport.description || "No description"}
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedReport && (
        <div className="modal-overlay">
          <div className="card modal-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>
                Update Report Status
              </h3>

              <button
                className="icon-btn"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedReport(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusUpdate}>
              <div className="field">
                <label>Report</label>
                <input
                  className="input"
                  value={`${getReportId(selectedReport)} - ${
                    selectedReport.title || "Untitled Report"
                  }`}
                  readOnly
                />
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  className="select"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" className="primary-btn">
                  Save Status
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedReport(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}