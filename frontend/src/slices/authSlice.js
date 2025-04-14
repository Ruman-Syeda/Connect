import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  userProfile: null,
  loading: false,
  error: null,
  success: false,
}

export const login = createAsyncThunk("auth/login", async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const { data } = await axios.post("/api/users/login", { email, password }, config)

    // For debugging
    console.log("Login response:", data)

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

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      // For debugging
      console.log("Registering with role:", role)

      const { data } = await axios.post("/api/users", { name, email, password, role }, config)

      // For debugging
      console.log("Register response:", data)

      localStorage.setItem("userInfo", JSON.stringify(data))

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

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

      // Update role in localStorage if it changed
      const updatedUserInfo = { ...userInfo, ...data }
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))

      return updatedUserInfo
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

// Manually set user role for testing
export const setUserRole = createAsyncThunk("auth/setUserRole", async (role, { getState }) => {
  const {
    auth: { userInfo },
  } = getState()

  if (userInfo) {
    const updatedUserInfo = { ...userInfo, role }
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
    return updatedUserInfo
  }

  return null
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo")
      sessionStorage.removeItem("userInfo")
      state.userInfo = null
      state.userProfile = null
      state.loading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    resetSuccess: (state) => {
      state.success = false
    },
    // For testing - manually set role
    setRole: (state, action) => {
      if (state.userInfo) {
        state.userInfo.role = action.payload
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
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
        state.success = false
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.userProfile = action.payload
        state.success = true
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(uploadResume.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false
        state.userProfile = { ...state.userProfile, resume: action.payload.resumeUrl }
        state.success = true
        state.error = null
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(setUserRole.fulfilled, (state, action) => {
        if (action.payload) {
          state.userInfo = action.payload
        }
      })
  },
})

export const { logout, clearError, resetSuccess, setRole } = authSlice.actions

export default authSlice.reducer
