import axiosInstance from '../axiosInstance.js'

// Register expects multipart/form-data because avatar (required) and
// coverImage (optional) are files, not plain text fields.
export const registerUser = async (formData) => {
  const response = await axiosInstance.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// Login accepts either { email, password } or { username, password } as JSON.
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/users/login', credentials)
  return response.data
}

// Logout requires the user to already be authenticated (cookie sent automatically).
export const logoutUser = async () => {
  const response = await axiosInstance.post('/users/logout')
  return response.data
}

// Refresh reads the refreshToken cookie automatically — no body needed.
export const refreshAccessToken = async () => {
  const response = await axiosInstance.post('/users/refresh-token')
  return response.data
}

// Used on app load / page refresh to check if the user is still logged in.
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/current-user')
  return response.data
}