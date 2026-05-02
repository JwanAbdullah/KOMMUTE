# Kommute 🚌

Kommute is a full-stack campus transportation web application that streamlines how students, faculty, club representatives, drivers, and administrators interact with university bus services.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Routes](#routes)
  - [Bus Requests](#bus-requests)
  - [Drivers](#drivers)
  - [Delays](#delays)
  - [Reports](#reports)
- [Authors](#authors)

---

## Features

### Public Users
- View bus routes, schedules, and stops
- Interactive live map with route highlighting and bus markers
- Select current location and destination
- Submit service reports and contact support
- Manage profile and change password

### Role-Based Access

| Role | Capabilities |
|---|---|
| **User** | View routes, submit reports, manage own profile |
| **Faculty / Club** | All user capabilities + request buses for events or exams, view own requests |
| **Driver** | Report delays with route, stop, duration, and reason |
| **Admin** | Manage all requests, reports, drivers, and users |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool and dev server |
| React Router v7 | Client-side routing |
| Leaflet + React Leaflet | Interactive maps |
| CSS | Styling |

### Backend
| Tool | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express 5 | REST API framework |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| nodemon | Development auto-reload |

---

## Project Structure

```
KOMMUTE/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SubmitReport.jsx
│   │   │   ├── ReportConfirmation.jsx
│   │   │   ├── admin/
│   │   │   │   ├── DriversDashboard.jsx
│   │   │   │   ├── RequestsDashboard.jsx
│   │   │   │   └── ReportsDashboard.jsx
│   │   │   ├── driver/
│   │   │   │   └── ReportDelay.jsx
│   │   │   └── faculty&club/
│   │   │       ├── RequestBus.jsx
│   │   │       └── MyRequests.jsx
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Header.jsx
│   │   │       └── Footer.jsx
│   │   └── services/
│   │       └── mockData.js
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── server.js              # Entry point
    ├── seed.js                # Database seeder
    ├── .env.example           # Environment variable template
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── models/
    │   ├── User.js
    │   ├── Driver.js
    │   ├── Route.js
    │   ├── BusRequest.js
    │   ├── Delay.js
    │   └── Report.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── driverController.js
    │   ├── routeController.js
    │   ├── requestController.js
    │   ├── delayController.js
    │   └── reportController.js
    ├── routes/
    │   ├── auth.js
    │   ├── users.js
    │   ├── drivers.js
    │   ├── routes.js
    │   ├── requests.js
    │   ├── delays.js
    │   └── reports.js
    ├── middleware/
    │   ├── auth.js            # JWT verification
    │   └── roleGuard.js       # Role-based access control
    └── package.json
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory. Use `.env.example` as a template:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

| Variable | Description |
|---|---|
| `PORT` | Port the backend server runs on (default: `5000`) |
| `MONGO_URI` | MongoDB connection string (local or MongoDB Atlas) |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and fill in your `MONGO_URI` and `JWT_SECRET`.

4. (Optional) Seed the database with sample data:
   ```bash
   node seed.js
   ```

5. Start the server:
   ```bash
   # Development (with auto-reload via nodemon)
   npm run dev

   # Production
   npm start
   ```

The backend will be running at: `http://localhost:5000`

You can verify it's working by visiting `http://localhost:5000/` — you should see:
```
Backend is running
```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open in your browser:
   ```
   http://localhost:5173
   ```

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

Protected routes require the following header:
```
Authorization: Bearer <your_token>
```

Tokens are obtained from the `/api/auth/login` or `/api/auth/register` endpoints.

---

### Authentication

#### `POST /api/auth/register`
Register a new user account.

**Request body:**
```json
{
  "name": "Jwan Alghamdi",
  "email": "jwan@example.com",
  "password": "password123",
  "role": "faculty"
}
```
> Valid roles: `user`, `faculty`, `driver`, `admin`

**Response `201`:**
```json
{
  "message": "User created",
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "name": "Jwan Alghamdi",
    "email": "jwan@example.com",
    "role": "faculty"
  }
}
```

**Errors:**
- `400` — User already exists
- `500` — Server error

---

#### `POST /api/auth/login`
Log in with an existing account.

**Request body:**
```json
{
  "email": "jwan@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "name": "Jwan Alghamdi",
    "email": "jwan@example.com",
    "role": "faculty"
  }
}
```

**Errors:**
- `401` — Invalid email or password

---

### Users

#### `GET /api/users/me`
🔒 Auth required. Get the currently logged-in user's profile.

**Response `200`:**
```json
{
  "_id": "...",
  "name": "Jwan Alghamdi",
  "email": "jwan@example.com",
  "role": "faculty",
  "createdAt": "2026-04-27T09:51:00.000Z"
}
```

---

#### `PATCH /api/users/me`
🔒 Auth required. Update the logged-in user's profile.

**Request body (any updatable fields):**
```json
{
  "name": "Jwan A.",
  "email": "jwan.new@example.com"
}
```

**Response `200`:** Updated user object (without password).

---

#### `PATCH /api/users/me/password`
🔒 Auth required. Change the logged-in user's password.

**Request body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response `200`:**
```json
{ "message": "Password updated successfully" }
```

**Errors:**
- `400` — Current password is incorrect or missing fields

---

#### `GET /api/users`
🔒 Auth required. 🛡️ Role: `admin`. Get all users.

**Response `200`:** Array of user objects (passwords excluded).

---

#### `PATCH /api/users/:id`
🔒 Auth required. 🛡️ Role: `admin`. Update any user's info or role.

**Request body:**
```json
{
  "name": "Salem",
  "email": "salem@example.com",
  "role": "driver",
  "driverId": "DRV-110",
  "assignedRoute": "Route 2",
  "phone": "+966 5X XXX XXXX",
  "status": "Active"
}
```
> When changing role to `driver`, `driverId`, `assignedRoute`, and `phone` are required.

---

#### `DELETE /api/users/:id`
🔒 Auth required. 🛡️ Role: `admin`. Delete a user (and their driver profile if applicable).

**Response `200`:**
```json
{ "message": "User deleted successfully" }
```

---

### Routes

#### `GET /api/routes`
Public. Get all bus routes with their stops and schedule.

**Response `200`:**
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

---

#### `GET /api/routes/:id`
Public. Get a single route by its `id` field (e.g. `route-2`).

**Response `404`:**
```json
{ "error": "Route not found" }
```

---

### Bus Requests

#### `POST /api/requests`
🔒 Auth required. 🛡️ Role: `faculty`. Submit a new bus request.

**Request body:**
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
  "notes": "Need a large bus"
}
```
> Valid types: `Event`, `Exam`, `Club Activity`. `notes` is optional.

**Response `201`:** Created request object with status `Pending`.

**Errors:**
- `400` — Missing required fields, invalid type, or passengers < 1

---

#### `GET /api/requests`
🔒 Auth required. 🛡️ Role: `admin`. Get all bus requests.

**Response `200`:** Array of request objects with populated `submittedBy` (name, email, role), sorted newest first.

---

#### `GET /api/requests/mine`
🔒 Auth required. 🛡️ Role: `faculty`. Get the logged-in user's own requests.

**Response `200`:** Array of request objects, sorted newest first.

---

#### `PATCH /api/requests/:id/status`
🔒 Auth required. 🛡️ Role: `admin`. Approve or reject a request.

**Request body:**
```json
{ "status": "Approved" }
```
> Valid statuses: `Pending`, `Approved`, `Rejected`

**Response `200`:** Updated request object.

**Errors:**
- `400` — Invalid status value
- `404` — Request not found

---

### Drivers

#### `GET /api/drivers`
🔒 Auth required. 🛡️ Role: `admin`. Get all drivers (includes users with the driver role who have no profile yet).

**Response `200`:**
```json
[
  {
    "_id": "...",
    "user": { "name": "Salem Alqahtani", "email": "salem@example.com", "role": "driver" },
    "driverId": "DRV-105",
    "assignedRoute": "Route 3",
    "status": "Active",
    "phone": "+966 5X XXX XXXX",
    "hasProfile": true
  }
]
```

---

#### `POST /api/drivers`
🔒 Auth required. 🛡️ Role: `admin`. Add a new driver (creates both a User and Driver record).

**Request body:**
```json
{
  "name": "Salem Alqahtani",
  "email": "salem@example.com",
  "password": "driverpass123",
  "driverId": "DRV-105",
  "assignedRoute": "Route 3",
  "status": "Active",
  "phone": "+966 5X XXX XXXX"
}
```

**Response `201`:** Created driver object.

**Errors:**
- `400` — Missing required fields or duplicate email/driverId

---

#### `PATCH /api/drivers/:id`
🔒 Auth required. 🛡️ Role: `admin`. Update a driver's profile (uses driver `_id`).

**Request body (any updatable fields):**
```json
{
  "assignedRoute": "Route 1",
  "status": "On Break",
  "phone": "+966 5X XXX XXXX",
  "name": "Salem A.",
  "email": "salem.new@example.com"
}
```
> Valid statuses: `Active`, `On Break`, `Delayed`

**Response `200`:** Updated driver object.

---

#### `DELETE /api/drivers/:id`
🔒 Auth required. 🛡️ Role: `admin`. Delete a driver and their associated user account.

**Response `200`:**
```json
{ "message": "Driver deleted successfully" }
```

**Errors:**
- `404` — Driver profile not found

---

### Delays

#### `POST /api/delays`
🔒 Auth required. 🛡️ Role: `driver`. Report a delay at a specific stop.

**Request body:**
```json
{
  "route": "Route 2",
  "stop": "Station 312",
  "delayMinutes": 10,
  "reason": "Traffic congestion",
  "additionalNotes": "Expected to clear in 15 mins"
}
```
> `additionalNotes` is optional. `delayMinutes` must be a positive number.

**Response `201`:** Created delay object.

**Errors:**
- `400` — Missing required fields or invalid `delayMinutes`

---

#### `GET /api/delays`
🔒 Auth required. 🛡️ Role: `admin`. Get all delay reports, sorted newest first.

**Response `200`:**
```json
[
  {
    "_id": "...",
    "route": "Route 2",
    "stop": "Station 312",
    "delayMinutes": 10,
    "reason": "Traffic congestion",
    "additionalNotes": "Expected to clear in 15 mins",
    "submittedBy": "...",
    "createdAt": "2026-05-02T17:00:00.000Z"
  }
]
```

---

### Reports

#### `POST /api/reports`
🔒 Auth required. Any authenticated user can submit a service report.

**Request body:**
```json
{
  "title": "Bus was late",
  "category": "Delay",
  "route": "Route 1",
  "stop": "Parking 900",
  "description": "The bus was 20 minutes late with no announcement.",
  "reportType": "Complaint"
}
```

**Response `201`:** Created report object with status `Open`.

---

#### `GET /api/reports`
🔒 Auth required. 🛡️ Role: `admin`. Get all service reports with submitter info.

**Response `200`:** Array of report objects with populated submitter details, sorted newest first.

---

#### `PATCH /api/reports/:id/status`
🔒 Auth required. 🛡️ Role: `admin`. Update the status of a report.

**Request body:**
```json
{ "status": "In Progress" }
```
> Valid statuses: `Open`, `In Progress`, `Resolved`

**Response `200`:** Updated report object.

**Errors:**
- `400` — Invalid report ID format
- `404` — Report not found

---

## Authors

- Jwan Alghamdi
- Lamar Alshehri
