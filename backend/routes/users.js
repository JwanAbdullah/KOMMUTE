const express = require("express");

const {
  getUsers,
  getMe,
  updateMe,
  updateMyPassword,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

const router = express.Router();

router.get("/me", auth, getMe);
router.patch("/me", auth, updateMe);
router.patch("/me/password", auth, updateMyPassword);

router.get("/", auth, roleGuard("admin"), getUsers);
router.patch("/:id", auth, roleGuard("admin"), updateUser);
router.delete("/:id", auth, roleGuard("admin"), deleteUser);

module.exports = router;