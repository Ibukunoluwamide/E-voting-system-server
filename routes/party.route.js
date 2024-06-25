const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getParties,
  voteParty,
  userVote,
  voteCounts,
} = require("../controllers/partyController");

const router = express.Router();

router.get("/parties", getParties);

// Endpoint to cast votes
router.post("/vote",  voteParty);
// Endpoint to retrieve the parties a user has voted for
router.get("/userVotes/:username",  userVote);
// Endpoint to retrieve vote counts
router.get("/voteCounts", voteCounts);
// router.route("/").get(protect, getUserProfile);

module.exports = router;
