import React, { useEffect } from "react";
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
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/submit-report" element={<SubmitReport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/faculty&club/request-bus" element={<RequestBus />} />
        <Route path="/faculty&club/my-requests" element={<MyRequests />} />
      </Routes>
    </BrowserRouter>
  );
}