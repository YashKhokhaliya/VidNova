import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import uploadReducer from '../features/upload/uploadSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
  },
})