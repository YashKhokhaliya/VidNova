import { useEffect, useRef, useState } from 'react'
import { ImagePlus, LoaderCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createPlaylist } from '../../api/services/playlistService.js'

function CreatePlaylistModal({
  isOpen,
  onClose,
  onPlaylistCreated,
}) {
  const fileInputRef = useRef(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setName('')
    setDescription('')
    setThumbnail(null)
    setThumbnailPreview('')
    setErrors({})

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview])

  const handleClose = () => {
    if (isSubmitting) return

    resetForm()
    onClose()
  }

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        thumbnail: 'Please select a JPG, PNG, or WebP image.',
      }))

      event.target.value = ''
      return
    }

    const maximumSize = 5 * 1024 * 1024

    if (file.size > maximumSize) {
      setErrors((previous) => ({
        ...previous,
        thumbnail: 'Thumbnail must be smaller than 5 MB.',
      }))

      event.target.value = ''
      return
    }

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }

    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))

    setErrors((previous) => ({
      ...previous,
      thumbnail: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!name.trim()) {
      nextErrors.name = 'Playlist name is required.'
    } else if (name.trim().length < 3) {
      nextErrors.name =
        'Playlist name must contain at least 3 characters.'
    }

    if (!description.trim()) {
      nextErrors.description =
        'Playlist description is required.'
    }

    if (!thumbnail) {
      nextErrors.thumbnail =
        'Playlist thumbnail is required.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    const formData = new FormData()

    formData.append('name', name.trim())
    formData.append('description', description.trim())
    formData.append('thumbnail', thumbnail)

    try {
      setIsSubmitting(true)

      const response = await createPlaylist(formData)

      toast.success(
        response.message || 'Playlist created successfully',
      )

      onPlaylistCreated?.(response.data)

      resetForm()
      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to create playlist',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-playlist-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] px-6 py-5">
          <div>
            <h2
              id="create-playlist-title"
              className="text-xl font-bold text-[var(--color-text-primary)]"
            >
              Create playlist
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Organize your videos into a new playlist.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close create playlist modal"
            className="rounded-full p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          <div>
            <label
              htmlFor="playlist-thumbnail"
              className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]"
            >
              Thumbnail
            </label>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex aspect-video w-full overflow-hidden rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition hover:border-[var(--color-accent)]"
            >
              {thumbnailPreview ? (
                <>
                  <img
                    src={thumbnailPreview}
                    alt="Playlist thumbnail preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/50">
                    <span className="translate-y-2 rounded-full bg-black/75 px-4 py-2 text-sm font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                      Change thumbnail
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                  <div className="rounded-full bg-[var(--color-bg-primary)] p-4">
                    <ImagePlus
                      size={30}
                      className="text-[var(--color-accent)]"
                    />
                  </div>

                  <p className="mt-4 font-semibold text-[var(--color-text-primary)]">
                    Upload playlist thumbnail
                  </p>

                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    JPG, PNG or WebP, maximum 5 MB
                  </p>
                </div>
              )}
            </button>

            <input
              ref={fileInputRef}
              id="playlist-thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
              className="hidden"
            />

            {errors.thumbnail && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {errors.thumbnail}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="playlist-name"
              className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]"
            >
              Playlist name
            </label>

            <input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)

                if (errors.name) {
                  setErrors((previous) => ({
                    ...previous,
                    name: '',
                  }))
                }
              }}
              placeholder="For example: JavaScript tutorials"
              maxLength={100}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)]"
            />

            <div className="mt-2 flex justify-between gap-3">
              {errors.name ? (
                <p className="text-sm text-[var(--color-danger)]">
                  {errors.name}
                </p>
              ) : (
                <span />
              )}

              <span className="text-xs text-[var(--color-text-secondary)]">
                {name.length}/100
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="playlist-description"
              className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]"
            >
              Description
            </label>

            <textarea
              id="playlist-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value)

                if (errors.description) {
                  setErrors((previous) => ({
                    ...previous,
                    description: '',
                  }))
                }
              }}
              placeholder="Describe what viewers will find in this playlist"
              rows={4}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)]"
            />

            <div className="mt-2 flex justify-between gap-3">
              {errors.description ? (
                <p className="text-sm text-[var(--color-danger)]">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}

              <span className="text-xs text-[var(--color-text-secondary)]">
                {description.length}/500
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full border border-[var(--color-border)] px-5 py-2.5 font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {isSubmitting
                ? 'Creating playlist...'
                : 'Create playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlaylistModal