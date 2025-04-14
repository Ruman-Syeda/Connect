import express from "express"
import { getConversations, getMessages, sendMessage, deleteMessage } from "../controllers/messageController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, sendMessage)
router.route("/conversations").get(protect, getConversations)
router.route("/:conversationId").get(protect, getMessages)
router.route("/:id").delete(protect, deleteMessage)

export default router
