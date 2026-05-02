const Driver = require("../models/Driver");
const User = require("../models/User");

async function getDrivers(req, res) {
  try {
    const driverUsers = await User.find({ role: "driver" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    const driverProfiles = await Driver.find()
      .populate("user", "name email role createdAt")
      .sort({ createdAt: -1 });

    const linkedUserIds = new Set(
      driverProfiles
        .filter((profile) => profile.user)
        .map((profile) => profile.user._id.toString())
    );

    const usersWithoutProfiles = driverUsers
      .filter((user) => !linkedUserIds.has(user._id.toString()))
      .map((user) => ({
        _id: user._id,
        user,
        driverId: "No driver ID",
        assignedRoute: "No route assigned",
        status: "Active",
        phone: "No phone",
        hasProfile: false,
        createdAt: user.createdAt,
      }));

    const profiles = driverProfiles.map((profile) => ({
      _id: profile._id,
      user: profile.user,
      driverId: profile.driverId,
      assignedRoute: profile.assignedRoute,
      status: profile.status,
      phone: profile.phone,
      hasProfile: true,
      createdAt: profile.createdAt,
    }));

    res.json([...profiles, ...usersWithoutProfiles]);
  } catch (err) {
    console.error("Get drivers error:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
}

async function createDriver(req, res) {
  const { name, email, password, driverId, assignedRoute, status, phone } =
    req.body;

  if (!name || !email || !password || !driverId || !assignedRoute || !phone) {
    return res.status(400).json({
      error:
        "name, email, password, driverId, assignedRoute, and phone are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "driver",
    });

    const driver = await Driver.create({
      user: user._id,
      driverId,
      assignedRoute,
      status,
      phone,
    });

    const populatedDriver = await Driver.findById(driver._id).populate(
      "user",
      "name email role createdAt"
    );

    res.status(201).json({
      _id: populatedDriver._id,
      user: populatedDriver.user,
      driverId: populatedDriver.driverId,
      assignedRoute: populatedDriver.assignedRoute,
      status: populatedDriver.status,
      phone: populatedDriver.phone,
      hasProfile: true,
      createdAt: populatedDriver.createdAt,
    });
  } catch (err) {
    console.error("Create driver error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Driver ID or email already exists",
      });
    }

    res.status(500).json({ error: "Failed to create driver" });
  }
}

async function updateDriver(req, res) {
  const { name, email, assignedRoute, status, phone } = req.body;

  const validStatuses = ["Active", "On Break", "Delayed"];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" });
    }

    if (assignedRoute !== undefined) driver.assignedRoute = assignedRoute;
    if (status !== undefined) driver.status = status;
    if (phone !== undefined) driver.phone = phone;

    await driver.save();

    if (name || email) {
      await User.findByIdAndUpdate(
        driver.user,
        { name, email },
        { new: true, runValidators: true }
      );
    }

    const populatedDriver = await Driver.findById(driver._id).populate(
      "user",
      "name email role createdAt"
    );

    res.json({
      _id: populatedDriver._id,
      user: populatedDriver.user,
      driverId: populatedDriver.driverId,
      assignedRoute: populatedDriver.assignedRoute,
      status: populatedDriver.status,
      phone: populatedDriver.phone,
      hasProfile: true,
      createdAt: populatedDriver.createdAt,
    });
  } catch (err) {
    console.error("Update driver error:", err);
    res.status(500).json({ error: "Failed to update driver" });
  }
}

async function deleteDriver(req, res) {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" });
    }

    await User.findByIdAndDelete(driver.user);

    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    console.error("Delete driver error:", err);
    res.status(500).json({ error: "Failed to delete driver" });
  }
}

module.exports = {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
};