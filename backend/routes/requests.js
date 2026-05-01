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

router.post("/", auth, roleGuard("faculty"), createRequest);
router.get("/", auth, roleGuard("faculty"), getRequests);
router.get("/", auth, roleGuard("admin"), getRequests);
router.get("/mine", auth, getMyRequests);
router.patch("/:id/status", auth, roleGuard("admin"), updateRequestStatus);

module.exports = router;