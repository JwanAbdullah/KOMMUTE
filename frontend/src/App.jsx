import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SubmitReport from "./pages/SubmitReport";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RequestBus from "./pages/faculty&club/RequestBus";
import MyRequests from "./pages/faculty&club/MyRequests";
import ReportDelay from "./pages/driver/ReportDelay";
import DriversDashboard from "./pages/admin/DriversDashboard";
import RequestsDashboard from "./pages/admin/RequestsDashboard";
import ReportsDashboard from "./pages/admin/ReportsDashboard";
import Resources from "./pages/Routes";
import FAQ from "./pages/FAQ";
import BusStops from "./pages/BusStops";
import Register from "./pages/Register";
import UsersManagement from "./pages/admin/UsersManagement";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return null;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("kommuteTheme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("kommuteTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const themeProps = { darkMode, setDarkMode };

  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home {...themeProps} />} />
        <Route path="/about" element={<About {...themeProps} />} />
        <Route path="/contact" element={<Contact {...themeProps} />} />
        <Route path="/submit-report" element={<SubmitReport {...themeProps} />} />
        <Route path="/login" element={<Login {...themeProps} />} />
        <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} /> } />
        <Route path="/faculty&club/request-bus" element={<RequestBus {...themeProps} />} />
        <Route path="/faculty&club/my-requests" element={<MyRequests {...themeProps} />} />
        <Route path="/driver/report-delay" element={<ReportDelay {...themeProps} />} />
        <Route path="/admin/drivers-management" element={<DriversDashboard {...themeProps} />} />
        <Route path="/admin/requests-dashboard" element={<RequestsDashboard {...themeProps} />} />
        <Route path="/admin/reports-dashboard" element={<ReportsDashboard {...themeProps} />} />
        <Route path="/resources" element={<Resources darkMode={darkMode} setDarkMode={setDarkMode} />}/>
        <Route path="/faq" element={<FAQ darkMode={darkMode} setDarkMode={setDarkMode} />}/>
        <Route path="/BusStops" element={<BusStops darkMode={darkMode} setDarkMode={setDarkMode} />}/>
        <Route path="/register" element={<Register darkMode={darkMode} setDarkMode={setDarkMode} /> } />
        <Route path="/admin/users-management" element={
    <UsersManagement darkMode={darkMode} setDarkMode={setDarkMode} /> } />
      </Routes>
    </BrowserRouter>
  );
}