import axiosInstance from '../axiosInstance.js'

export const getVideoComments = async (videoId, params = {}) => {
  const response = await axiosInstance.get(`/comments/${videoId}`, { params })
  return response.data
}

export const addComment = async (videoId, commentContent) => {
  const response = await axiosInstance.post(`/comments/${videoId}`, { commentContent })
  return response.data
}

export const updateComment = async (commentId, newComment) => {
  const response = await axiosInstance.patch(`/comments/c/${commentId}`, { newComment })
  return response.data
}

export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`/comments/c/${commentId}`)
  return response.data
}