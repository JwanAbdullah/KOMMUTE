const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const driverRoutes = require("./routes/drivers");

const userRoutes = require("./routes/users");
const routeRoutes = require("./routes/routes");
const app = express();
const PORT = process.env.PORT || 5000;
const requestRoutes = require("./routes/requests");
connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api/requests", requestRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend" });
});
app.use("/api/drivers", driverRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/routes", routeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});