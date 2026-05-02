const API_URL = "http://localhost:5001/api";

function getToken() {
  const storedUser = JSON.parse(localStorage.getItem("kommuteUser"));
  return storedUser?.token;
}

export async function createRequest(requestData) {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to submit a request.");
  }

  const res = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to submit request");
  }

  return data;
}

export async function getMyRequests() {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to view your requests.");
  }

  const res = await fetch(`${API_URL}/requests/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch your requests");
  }

  return data;
}

export async function getRequests() {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in as admin to view all requests.");
  }

  const res = await fetch(`${API_URL}/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch requests");
  }

  return data;
}

export async function updateRequestStatus(id, status) {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in as admin to update requests.");
  }

  const res = await fetch(`${API_URL}/requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to update request");
  }

  return data;
}