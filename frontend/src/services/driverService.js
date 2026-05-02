const API_URL = "http://localhost:5001/api";

function getToken() {
  const storedUser = JSON.parse(localStorage.getItem("kommuteUser"));
  return storedUser?.token;
}

export async function getDrivers() {
  const token = getToken();

  const res = await fetch(`${API_URL}/drivers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch drivers");
  }

  return data;
}

export async function createDriver(driverData) {
  const token = getToken();

  const res = await fetch(`${API_URL}/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(driverData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to create driver");
  }

  return data;
}

export async function updateDriver(id, driverData) {
  const token = getToken();

  const res = await fetch(`${API_URL}/drivers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(driverData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to update driver");
  }

  return data;
}

export async function deleteDriver(id) {
  const token = getToken();

  const res = await fetch(`${API_URL}/drivers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to delete driver");
  }

  return data;
}