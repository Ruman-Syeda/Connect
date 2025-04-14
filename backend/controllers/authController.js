import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  // Check if email is valid Centennial College email
  if (!email.endsWith("@my.centennialcollege.ca")) {
    res.status(400)
    throw new Error("Please use your Centennial College email (@my.centennialcollege.ca)")
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Validate role
  const validRoles = ["user", "alumni", "communityManager", "eventManager", "admin"]
  const userRole = role && validRoles.includes(role) ? role : "user"

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      resume: user.resume,
      preferences: user.preferences,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Create admin user
// @route   POST /api/users/create-admin
// @access  Public (should be secured in production)
const createAdminUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    // If user exists but is not admin, update to admin
    if (userExists.role !== "admin") {
      userExists.role = "admin"
      await userExists.save()

      res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
        message: "User updated to admin role",
        token: generateToken(userExists._id),
      })
    } else {
      res.status(400)
      throw new Error("Admin user already exists")
    }
  } else {
    // Create new admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Admin user created successfully",
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error("Invalid user data")
    }
  }
})

export { authUser, registerUser, getUserProfile, createAdminUser }
