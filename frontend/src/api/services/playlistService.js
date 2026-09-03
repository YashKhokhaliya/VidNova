import axiosInstance from '../axiosInstance.js'

export const getUserPlaylists = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  const response = await axiosInstance.get(
    `/playlist/user/${userId}`,
  )

  return response.data
}

export const getPlaylistById = async (playlistId) => {
  if (!playlistId) {
    throw new Error('Playlist ID is required')
  }

  const response = await axiosInstance.get(
    `/playlist/${playlistId}`,
  )

  return response.data
}

export const createPlaylist = async (data) => {
  const response = await axiosInstance.post(
    '/playlist',
    data,
  )

  return response.data
}

export const updatePlaylist = async (
  playlistId,
  formData
) => {
  const response = await axiosInstance.patch(
    `/playlist/${playlistId}`,
    formData
  );

  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await axiosInstance.delete(
    `/playlist/${playlistId}`,
  )

  return response.data
}

export const addVideoToPlaylist = async (
  playlistId,
  videoId,
) => {
  if (!playlistId || !videoId) {
    throw new Error(
      'Playlist ID and Video ID are required',
    )
  }

  const response = await axiosInstance.patch(
    `/playlist/add/${videoId}/${playlistId}`,
  )

  return response.data
}

export const removeVideoFromPlaylist = async (
  playlistId,
  videoId,
) => {
  if (!playlistId || !videoId) {
    throw new Error(
      'Playlist ID and Video ID are required',
    )
  }

  const response = await axiosInstance.patch(
    `/playlist/remove/${videoId}/${playlistId}`,
  )

  return response.data
}