import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import colors from "colors"
import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

import userRoutes from "./routes/userRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import communityRoutes from "./routes/communityRoutes.js"
import groupRoutes from "./routes/groupRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"

dotenv.config()

connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/communities", communityRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/messages", messageRoutes)

const __dirname = path.resolve()

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")))

  app.get("*", (req, res) => 
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("API is running...")
  })
}

// Error handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
})


