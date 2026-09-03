import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '../../api/services/authService.js'

// Helper to consistently pull the message out of your backend's
// ApiError shape: { statusCode, data, message, success, errors }
const extractErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong'

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await authService.registerUser(formData)
      return result.data // the created user object
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.loginUser(credentials)
      return result.data.user // { user, accessToken, refreshToken } -> just the user
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutUser()
      return true
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getCurrentUser()
      return result.data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register — does NOT log the user in automatically, since your
      // backend doesn't set cookies on register, only on login.
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.status = 'idle'
      })

      // Fetch current user — used on app load to restore session
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.isAuthenticated = true
        state.authChecked = true 
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Not logged in / refresh failed — this is a normal state, not
        // necessarily an error we need to show the user.
        state.status = 'idle'
        state.user = null
        state.isAuthenticated = false
        state.authChecked = true 
      })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer