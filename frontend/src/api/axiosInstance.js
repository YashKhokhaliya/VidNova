import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})


// Tracks whether a refresh call is already in progress, so multiple
// simultaneous 401s don't trigger multiple refresh requests at once.
let isRefreshing = false
let pendingRequests = []

const processPendingRequests = (error) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  pendingRequests = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt a refresh once per request, and only on 401s that
    // aren't already coming from the login or refresh-token endpoints.
    const isAuthRoute =
      originalRequest.url?.includes('/users/login') ||
      originalRequest.url?.includes('/users/refresh-token')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // If a refresh is already happening, queue this request until it's done.
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject })
        }).then(() => axiosInstance(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axiosInstance.post('/users/refresh-token')
        processPendingRequests(null)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processPendingRequests(refreshError)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance