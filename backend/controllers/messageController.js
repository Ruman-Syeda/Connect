import asyncHandler from "express-async-handler"
import { Message, Conversation } from "../models/messageModel.js"
import User from "../models/userModel.js"

// @desc    Get all conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id

  // Find all conversations where the current user is a participant
  const conversations = await Conversation.find({
    participants: userId,
  }).sort({ updatedAt: -1 })

  // Get detailed conversation data with participant info and unread count
  const conversationData = await Promise.all(
    conversations.map(async (conversation) => {
      // Get the other participant (not the current user)
      const participantId = conversation.participants.find((p) => !p.equals(userId))
      const participant = await User.findById(participantId).select("name email profileImage")

      // Get the last message
      const lastMessage = await Message.findById(conversation.lastMessage)

      // Count unread messages
      const unreadCount = await Message.countDocuments({
        conversation: conversation._id,
        recipient: userId,
        read: false,
      })

      return {
        _id: conversation._id,
        participant,
        lastMessage,
        unreadCount,
        updatedAt: conversation.updatedAt,
      }
    }),
  )

  res.json(conversationData)
})

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId
  const userId = req.user._id

  // Verify the conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    res.status(404)
    throw new Error("Conversation not found")
  }

  if (!conversation.participants.includes(userId)) {
    res.status(403)
    throw new Error("Not authorized to access this conversation")
  }

  // Get messages
  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .populate("sender", "name profileImage")

  // Mark messages as read
  await Message.updateMany(
    {
      conversation: conversationId,
      recipient: userId,
      read: false,
    },
    { read: true },
  )

  res.json(messages)
})

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, content } = req.body
  const sender = req.user._id

  if (!content) {
    res.status(400)
    throw new Error("Message content is required")
  }

  // Check if recipient exists
  const recipientUser = await User.findById(recipient)
  if (!recipientUser) {
    res.status(404)
    throw new Error("Recipient not found")
  }

  // Find existing conversation or create a new one
  let conversation = await Conversation.findOne({
    participants: { $all: [sender, recipient] },
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [sender, recipient],
    })
  }

  // Create the message
  const message = await Message.create({
    sender,
    recipient,
    content,
    conversation: conversation._id,
  })

  // Update the conversation's last message
  conversation.lastMessage = message._id
  await conversation.save()

  // Populate sender info
  const populatedMessage = await Message.findById(message._id).populate("sender", "name profileImage")

  res.status(201).json(populatedMessage)
})

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.id
  const userId = req.user._id

  const message = await Message.findById(messageId)

  if (!message) {
    res.status(404)
    throw new Error("Message not found")
  }

  // Check if user is the sender
  if (!message.sender.equals(userId)) {
    res.status(403)
    throw new Error("Not authorized to delete this message")
  }

  await message.deleteOne()
  res.json({ message: "Message deleted" })
})

export { getConversations, getMessages, sendMessage, deleteMessage }
