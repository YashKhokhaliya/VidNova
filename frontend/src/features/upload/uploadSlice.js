import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isUploading: false,
  progress: 0,
  fileName: '',
  status: 'idle',
  error: null,
  uploadedVideo: null,
}

const uploadSlice = createSlice({
  name: 'upload',

  initialState,

  reducers: {
    startUpload: (state, action) => {
      state.isUploading = true
      state.progress = 0
      state.fileName = action.payload?.fileName || ''
      state.status = 'uploading'
      state.error = null
      state.uploadedVideo = null
    },

    setUploadProgress: (state, action) => {
      state.progress = action.payload
    },

    uploadSuccess: (state, action) => {
      state.isUploading = false
      state.progress = 100
      state.status = 'success'
      state.uploadedVideo = action.payload
      state.error = null
    },

    uploadFailure: (state, action) => {
      state.isUploading = false
      state.status = 'error'
      state.error = action.payload
    },

    resetUpload: () => initialState,
  },
})

export const {
  startUpload,
  setUploadProgress,
  uploadSuccess,
  uploadFailure,
  resetUpload,
} = uploadSlice.actions

export default uploadSlice.reducer