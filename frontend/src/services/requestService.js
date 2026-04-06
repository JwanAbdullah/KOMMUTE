import API_BASE from './api'

export async function createRequest(data) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Failed to create request')
  return res.json()
}

export async function getRequests() {
  const res = await fetch(`${API_BASE}/requests`)
  return res.json()
}