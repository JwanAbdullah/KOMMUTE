import API_BASE from './api'

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createRequest(data) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to submit request')
  }
  return res.json()
}

export async function getRequests() {
  const res = await fetch(`${API_BASE}/requests`, {
    headers: getAuthHeader(),
  })
  if (!res.ok) throw new Error('Failed to fetch requests')
  return res.json()
}

export async function getMyRequests() {
  const res = await fetch(`${API_BASE}/requests/mine`, {
    headers: getAuthHeader(),
  })
  if (!res.ok) throw new Error('Failed to fetch your requests')
  return res.json()
}

export async function updateRequestStatus(id, status) {
  const res = await fetch(`${API_BASE}/requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update request status')
  return res.json()
}