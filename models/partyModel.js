const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  partyPicture: { type: String },
  icon: { type: String },
  candidate: { type: String },
  votes: { type: Number, default: 0 },
});

const Party = mongoose.model("Party", partySchema);
module.exports = Party;
