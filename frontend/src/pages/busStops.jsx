import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const busStops = {
  "Parking 900": [26.302444966152986, 50.14819680562582],
  "Parking 404": [26.301801857328226, 50.15343689744041],
  "27": [26.30577658598772, 50.14997505511192],
  "Station 312": [26.30888286081298, 50.14323318208968],
  "Building 22": [26.30578534978167, 50.14657250801729],
  "Station 319": [26.313217445633892, 50.14996101895771],
  "Building 58": [26.31536295087514, 50.14876797575579],
  "Station 309": [26.31388614973035, 50.14994185229807],
  "Station 310": [26.313487765868626, 50.14465303758838],
  "Station 314": [26.304920814005092, 50.14971838241092],
  "Square": [26.30019813717853, 50.14828060674545],
  "Restaurant": [26.31388614973035, 50.14994185229807],
  "Station 316": [26.309240854466566, 50.13932350061927],
  "Parking B.424": [26.301612570398497, 50.15342393311285],
  "Dhahran Techno Valley": [26.303224477920928, 50.15941649059973],
};

export default function BusStops({ darkMode, setDarkMode }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Getting your location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLocationStatus("Your current location is shown on the map.");
      },
      () => {
        setLocationStatus("Location permission was denied or unavailable.");
      }
    );
  }, []);

  return (
    <div className={darkMode ? "app-shell dark" : "app-shell"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <section className="section">
          <div className="container">
            <div className="page-header">
              <div className="back-btn-wrap">
                <Link to="/" className="secondary-btn">← Back Home</Link>
              </div>

              <h1>Bus Stops Map</h1>
              <p>All campus bus stops pinned in one place.</p>
              <p className="map-current-time">{locationStatus}</p>
            </div>

            <div className="full-bus-stops-map">
              <MapContainer
                center={userLocation || [26.308, 50.147]}
                zoom={14}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                dragging={false}
                touchZoom={false}
                boxZoom={false}
                keyboard={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />

                {Object.entries(busStops).map(([name, position]) => (
                  <Marker position={userLocation}>
                    <Popup>
                      <strong>📍 You are here</strong>
                    </Popup>
                  </Marker>
                ))}

                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>
                      <strong>You are here</strong>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}