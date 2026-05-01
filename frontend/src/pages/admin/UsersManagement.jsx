import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

export default function UsersManagement({ darkMode, setDarkMode }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("kommuteUser"));

  useEffect(() => {
    async function fetchUsers() {
      if (!storedUser?.token) {
        setError("You must be logged in as admin.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch users.");
          return;
        }

        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        setError("Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.role || "").toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "All" ? true : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const openProfileModal = (user) => {
    setShowEditModal(false);
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const openEditModal = (user) => {
    setShowProfileModal(false);
    setSelectedUser(user);
    setEditUser({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(editUser),
      });

      const updatedUser = await res.json();

      if (!res.ok) {
        alert(updatedUser.message || "Failed to update user.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) => (user._id === selectedUser._id ? updatedUser : user))
      );

      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      alert("Could not connect to backend.");
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      `Delete ${selectedUser.name}? This cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete user.");
        return;
      }

      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      alert("Could not connect to backend.");
    }
  };

  const getRoleLabel = (role) => {
    if (role === "user") return "Regular User";
    if (role === "faculty") return "Faculty & Club";
    if (role === "driver") return "Driver";
    if (role === "admin") return "Admin";
    return role;
  };

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
              <h1>Users Management</h1>
              <p>View users, manage roles, and remove accounts.</p>
            </div>

            <div className="card form-card" style={{ marginBottom: 20 }}>
              <div className="form-grid">
                <div className="field">
                  <label>Search users</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Search by name, email, or role"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Role filter</label>
                  <select
                    className="select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="user">Regular User</option>
                    <option value="faculty">Faculty & Club</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {loading && <div className="info-box">Loading users...</div>}
            {error && <div className="warning-box">{error}</div>}

            {!loading && !error && (
              <>
                <div className="grid-3">
                  {filteredUsers.map((user) => (
                    <div className="card route-card" key={user._id}>
                      <h3>{user.name}</h3>

                      <div className="route-meta">
                        {user.email} • {getRoleLabel(user.role)}
                      </div>

                      <div className="list">
                        <div className="list-item">
                          <strong>Role:</strong> {getRoleLabel(user.role)}
                        </div>

                        <div className="list-item">
                          <strong>User ID:</strong> {user._id}
                        </div>

                        <div className="list-item">
                          <strong>Created:</strong>{" "}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
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
                          onClick={() => openProfileModal(user)}
                        >
                          View Profile
                        </button>

                        <button
                          className="secondary-btn"
                          onClick={() => openEditModal(user)}
                        >
                          Edit Information
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="info-box" style={{ marginTop: 18 }}>
                    No users match the current filters.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {showProfileModal && selectedUser && (
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
                User Profile
              </h3>

              <button
                className="icon-btn"
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedUser(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="list">
              <div className="list-item">
                <strong>Name:</strong> {selectedUser.name}
              </div>

              <div className="list-item">
                <strong>Email:</strong> {selectedUser.email}
              </div>

              <div className="list-item">
                <strong>Role:</strong> {getRoleLabel(selectedUser.role)}
              </div>

              <div className="list-item">
                <strong>User ID:</strong> {selectedUser._id}
              </div>

              <div className="list-item">
                <strong>Created:</strong>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
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
                Edit User Information
              </h3>

              <button
                className="icon-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                type="button"
              >
                ✕
              </button>
            </div>

            <form className="form-grid" onSubmit={handleEditUser}>
              <div className="field">
                <label>Name</label>
                <input
                  className="input"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="field full-span">
                <label>Role</label>
                <select
                  className="select"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                >
                  <option value="user">Regular User</option>
                  <option value="faculty">Faculty & Club</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
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
                  onClick={handleDeleteUser}
                >
                  Delete User
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
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