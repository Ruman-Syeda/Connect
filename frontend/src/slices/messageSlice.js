import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Get all conversations for the current user
export const getConversations = createAsyncThunk(
  "messages/getConversations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userInfo } = getState().auth

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get("/api/messages/conversations", config)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

// Get messages for a specific conversation
export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (conversationId, { getState, rejectWithValue }) => {
    try {
      const { userInfo } = getState().auth

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(`/api/messages/${conversationId}`, config)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

// Send a new message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ recipient, content }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userInfo } = getState().auth

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post("/api/messages", { recipient, content }, config)

      // Refresh conversations after sending a message
      dispatch(getConversations())

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversations: [],
    messages: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetMessageState: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Get conversations
      .addCase(getConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.messages = [...state.messages, action.payload]
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { resetMessageState } = messageSlice.actions
export default messageSlice.reducer
