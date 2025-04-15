import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const { data } = await axios.post("/api/users", { name, email, password, role }, config)

      localStorage.setItem("userInfo", JSON.stringify(data))
      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const login = createAsyncThunk("auth/login", async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const { data } = await axios.post("/api/users/login", { email, password }, config)

    if (rememberMe) {
      localStorage.setItem("userInfo", JSON.stringify(data))
    } else {
      sessionStorage.setItem("userInfo", JSON.stringify(data))
    }

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})


export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/users/profile", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})


export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put("/api/users/profile", userData, config)

      localStorage.setItem("userInfo", JSON.stringify(data))
      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)


export const uploadResume = createAsyncThunk("auth/uploadResume", async (resumeData, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post("/api/users/resume", resumeData, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

const initialState = {
  loading: false,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo"))
      : null,
  userProfile: null,
  error: null,
  success: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo")
      sessionStorage.removeItem("userInfo")
      state.userInfo = null
      state.userProfile = null
    },
    clearError: (state) => {
      state.error = null
    },
    setRole: (state, action) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, role: action.payload }
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.success = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.success = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userProfile = action.payload
        state.error = null
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.userProfile = action.payload
        state.success = true
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(uploadResume.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false
        state.userProfile = { ...state.userProfile, resume: action.payload.resumeUrl }
        state.success = true
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, setRole } = authSlice.actions

export default authSlice.reducer
