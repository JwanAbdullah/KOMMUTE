const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  getMyRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const auth = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

// Faculty creates a request
router.post("/", auth, roleGuard("faculty"), createRequest);

// Faculty sees only their own requests
router.get("/mine", auth, roleGuard("faculty"), getMyRequests);

// Admin sees all requests
router.get("/", auth, roleGuard("admin"), getRequests);

// Admin updates request status
router.patch("/:id/status", auth, roleGuard("admin"), updateRequestStatus);

module.exports = router;