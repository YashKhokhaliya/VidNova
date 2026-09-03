import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateVideo } from '../../api/services/videoService.js'

function UpdateVideoForm({
  video,
  onClose,
  onUpdated,
}) {
  const [title, setTitle] = useState(
    () => video?.title || '',
  )

  const [description, setDescription] = useState(
    () => video?.description || '',
  )

  const [thumbnail, setThumbnail] = useState(null)

  const [preview, setPreview] = useState(
    () => video?.thumbnail || '',
  )

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image')
      return
    }

    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setThumbnail(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleClose = () => {
    if (isSubmitting) return

    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      toast.error('Video title is required')
      return
    }

    if (!trimmedDescription) {
      toast.error('Video description is required')
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()

      formData.append('title', trimmedTitle)
      formData.append(
        'description',
        trimmedDescription,
      )

      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      const response = await updateVideo(
        video._id,
        formData,
      )

      toast.success(
        response.message ||
          'Video updated successfully',
      )

      await onUpdated?.()

      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }

      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to update video',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        aria-label="Close update video form"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Edit video
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Update the title, description, or thumbnail.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close update video form"
            className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Thumbnail
            </label>

            <label className="group relative block cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/20 bg-zinc-900">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Video thumbnail preview"
                    className="aspect-video w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/50">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black opacity-0 transition group-hover:opacity-100">
                      Change thumbnail
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-zinc-400">
                  Select thumbnail
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="video-title"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Title
            </label>

            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={150}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="video-description"
                className="text-sm font-medium text-zinc-200"
              >
                Description
              </label>

              <span className="text-xs text-zinc-500">
                {description.length}/1000
              </span>
            </div>

            <textarea
              id="video-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={6}
              maxLength={1000}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-w-36 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateVideoForm