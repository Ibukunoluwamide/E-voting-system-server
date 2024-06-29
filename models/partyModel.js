const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  partyPicture: { type: String },
  icon: { type: String },
  candidate: { type: String },
  votes: { type: String },
});

const Party = mongoose.model("Party", partySchema);
module.exports = Party;
