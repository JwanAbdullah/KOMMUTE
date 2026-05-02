const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Driver = require("../models/Driver");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      driverId,
      assignedRoute,
      status,
      phone,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "driver") {
      if (!driverId || !assignedRoute || !phone) {
        return res.status(400).json({
          message: "Driver ID, assigned route, and phone are required when changing role to driver.",
        });
      }

      await Driver.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          driverId,
          assignedRoute,
          status: status || "Active",
          phone,
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    if (role !== "driver") {
      await Driver.findOneAndDelete({ user: user._id });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email or Driver ID already exists",
      });
    }

    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Driver.findOneAndDelete({ user: user._id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};