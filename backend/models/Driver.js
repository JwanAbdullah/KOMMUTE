const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    driverId: {
      type: String,
      required: true,
      unique: true,
    },
    assignedRoute: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "On Break", "Delayed"],
      default: "Active",
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);