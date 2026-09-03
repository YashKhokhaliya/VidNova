import axiosInstance from '../axiosInstance.js'

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/current-user')
  return response.data
}

export const updateAccountDetails = async (data) => {
  const response = await axiosInstance.patch('/users/update-account', data)
  return response.data
}

export const updateUserAvatar = async (avatarFile) => {
  const formData = new FormData()
  formData.append('avatar', avatarFile)

  const response = await axiosInstance.patch('/users/avatar', formData)

  return response.data
}

export const updateUserCoverImage = async (coverImageFile) => {
  const formData = new FormData()
  formData.append('coverImage', coverImageFile)

  const response = await axiosInstance.patch('/users/cover-image', formData)

  return response.data
}

export const changeCurrentPassword = async (passwordData) => {
  const response = await axiosInstance.patch(
    '/users/change-password',
    passwordData,
  )

  return response.data
}

export const getWatchHistory = async () => {
  const response = await axiosInstance.get('/users/history')
  return response.data
}