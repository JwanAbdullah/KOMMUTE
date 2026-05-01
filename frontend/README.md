## API Documentation

Base URL: `http://localhost:5000/api`

Protected routes require the header: `Authorization: Bearer <token>`

---

### Routes

#### GET /api/routes
Public. Returns all bus routes with stops.

Response `200`:
```json
[
  {
    "id": "route-1",
    "name": "Route One",
    "color": "orange",
    "timing": "6:30 AM - 5:30 PM",
    "frequency": "Every 10 mins",
    "stops": [
      { "name": "Parking 900", "served": "900, 1000, Square" }
    ]
  }
]
```

#### GET /api/routes/:id
Public. Returns a single route by its `id` field (e.g. `route-2`).

Response `404`:
```json
{ "error": "Route not found" }
```

---

### Bus Requests

#### POST /api/requests
Auth required. Role: `faculty` or `club`.

Request body:
```json
{
  "requester": "Engineering Club",
  "type": "Event",
  "date": "2026-05-10",
  "departureTime": "09:00",
  "returnTime": "14:00",
  "pickupLocation": "Parking 900",
  "destination": "Conference Hall",
  "passengers": 40,
  "notes": "Need large bus"
}
```

Response `201`: created request object.
Response `400`: `{ "error": "All fields are required except notes" }`

#### GET /api/requests
Auth required. Role: `admin`. Returns all requests.

#### GET /api/requests/mine
Auth required. Returns requests submitted by the logged-in user.

#### PATCH /api/requests/:id/status
Auth required. Role: `admin`.

Request body:
```json
{ "status": "Approved" }
```

Response `200`: updated request object.
Response `404`: `{ "error": "Request not found" }`

---

### Drivers

#### GET /api/drivers
Auth required. Role: `admin`. Returns all drivers.

#### POST /api/drivers
Auth required. Role: `admin`.

Request body:
```json
{
  "driverId": "DRV-105",
  "name": "Salem Alqahtani",
  "assignedRoute": "Route 3",
  "status": "Active",
  "phone": "+966 5X XXX XXXX"
}
```

Response `201`: created driver object.
Response `400`: `{ "error": "driverId, name, assignedRoute, and phone are required" }`

#### PATCH /api/drivers/:id
Auth required. Role: `admin`. Updates driver fields. Uses MongoDB `_id`.

#### DELETE /api/drivers/:id
Auth required. Role: `admin`.

Response `200`: `{ "message": "Driver deleted successfully" }`
Response `404`: `{ "error": "Driver not found" }`

---

### Delays

#### POST /api/delays
Auth required. Role: `driver`.

Request body:
```json
{
  "route": "Route 2",
  "stop": "Station 312",
  "delayMinutes": 10,
  "reason": "Traffic congestion",
  "additionalNotes": "Expected to clear in 15 mins"
}
```

Response `201`: created delay object.
Response `400`: `{ "error": "delayMinutes must be a positive number" }`

#### GET /api/delays
Auth required. Role: `admin`. Returns all submitted delays sorted by newest first.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
