import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../../services/driverService";


export default function DriversDashboard({ darkMode, setDarkMode }) {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newDriver, setNewDriver] = useState({
  driverId: "",
  name: "",
  assignedRoute: "",
  email:"",
  password:"",
  status: "Active",
  phone: "",
});

const [editDriver, setEditDriver] = useState({
  driverId: "",
  name: "",
  assignedRoute: "",
  status: "Active",
  phone: "",
});
  useEffect(() => {
    getDrivers()
      .then(setDrivers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
      (driver.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (driver.driverId || "").toLowerCase().includes(search.toLowerCase()) ||
      (driver.assignedRoute || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const handleAddDriver = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const created = await createDriver(newDriver);
    setDrivers((prev) => [created, ...prev]);

    setNewDriver({
      driverId: "",
      name: "",
      email: "",  
      password: "",
      assignedRoute: "",
      status: "Active",
      phone: "",
    });

    setShowAddDriverModal(false);
  } catch (err) {
    setError(err.message || "Failed to add driver.");
  }
};

  const openProfileModal = (driver) => {
    setShowAddDriverModal(false);
    setShowEditModal(false);
    setSelectedDriver(driver);
    setShowProfileModal(true);
  };

  const openEditModal = (driver) => {
    setShowAddDriverModal(false);
    setShowProfileModal(false);
    setSelectedDriver(driver);
    setEditDriver(driver);
    setShowEditModal(true);
  };

  const handleEditDriver = (e) => {
    e.preventDefault();

    setDrivers((prev) =>
      prev.map((driver) =>
        driver._id === selectedDriver._id
          ? {
              ...editDriver,
              lastUpdate: "Just now",
            }
          : driver
      )
    );

    setShowEditModal(false);
    setSelectedDriver(null);
  };

  const handleDeleteDriver = () => {
    setDrivers((prev) =>
      prev.filter((driver) => driver._id !== selectedDriver._id)
    );

    setShowEditModal(false);
    setSelectedDriver(null);
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <div className="page-header" style={{ paddingBottom: 10 }}>
                <h1>Drivers Dashboard</h1>
              </div>

              <button
                className="primary-btn"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowEditModal(false);
                  setShowAddDriverModal(true);
                }}
              >
                Add Driver
              </button>
            </div>

            <div className="card form-card" style={{ marginBottom: 20 }}>
              <div className="form-grid">
                <div className="field">
                  <label>Search drivers</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Search by name, ID, or route"
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
                    <option value="Active">Active</option>
                    <option value="On Break">On Break</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>
            </div>
{loading && <div className="info-box">Loading drivers...</div>}
{error && <div className="warning-box">{error}</div>}
            <div className="grid-3">
              {filteredDrivers.map((driver) => (
                <div className="card route-card" key={driver._id}>
                  <h3>{driver.user?.name || "Unknown Driver"}</h3>
                  <div className="route-meta">
                    {driver.driverId} • {driver.user?.email}
                  </div>

                  <div className="list">
                    <div className="list-item">
                      <strong>Status:</strong> {driver.status}
                    </div>
                    <div className="list-item">
                      <strong>Phone:</strong> {driver.phone}
                    </div>
                    <div className="list-item">
                      <strong>Last update:</strong> {driver.lastUpdate}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 16,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="primary-btn"
                      onClick={() => openProfileModal(driver)}
                    >
                      View Profile
                    </button>

                    <button
                      className="secondary-btn"
                      onClick={() => openEditModal(driver)}
                    >
                      Edit Information
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDrivers.length === 0 && (
              <div className="info-box" style={{ marginTop: 18 }}>
                No drivers match the current filters.
              </div>
            )}
          </div>
        </section>
      </main>

      {showAddDriverModal && (
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
              <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>Add New Driver</h3>
              <button
                className="icon-btn"
                onClick={() => setShowAddDriverModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <form className="form-grid" onSubmit={handleAddDriver}>
              <div className="field">
                <label>Driver ID</label>
                <input
                  className="input"
                  value={newDriver.driverId}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, driverId: e.target.value }))
                  }
                  placeholder="DRV-105"
                  required
                />
              </div>

              <div className="field">
                <label>Driver name</label>
                <input
                  className="input"
                  value={newDriver.name}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="field">
  <label>Email</label>
  <input
    className="input"
    type="email"
    value={newDriver.email}
    onChange={(e) =>
      setNewDriver((prev) => ({ ...prev, email: e.target.value }))
    }
    placeholder="driver@example.com"
    required
  />
</div>

<div className="field">
  <label>Password</label>
  <input
    className="input"
    type="password"
    value={newDriver.password}
    onChange={(e) =>
      setNewDriver((prev) => ({ ...prev, password: e.target.value }))
    }
    placeholder="Temporary password"
    required
  />
</div>

              <div className="field">
                <label>Assigned route</label>
                <input
                  className="input"
                  value={newDriver.assignedRoute}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, assignedRoute: e.target.value }))
                  }
                  placeholder="Route 3"
                  required
                />
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  className="select"
                  value={newDriver.status}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="On Break">On Break</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              <div className="field full-span">
                <label>Phone</label>
                <input
                  className="input"
                  value={newDriver.phone}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+966 5X XXX XXXX"
                  required
                />
              </div>

              <div className="full-span" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" className="primary-btn">
                  Save Driver
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowAddDriverModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && selectedDriver && (
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
              <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>Driver Profile</h3>
              <button
                className="icon-btn"
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedDriver(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="list">
              <div className="list-item">
                <strong>Name:</strong> {selectedDriver.name}
              </div>
              <div className="list-item">
                <strong>Driver ID:</strong> {selectedDriver.driverId}
              </div>
              <div className="list-item">
                <strong>Assigned Route:</strong> {selectedDriver.assignedRoute}
              </div>
              <div className="list-item">
                <strong>Status:</strong> {selectedDriver.status}
              </div>
              <div className="list-item">
                <strong>Phone:</strong> {selectedDriver.phone}
              </div>
              <div className="list-item">
                <strong>Last Update:</strong> {selectedDriver.lastUpdate}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedDriver && (
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
                Edit Driver Information
              </h3>
              <button
                className="icon-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDriver(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <form className="form-grid" onSubmit={handleEditDriver}>
              <div className="field">
                <label>Driver ID</label>
                <input
                  className="input"
                  value={editDriver.driverId}
                  onChange={(e) =>
                    setEditDriver((prev) => ({ ...prev, driverId: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Driver Name</label>
                <input
                className="input"
                value={newDriver.driverId}
                onChange={(e) =>
                  setNewDriver((prev) => ({ ...prev, driverId: e.target.value }))
                }
                placeholder="DRV-105"
                required
              />
              </div>

              <div className="field">
                <label>Assigned Route</label>
                <input
                  className="input"
                  value={editDriver.assignedRoute}
                  onChange={(e) =>
                    setEditDriver((prev) => ({
                      ...prev,
                      assignedRoute: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  className="select"
                  value={editDriver.status}
                  onChange={(e) =>
                    setEditDriver((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="On Break">On Break</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              <div className="field full-span">
                <label>Phone</label>
                <input
                  className="input"
                  value={editDriver.phone}
                  onChange={(e) =>
                    setEditDriver((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>

              <div
                className="full-span"
                style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              >
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleDeleteDriver}
                >
                  Delete Driver
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDriver(null);
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