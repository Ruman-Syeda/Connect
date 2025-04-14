import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Get platform overview
export const getPlatformOverview = createAsyncThunk("analytics/getPlatformOverview", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/analytics/overview")
    return data
  } catch (error) {
    return rejectWithValue(error.response.data.message || error.message)
  }
})

// Get community analytics
export const getCommunityAnalytics = createAsyncThunk(
  "analytics/getCommunityAnalytics",
  async (communityId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/analytics/communities/${communityId}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  },
)

// Get event analytics
export const getEventAnalytics = createAsyncThunk(
  "analytics/getEventAnalytics",
  async (eventId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/analytics/events/${eventId}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  },
)

// Get user analytics
export const getUserAnalytics = createAsyncThunk("analytics/getUserAnalytics", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/analytics/users")
    return data
  } catch (error) {
    return rejectWithValue(error.response.data.message || error.message)
  }
})

const initialState = {
  loading: false,
  error: null,
  platformOverview: null,
  communityAnalytics: null,
  eventAnalytics: null,
  userAnalytics: null,
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Platform Overview
      .addCase(getPlatformOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPlatformOverview.fulfilled, (state, action) => {
        state.loading = false
        state.platformOverview = action.payload
      })
      .addCase(getPlatformOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Community Analytics
      .addCase(getCommunityAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommunityAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.communityAnalytics = action.payload
      })
      .addCase(getCommunityAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Event Analytics
      .addCase(getEventAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEventAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.eventAnalytics = action.payload
      })
      .addCase(getEventAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // User Analytics
      .addCase(getUserAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.userAnalytics = action.payload
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default analyticsSlice.reducer
