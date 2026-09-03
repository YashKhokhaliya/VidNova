import axiosInstance from '../axiosInstance.js'

export const getChannelStats = async () => {
  const response = await axiosInstance.get(
    '/dashboard/stats',
  )

  return response.data
}

export const getChannelVideos = async () => {
  const response = await axiosInstance.get(
    '/dashboard/videos',
  )

  return response.data
}