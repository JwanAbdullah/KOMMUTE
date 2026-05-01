const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    stop: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
    },
    reportType: {
      type: String,
      required: true,
    },
    submittedBy: {
      type: String,
      enum: ["user", "faculty", "driver", "admin"],
      required: true,
    },
    submittedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);