import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const searchUsers = createAsyncThunk("search/searchUsers", async (query, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        query,
        type: "users",
      },
    }

    const { data } = await axios.get("/api/search", config)

    return data.users
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const search = createAsyncThunk("search/search", async ({ query, type }, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        query,
        type,
      },
    }

    const { data } = await axios.get("/api/search", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

const initialState = {
  results: null,
  loading: false,
  error: null,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(search.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
        state.error = null
      })
      .addCase(search.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
        state.error = null
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearResults, clearError } = searchSlice.actions

export default searchSlice.reducer
