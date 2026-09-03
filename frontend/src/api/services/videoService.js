import axiosInstance from '../axiosInstance.js'

// params can include: page, limit, query, sortBy, sortType, userId
export const getAllVideos = async (params = {}) => {
  const response = await axiosInstance.get('/videos', { params })
  return response.data
}

export const getVideoById = async (videoId) => {
  const response = await axiosInstance.get(`/videos/${videoId}`)
  return response.data
}

export const publishVideo = async (formData, onUploadProgress) => {
  const response = await axiosInstance.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })

  return response.data
}

export const updateVideo = async (videoId, formData) => {
  const response = await axiosInstance.patch(`/videos/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const deleteVideo = async (videoId) => {
  const response = await axiosInstance.delete(`/videos/${videoId}`)
  return response.data
}

export const togglePublishStatus = async (videoId) => {
  const response = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`)
  return response.data
}