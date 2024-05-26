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

// Define validation functions outside the request handler
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const gmailRegex = /@gmail\.com$/;
  return emailRegex.test(email) && gmailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{11}$/;
  return phoneRegex.test(phoneNumber);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

const isValidGovernmentIdNumber = (id) => {
  // Example validation, replace with actual logic if needed
  return id && id.length > 5; // Replace with actual validation rule
};

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const isEligible = (dateOfBirth, minimumAge) => {
  const age = calculateAge(dateOfBirth);
  return age >= minimumAge;
};
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

  const minimumAge = 18; // Define minimum age requirement
  const isUserEligible = isEligible(dateOfBirth, minimumAge);
  console.log(isUserEligible);
  const age = calculateAge(dateOfBirth);
  if (!isEligible(dateOfBirth, minimumAge)) {
    res.status(400);
    throw new Error("User Not Eligible to Register");
  }

  const userExists = await User.findOne({
    $or: [
      { email: email },
      { governmentIdNumber: governmentIdNumber },
      { phoneNumber: phoneNumber },
      { username: username },
    ],
  });

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
    age: age, // Store user's age
    eligible: true, // Set user's eligibility to true
    password,
  });
  await user.save();

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ message: "User Registered Successfully", user });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
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

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  logoutUser,
  updateUserProfile,
};
