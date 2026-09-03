import axiosInstance from '../axiosInstance.js'
import { getAllVideos } from './videoService.js'

export const getChannelProfile = async (username) => {
  if (!username) {
    throw new Error('Username is required')
  }

  const response = await axiosInstance.get(`/users/c/${username}`)

  return response.data
}

export const getChannelVideos = async (userId) => {
  if (!userId) {
    throw new Error('Channel user ID is required')
  }

  return getAllVideos({
    userId,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortType: 'desc',
  })
}