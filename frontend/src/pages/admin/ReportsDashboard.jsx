import React, { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const initialReports = [
  {
    id: "REP-301",
    title: "Bus arrived late",
    category: "Delay",
    submittedBy: "Student",
    fullName: "Ahmad User",
    email: "ahmad@kfupm.edu.sa",
    reportType: "Delay",
    route: "Route 2",
    stop: "Station 312",
    description: "The bus arrived much later than expected during the morning trip.",
    imageName: "delay-photo.jpg",
    date: "2026-04-20",
    status: "Open",
  },
  {
    id: "REP-302",
    title: "Driver skipped stop",
    category: "Service Issue",
    submittedBy: "Faculty",
    fullName: "Mariam Alshammari",
    email: "mariam@kfupm.edu.sa",
    reportType: "Service Issue",
    route: "Route 1",
    stop: "Building 22",
    description: "The bus passed the stop without stopping even though students were waiting.",
    imageName: "no-image",
    date: "2026-04-21",
    status: "In Progress",
  },
  {
    id: "REP-303",
    title: "Bus overcrowded",
    category: "Capacity",
    submittedBy: "Student",
    fullName: "Faisal Salem",
    email: "faisal@kfupm.edu.sa",
    reportType: "Capacity",
    route: "Route 5",
    stop: "Parking 900",
    description: "The bus was too full and several students could not get on.",
    imageName: "crowded-bus.png",
    date: "2026-04-21",
    status: "Resolved",
  },

  {
    id: "REP-304",
    title: "Delay reported on Route 2",
    category: "Driver Delay",
    submittedBy: "Driver",
    fullName: "Ahmed Alharbi",
    email: "driver101@kommute.com",
    reportType: "Delay",
    route: "Route 2",
    stop: "Station 312",
    description: "Route 2 will be delayed by 10 minutes at Station 312 due to traffic congestion.",
    imageName: "no-image",
    date: "2026-04-22",
    status: "Open",
  },
  {
    id: "REP-305",
    title: "Delay reported on Route 5",
    category: "Driver Delay",
    submittedBy: "Driver",
    fullName: "Mansour Alotaibi",
    email: "driver102@kommute.com",
    reportType: "Delay",
    route: "Route 5",
    stop: "Building 58",
    description: "Route 5 will be delayed by 15 minutes at Building 58 due to passenger loading delay.",
    imageName: "no-image",
    date: "2026-04-22",
    status: "In Progress",
  },
  {
    id: "REP-306",
    title: "Delay reported on Route 1",
    category: "Driver Delay",
    submittedBy: "Driver",
    fullName: "Khaled Alghamdi",
    email: "driver103@kommute.com",
    reportType: "Delay",
    route: "Route 1",
    stop: "Parking 900",
    description: "Route 1 was delayed by 8 minutes at Parking 900 بسبب ازدحام المرور.",
    imageName: "no-image",
    date: "2026-04-23",
    status: "Resolved",
  },
];

export default function ReportsDashboard({ darkMode, setDarkMode }) {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [reports, setReports] = useState(initialReports);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editedStatus, setEditedStatus] = useState("Open");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
        const matchesSearch =
        report.id.toLowerCase().includes(search.toLowerCase()) ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.category.toLowerCase().includes(search.toLowerCase()) ||
        report.stop.toLowerCase().includes(search.toLowerCase()) ||
        report.route.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
        statusFilter === "All" ? true : report.status === statusFilter;

        const matchesUser =
        userFilter === "All" ? true : report.submittedBy === userFilter;

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
    setEditedStatus(report.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();

    setReports((prev) =>
      prev.map((report) =>
        report.id === selectedReport.id
          ? { ...report, status: editedStatus }
          : report
      )
    );

    setShowStatusModal(false);
    setSelectedReport(null);
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
              <p>
                Review transportation complaints, delays, and service-related reports.
              </p>
            </div>

            <div className="card form-card" style={{ marginBottom: 20 }}>
              <div className="form-grid">
                <div className="field">
                  <label>Search reports</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Search by ID, title, category, stop, or route"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="field">
                    <label>User filter</label>
                    <select
                        className="select"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Club Member">Club Member</option>
                        <option value="Driver">Driver</option>
                    </select>
                    </div>
              </div>
            </div>

            <div className="grid-3">
              {filteredReports.map((report) => (
                <div className="card route-card" key={report.id}>
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
                      <h3>{report.title}</h3>
                      <div className="route-meta">
                        {report.id} • {report.category}
                      </div>
                    </div>

                    <span className={getStatusClassName(report.status)}>
                      {report.status}
                    </span>
                  </div>

                  <div className="list">
                    <div className="list-item">
                      <strong>Submitted by:</strong> {report.submittedBy}
                    </div>
                    <div className="list-item">
                      <strong>Location:</strong> {report.stop}
                    </div>
                    <div className="list-item">
                      <strong>Date:</strong> {report.date}
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
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="info-box" style={{ marginTop: 18 }}>
                No reports match the current filters.
              </div>
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
                <strong>Report ID:</strong> {selectedReport.id}
              </div>
              <div className="list-item">
                <strong>Full name:</strong> {selectedReport.fullName}
              </div>
              <div className="list-item">
                <strong>Email:</strong> {selectedReport.email}
              </div>
              <div className="list-item">
                <strong>Submitted by:</strong> {selectedReport.submittedBy}
              </div>
              <div className="list-item">
                <strong>Report type:</strong> {selectedReport.reportType}
              </div>
              <div className="list-item">
                <strong>Route:</strong> {selectedReport.route}
              </div>
              <div className="list-item">
                <strong>Stop / Station:</strong> {selectedReport.stop}
              </div>
              <div className="list-item">
                <strong>Date:</strong> {selectedReport.date}
              </div>
              <div className="list-item">
                <strong>Image upload:</strong> {selectedReport.imageName}
              </div>
              <div className="list-item">
                <strong>Description:</strong> {selectedReport.description}
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
                  value={`${selectedReport.id} - ${selectedReport.title}`}
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