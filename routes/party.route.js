const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getParties,
  voteParty,
  userVote,
  voteCounts,
} = require("../controllers/partyController");

const router = express.Router();

router.route("/parties").get(protect, getParties);

// Endpoint to cast votes
router.post("/vote", protect, voteParty);
// Endpoint to retrieve the parties a user has voted for
router.get("/userVotes/:username", protect, userVote);
// Endpoint to retrieve vote counts
router.get("/voteCounts", protect, voteCounts);
// router.route("/").get(protect, getUserProfile);

module.exports = router;
