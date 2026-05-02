# Kommute 🚌

Kommute is a campus transportation web application that streamlines how students, faculty, club representatives, drivers, and administrators interact with university bus services.

---

## Features

### Public Users
- View bus routes, schedules, and stops
- Interactive live map with route highlighting and bus markers
- Select current location and destination
- Submit service reports and contact support
- Manage profile settings

### Role-Based Access

| Role | Capabilities |
|---|---|
| **Faculty / Club** | Request buses for events or exams, view submitted requests |
| **Driver** | Report delays with stop, duration, and reason |
| **Admin** | Manage requests, reports, and drivers (add, edit, delete, assign routes) |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Leaflet + React Leaflet | Interactive maps |
| CSS | Styling |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment config |

---

## Project Structure

```
KOMMUTE/
├── frontend/
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
└── backend/
    ├── server.js
    ├── config/
    ├── models/
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── seed.js
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB instance (local or Atlas)

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

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

The backend will run at `http://localhost:5000`.

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

4. Open in browser:
   ```
   http://localhost:5173
   ```

---

## API Reference

Base URL: `http://localhost:5000/api`

Protected routes require: `Authorization: Bearer <token>`

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/...` | No | Login / Register |

### Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/routes` | No | Get all bus routes with stops |
| GET | `/api/routes/:id` | No | Get a single route by ID |

### Bus Requests
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/requests` | Yes | faculty, club | Submit a bus request |
| GET | `/api/requests` | Yes | admin | View all requests |
| GET | `/api/requests/mine` | Yes | Any | View own requests |
| PATCH | `/api/requests/:id/status` | Yes | admin | Approve or reject a request |

### Drivers
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/drivers` | Yes | admin | List all drivers |
| POST | `/api/drivers` | Yes | admin | Add a new driver |
| PATCH | `/api/drivers/:id` | Yes | admin | Update driver info |
| DELETE | `/api/drivers/:id` | Yes | admin | Remove a driver |

### Delays
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/delays` | Yes | driver | Report a delay |
| GET | `/api/delays` | Yes | admin | View all delays |

### Reports
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/reports` | No | Submit a service report |
| GET | `/api/reports` | Yes (admin) | View all reports |

---

## Usage

### Login & Role Selection
Select a role at the login screen:
- **Regular User** — public transportation info and map
- **Faculty / Club** — bus request management
- **Driver** — delay reporting
- **Admin** — full dashboard access

Navigation updates dynamically based on the selected role.

### Map
- Select a current location and destination
- View suggested routes highlighted on the map
- See bus stop and live bus markers

---

## Authors

- Jwan Alghamdi
- Lamar Alshehri

---

## Future Improvements

- Real-time GPS tracking
- Push notifications for delays and approvals
- Improved mobile responsiveness
- Enhanced authentication and authorization flows
