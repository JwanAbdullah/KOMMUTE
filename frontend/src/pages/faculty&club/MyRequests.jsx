import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const mockRequests = [
  {
    id: "REQ-1024",
    type: "Event",
    date: "2026-04-20",
    route: "KFUPM Main Gate → Conference Hall",
    status: "Approved",
  },
  {
    id: "REQ-1025",
    type: "Exam",
    date: "2026-04-22",
    route: "Dorms → Exam Building",
    status: "Pending",
  },
  {
    id: "REQ-1026",
    type: "Club Activity",
    date: "2026-04-25",
    route: "Campus Center → External Venue",
    status: "Rejected",
  },
];

export default function MyRequests({ darkMode, setDarkMode }) {


  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
            
              <h1>My Requests</h1>
              <p>
                View the status of your submitted transportation requests.
              </p>
            </div>

            <div className="grid-3">
              {mockRequests.map((request) => (
                <div className="card route-card" key={request.id}>
                  <h3>{request.id}</h3>
                  <div className="route-meta">
                    {request.type} • {request.date}
                  </div>

                  <div className="stops-list">
                    <div className="stop-row">
                      <div className="stop-pin" />
                      <div>
                        <div className="stop-name">{request.route}</div>
                        <div className="stop-served">Status: {request.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}