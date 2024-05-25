const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.js");
const User = require("../models/userModel.js");

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  console.log(req.body);

  const user = await User.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      message: "Logged In SuccessFully",
      user,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email & phone number or password");
  }
});

// @desc Register new user
// route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    fullname,
    dateOfBirth,
    address,
    governmentIdNumber,
    email,
    phoneNumber,
    username,
    password,
  } = req.body;

  // Basic validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phoneNumber);
  };

  const isValidPassword = (password) => {
    // Example: At least 8 characters, one uppercase letter, one lowercase letter, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const isValidGovernmentIdNumber = (id) => {
    // Example validation, replace with actual logic if needed
    return id && id.length > 5; // Replace with actual validation rule
  };

  if (
    !fullname ||
    !dateOfBirth ||
    !address ||
    !governmentIdNumber ||
    !email ||
    !phoneNumber ||
    !username ||
    !password
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    res.status(400);
    throw new Error("Invalid phone number format");
  }

  if (!isValidPassword(password)) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number"
    );
  }

  if (!isValidGovernmentIdNumber(governmentIdNumber)) {
    res.status(400);
    throw new Error("Invalid government ID number");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = new User({
    fullname,
    dateOfBirth,
    address,
    governmentIdNumber,
    email,
    phoneNumber,
    username,
    password,
  });

  await user.save();
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ message: "User Registered SuccessFully", user });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = {
  authUser,
  registerUser,
};
