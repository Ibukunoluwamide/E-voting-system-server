const express = require("express");
const {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

router.route("/profile").get(protect, getUserProfile);
//   .put(protect, updateUserProfile);

module.exports = router;
