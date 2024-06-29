const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    NIN: {
      type: Number,
      required: true,
      unique: true,
    },
    voterID: {
      type: Number,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    address: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    employmentStatus: {
      type: String,
      enum: ["Employed", "Unemployed", "Student", "Retired"],
    },
    employerDetails: {
      type: String,
    },
    taxCode: {
      type: String,
    },
    nationality: {
      type: String,
    },
    dateOfIssueOfNIN: {
      type: Date,
    },
    placeOfBirth: {
      type: String,
    },
    previousAddresses: {
      type: [String],
    },
    benefitsReceived: {
      type: [String],
    },
    contributionRecord: {
      type: String,
    },
    immigrationStatus: {
      type: String,
      enum: ["Citizen", "Resident", "Non-Resident"],
    },
    healthInfo: {
      type: String,
    },
    dependentsInfo: {
      type: String,
    },
    educationAndQualifications: {
      type: String,
    },
    criminalRecord: {
      type: String,
    },
    disabilityStatus: {
      type: String,
      enum: ["Yes", "No"],
    },
    votedParties: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Party",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
