const asyncHandler = require("express-async-handler");
// const generateToken = require("../utils/generateToken.js");
const Party = require("../models/partyModel.js");
const User = require("../models/userModel.js");

const fs = require('fs');
const path = require('path');

// @desc Party // Endpoint to retrieve political parties
// route POST /api/party/parties
// @access Public

const getParties = asyncHandler(async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../controlpanel/parties.json'); // Adjust the path as needed
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        const parties = JSON.parse(data);
        res.json(parties);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const voteParty = asyncHandler(async (req, res) => {
  const { username, partyId } = req.body;

  try {
    const user = await User.findOne({ username });
    const party = await Party.findById(partyId);

    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user exists, check if they have already voted for the party
    if (user.votedParties.includes(partyId)) {
      return res
        .status(400)
        .json({ message: "You have already voted for this party" });
    }

    // Add the party to the user's votedParties array
    user.votedParties.push(partyId);
    await user.save();

    // Increment the vote count for the party
    party.votes += 1;
    await party.save();

    // Retrieve the updated party details
    const updatedParty = await Party.findById(partyId);

    res.json({ message: "Vote cast successfully", party: updatedParty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const userVote = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate("votedParties");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      votedParties: user.votedParties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const voteCounts = asyncHandler(async (req, res) => {
  try {
    const parties = await Party.find();
    const voteCounts = parties.map((party) => ({
      name: party.name,
      votes: party.votes,
    }));
    res.json(voteCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const partyVotes = asyncHandler(async (req, res) => {
  
});
module.exports = { getParties, voteParty, userVote, voteCounts, partyVotes };
