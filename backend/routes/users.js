const express = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

const router = express.Router();

router.get("/", auth, roleGuard("admin"), getUsers);
router.patch("/:id", auth, roleGuard("admin"), updateUser);
router.delete("/:id", auth, roleGuard("admin"), deleteUser);

module.exports = router;