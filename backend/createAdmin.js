import dotenv from "dotenv"
import User from "./models/userModel.js"
import connectDB from "./config/db.js"
import bcrypt from "bcryptjs"

dotenv.config()

// Connect to database
connectDB()

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" })

    if (adminExists) {
      console.log("Admin user already exists:".yellow)
      console.log(`Name: ${adminExists.name}`.green)
      console.log(`Email: ${adminExists.email}`.green)
      console.log(`ID: ${adminExists._id}`.green)
      process.exit()
    }

    // Get admin details from command line or use defaults
    const name = process.argv[2] || "Admin User"
    const email = process.argv[3] || "admin@my.centennialcollege.ca"
    const password = process.argv[4] || "admin123"

    // Create admin user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    })

    console.log("Admin user created successfully:".green)
    console.log(`Name: ${admin.name}`.green)
    console.log(`Email: ${admin.email}`.green)
    console.log(`Password: ${password}`.yellow)
    console.log(`ID: ${admin._id}`.green)

    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

createAdmin()
