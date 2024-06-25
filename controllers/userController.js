const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken.js");
const User = require("../models/userModel.js");

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { voterID, NIN } = req.body;

  // Validate the Request Data
  if (!voterID && !NIN) {
    throw new Error("Voting Credentials Required... ");
  }

  // Check the User Info if Present
  const user = await User.findOne({
    $or: [{ voterID: voterID }, { NIN: NIN }],
  });

  if (!user) {
    throw new Error(
      "Invalid voterID or NIN. Please check your input and try again."
    );
  }

  const credentialUsed = voterID ? "voterID" : "NIN";
  res.cookie("jwt", generateToken(user._id), {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged In Successfully",
    credentialUsed,
    user: user,
    token: generateToken(user._id),
  });
});
// @desc Logout user
// route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

// @desc Get user profile
// route POST /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if request body is empty
  if (Object.keys(req.body).length === 0) {
    res.status(400);
    throw new Error("All Fields Are Required ....");
  }

  // Define the fields that can be updated and their corresponding user object fields
  const fieldsToUpdate = {
    fullname: "name",
    dateOfBirth: "dateOfBirth",
    address: "address",
    governmentIdNumber: "governmentIdNumber",
    email: "email",
    phoneNumber: "phoneNumber",
    username: "username",
    password: "password",
  };

  // Iterate over the fields and update user properties dynamically
  Object.keys(fieldsToUpdate).forEach((field) => {
    if (req.body[field]) {
      user[fieldsToUpdate[field]] = req.body[field];
    }
  });

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Profile Updated Successfully...",
    updatedUser,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().exec();
  // const allUsers = await User.countdocuments();
  const totalUsers = await User.countDocuments({});
  console.log(totalUsers);
  res
    .status(200)
    .json({ message: "ALl VOTERS USERS", total: totalUsers, users: users });
});

module.exports = {
  authUser,
  // registerUser,
  getAllUsers,
  getUserProfile,
  logoutUser,
  updateUserProfile,
};
