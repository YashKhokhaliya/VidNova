import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, ImagePlus, UploadCloud, Video } from 'lucide-react'
import toast from 'react-hot-toast'

import { publishVideo } from '../api/services/videoService.js'
import {
  resetUpload,
  setUploadProgress,
  startUpload,
  uploadFailure,
  uploadSuccess,
} from '../features/upload/uploadSlice.js'

function UploadVideoPage() {
  const dispatch = useDispatch()

  const {
    isUploading,
    progress,
    fileName,
    status,
    error,
    uploadedVideo,
  } = useSelector((state) => state.upload)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files?.[0] || null
    setVideoFile(selectedFile)
  }

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files?.[0] || null

    setThumbnail(selectedFile)

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile)
      setThumbnailPreview(previewUrl)
    } else {
      setThumbnailPreview('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a video title')
      return
    }

    if (!description.trim()) {
      toast.error('Please enter a video description')
      return
    }

    if (!videoFile) {
      toast.error('Please select a video file')
      return
    }

    if (!thumbnail) {
      toast.error('Please select a thumbnail')
      return
    }

    const formData = new FormData()

    formData.append('title', title.trim())
    formData.append('description', description.trim())
    formData.append('videoFile', videoFile)
    formData.append('thumbnail', thumbnail)

    dispatch(
      startUpload({
        fileName: videoFile.name,
      }),
    )

    try {
      const response = await publishVideo(
        formData,
        (progressEvent) => {
          if (!progressEvent.total) return

          const uploadPercentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )

          dispatch(setUploadProgress(uploadPercentage))
        },
      )

      dispatch(uploadSuccess(response.data))

      toast.success(
        response.message || 'Video uploaded successfully',
      )

      setTitle('')
      setDescription('')
      setVideoFile(null)
      setThumbnail(null)

      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview)
      }

      setThumbnailPreview('')
    } catch (uploadError) {
      const errorMessage =
        uploadError.response?.data?.message ||
        uploadError.message ||
        'Video upload failed'

      dispatch(uploadFailure(errorMessage))
      toast.error(errorMessage)
    }
  }

  const handleUploadAnotherVideo = () => {
    dispatch(resetUpload())

    setTitle('')
    setDescription('')
    setVideoFile(null)
    setThumbnail(null)

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }

    setThumbnailPreview('')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Upload video
        </h1>

        <p className="mt-2 text-[var(--color-text-secondary)]">
          Upload and publish a new video to your channel.
        </p>
      </div>

      {status === 'uploading' && (
        <div className="mb-6 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                <UploadCloud className="h-5 w-5 text-purple-400" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Uploading video
                </p>

                <p className="truncate text-sm text-[var(--color-text-secondary)]">
                  {fileName}
                </p>
              </div>
            </div>

            <span className="shrink-0 text-lg font-bold text-purple-400">
              {progress}%
            </span>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            You can visit another page. The upload will continue.
          </p>

          {progress === 100 && (
            <p className="mt-2 text-sm text-purple-300">
              File sent successfully. The server is processing and
              uploading it to Cloudinary.
            </p>
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>

            <div>
              <p className="font-semibold text-green-400">
                Video uploaded successfully
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {uploadedVideo?.title || fileName}
              </p>

              <button
                type="button"
                onClick={handleUploadAnotherVideo}
                className="mt-4 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-400"
              >
                Upload another video
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
          <p className="font-semibold text-red-400">
            Video upload failed
          </p>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {error}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8"
      >
        <div>
          <label
            htmlFor="video-title"
            className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Video title
          </label>

          <input
            id="video-title"
            type="text"
            value={title}
            disabled={isUploading}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a title for your video"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="video-description"
            className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Description
          </label>

          <textarea
            id="video-description"
            value={description}
            disabled={isUploading}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            placeholder="Tell viewers about your video"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="video-file"
              className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Video file
            </label>

            <label
              htmlFor="video-file"
              className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:border-purple-500 hover:bg-purple-500/5 ${
                isUploading
                  ? 'pointer-events-none cursor-not-allowed opacity-60'
                  : ''
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15">
                <Video className="h-6 w-6 text-purple-400" />
              </div>

              <p className="mt-4 font-medium text-[var(--color-text-primary)]">
                {videoFile
                  ? videoFile.name
                  : 'Select video file'}
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Click here to choose a video
              </p>
            </label>

            <input
              id="video-file"
              type="file"
              accept="video/*"
              disabled={isUploading}
              onChange={handleVideoChange}
              className="hidden"
            />
          </div>

          <div>
            <label
              htmlFor="thumbnail-file"
              className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Thumbnail
            </label>

            <label
              htmlFor="thumbnail-file"
              className={`relative flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:border-purple-500 hover:bg-purple-500/5 ${
                isUploading
                  ? 'pointer-events-none cursor-not-allowed opacity-60'
                  : ''
              }`}
            >
              {thumbnailPreview ? (
                <>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50" />

                  <div className="relative z-10">
                    <p className="font-medium text-white">
                      Change thumbnail
                    </p>

                    <p className="mt-1 max-w-48 truncate text-sm text-white/70">
                      {thumbnail?.name}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15">
                    <ImagePlus className="h-6 w-6 text-purple-400" />
                  </div>

                  <p className="mt-4 font-medium text-[var(--color-text-primary)]">
                    Select thumbnail
                  </p>

                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Click here to choose an image
                  </p>
                </>
              )}
            </label>

            <input
              id="thumbnail-file"
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleThumbnailChange}
              className="hidden"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadCloud className="h-5 w-5" />

          {isUploading
            ? `Uploading ${progress}%`
            : 'Upload video'}
        </button>
      </form>
    </div>
  )
}

export default UploadVideoPage