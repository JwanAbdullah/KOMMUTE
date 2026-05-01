const express = require("express");
const {
  createReport,
  getReports,
  updateReportStatus,
} = require("../controllers/reportController");

const auth = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

const router = express.Router();

router.post("/", auth, createReport);
router.get("/", auth, roleGuard("admin"), getReports);
router.patch("/:id/status", auth, roleGuard("admin"), updateReportStatus);

module.exports = router;