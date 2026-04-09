import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import Navbar from "../components/layout/Navbar";

const stops = {
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
};

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [60, 60] });
    }
  }, [positions, map]);
  return null;
}

export default function Map() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!origin || !destination || origin === destination) {
      setRouteCoords([]);
      setError("");
      return;
    }

    const [oLat, oLng] = stops[origin];
    const [dLat, dLng] = stops[destination];

    setLoading(true);
    setError("");

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRouteCoords(coords);
        } else {
          setError("No route found.");
        }
      })
      .catch(() => setError("Failed to fetch route."))
      .finally(() => setLoading(false));
  }, [origin, destination]);

  const markers = [
    origin && { name: origin, pos: stops[origin] },
    destination && { name: destination, pos: stops[destination] },
  ].filter(Boolean);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "16px" }}>Live Campus Map</h2>

        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label>Current Location</label>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="select">
              <option value="">Select location</option>
              {Object.keys(stops).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label>Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="select">
              <option value="">Select destination</option>
              {Object.keys(stops).filter((s) => s !== origin).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {loading && <p style={{ alignSelf: "flex-end" }}>Fetching route...</p>}
          {error && <p style={{ alignSelf: "flex-end", color: "red" }}>{error}</p>}
        </div>

        <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <MapContainer
            center={[26.308, 50.147]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            {markers.map(({ name, pos }) => (
              <Marker key={name} position={pos}>
                <Popup>{name}</Popup>
              </Marker>
            ))}

            {routeCoords.length > 0 && (
              <>
                <Polyline positions={routeCoords} color="blue" weight={4} />
                <FitBounds positions={routeCoords} />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}