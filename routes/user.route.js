const express = require("express");
const {
  // registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authUser);
// router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/users", protect, getAllUsers);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// router.route("/vote");

module.exports = router;
