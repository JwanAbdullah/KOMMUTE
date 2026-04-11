# Kommute

Kommute is a campus transportation web application designed to improve how students, faculty, club representatives, drivers, and administrators interact with university bus services.

This project focuses on building a clean, modern, and user-friendly front end for campus transportation management, including route viewing, live map tracking, schedules, reporting, and role-based system flows.

---

## Features

### Public User

* View campus transportation information
* Browse bus schedules
* Use a live interactive map
* Select current location and destination
* View route highlighting
* See bus stop markers
* See live bus markers
* Submit service reports
* Contact support
* Manage profile and security UI

---

### Role-Based Features

#### Faculty & Club

* Request buses for events or exams
* View submitted requests

#### Driver

* Report delays at specific stops
* Specify delay duration and reason

#### Admin

* View and manage transportation requests
* View and manage service reports
* Manage drivers (add, edit, delete, assign routes)

---

## Tech Stack

* React
* Vite
* React Router
* Leaflet
* React Leaflet
* CSS

---

## Project Structure

```bash
src/
  App.jsx
  App.css
  pages/
    Home.jsx
    About.jsx
    Contact.jsx
    SubmitReport.jsx
    ReportConfirmation.jsx
    Login.jsx
    Profile.jsx
    admin/
      DriversDashboard.jsx
      RequestsDashboard.jsx
      ReportsDashboard.jsx
    driver/
      ReportDelay.jsx
    faculty&club/
      RequestBus.jsx
      MyRequests.jsx
  components/
    layout/
      Header.jsx
      Footer.jsx
  services/
    mockData.js
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kommute.git
cd kommute/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## Usage

### Navigation

* Use the navigation bar to access pages
* Pages change dynamically based on user role

### Login (Frontend Simulation)

* Select a role:

  * Regular User
  * Faculty
  * Driver
  * Admin
* After login:

  * Navigation updates based on role
  * Uses localStorage (no backend authentication)

---

### Map Interaction

* Select current location and destination
* View route suggestions
* See map markers and routes

---

### Reports & Requests

* Users can submit service reports
* Drivers can report delays
* Admin can:

  * Approve / reject requests
  * Update report statuses
  * Manage drivers

---

## Notes

* Frontend-only project using mock data
* No backend or database integration
* Data handled using:

  * React state
  * localStorage

---

## Future Improvements

* Backend integration
* Real-time GPS tracking
* Authentication system
* Notifications system
* Improved mobile responsiveness

---

## Authors

* Jwan Alghamdi
* Lamar Alshehri
