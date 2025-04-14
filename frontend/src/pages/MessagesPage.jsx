"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getConversations, getMessages, sendMessage } from "../slices/messageSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const MessagesPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [messageContent, setMessageContent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  const messagesEndRef = useRef(null)

  const { userInfo } = useSelector((state) => state.auth)
  const { conversations, messages, loading, error } = useSelector((state) => state.messages)

  // Get all conversations on component mount
  useEffect(() => {
    if (userInfo) {
      dispatch(getConversations())
    } else {
      navigate("/login")
    }
  }, [dispatch, userInfo, navigate])

  // Get messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id))
    }
  }, [dispatch, selectedUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageContent.trim() && selectedUser) {
      dispatch(
        sendMessage({
          recipient: selectedUser._id,
          content: messageContent,
        }),
      )
      setMessageContent("")
    }
  }

  const handleConversationClick = (user) => {
    setSelectedUser(user)
  }

  // Filter conversations based on search term
  const filteredConversations =
    conversations?.filter((conv) => conv.participant?.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Messages</h1>

      {error && <Message variant="error">{error}</Message>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
            {loading && !conversations?.length ? (
              <div className="p-4">
                <Loader />
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedUser?._id === conversation.participant._id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleConversationClick(conversation.participant)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {conversation.participant.profilePicture ? (
                        <img
                          src={conversation.participant.profilePicture || "/placeholder.svg"}
                          alt={conversation.participant.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          {conversation.participant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{conversation.participant.name}</h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage.sender === userInfo._id ? "You: " : ""}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="ml-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          style={{ height: "70vh" }}
        >
          {selectedUser ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-green-700 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {selectedUser.profilePicture ? (
                      <img
                        src={selectedUser.profilePicture || "/placeholder.svg"}
                        alt={selectedUser.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{selectedUser.name}</h3>
                    <p className="text-xs opacity-75">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant="error">{error}</Message>
                ) : messages?.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender === userInfo._id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                            msg.sender === userInfo._id ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 my-10">No messages yet. Start a conversation!</div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageContent.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
