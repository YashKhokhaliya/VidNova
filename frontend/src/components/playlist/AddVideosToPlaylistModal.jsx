import { useCallback, useMemo, useState } from 'react'
import {
  Check,
  LoaderCircle,
  Plus,
  Search,
  Video,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { getChannelVideos } from '../../api/services/channelService.js'
import { addVideoToPlaylist } from '../../api/services/playlistService.js'
import useFetch from '../../hooks/useFetch.js'
import Skeleton from '../ui/Skeleton.jsx'

function AddVideosToPlaylistModal({
  isOpen,
  onClose,
  playlistId,
  userId,
  existingVideoIds = [],
  onVideosAdded,
}) {
  const [selectedVideoIds, setSelectedVideoIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchVideos = useCallback(() => {
    if (!userId) {
      return Promise.resolve({
        data: [],
      })
    }

    return getChannelVideos(userId)
  }, [userId])

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchVideos)

  const videos = Array.isArray(data)
    ? data
    : data?.docs ?? data?.videos ?? []

  const existingIds = useMemo(() => {
    return new Set(existingVideoIds.map(String))
  }, [existingVideoIds])

  const availableVideos = useMemo(() => {
    return videos.filter(
      (video) => !existingIds.has(String(video._id)),
    )
  }, [videos, existingIds])

  const filteredVideos = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase()

    if (!normalizedQuery) {
      return availableVideos
    }

    return availableVideos.filter((video) =>
      video.title
        ?.toLowerCase()
        .includes(normalizedQuery),
    )
  }, [availableVideos, searchQuery])

  const resetModal = () => {
    setSelectedVideoIds([])
    setSearchQuery('')
  }

  const handleClose = () => {
    if (isSubmitting) return

    resetModal()
    onClose()
  }

  const handleToggleVideo = (videoId) => {
    setSelectedVideoIds((previousIds) => {
      const exists = previousIds.includes(videoId)

      if (exists) {
        return previousIds.filter(
          (id) => id !== videoId,
        )
      }

      return [...previousIds, videoId]
    })
  }

  const handleSubmit = async () => {
    if (!playlistId) {
      toast.error('Playlist ID is missing')
      return
    }

    if (selectedVideoIds.length === 0) {
      toast.error('Select at least one video')
      return
    }

    try {
      setIsSubmitting(true)

      await Promise.all(
        selectedVideoIds.map((videoId) =>
          addVideoToPlaylist(playlistId, videoId),
        ),
      )

      toast.success(
        selectedVideoIds.length === 1
          ? 'Video added to playlist'
          : `${selectedVideoIds.length} videos added to playlist`,
      )

      await onVideosAdded?.()

      resetModal()
      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to add videos',
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
        aria-labelledby="add-videos-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <h2
              id="add-videos-title"
              className="text-xl font-bold text-[var(--color-text-primary)]"
            >
              Add videos
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Select videos from your channel.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close add videos modal"
            className="rounded-full p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <div className="border-b border-[var(--color-border)] p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search your videos"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-3 pl-11 pr-4 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex gap-4"
                  >
                    <Skeleton className="h-24 w-40 shrink-0 rounded-xl" />

                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="mt-3 h-4 w-1/3" />
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl border border-[var(--color-border)] p-8 text-center">
              <p className="text-sm text-[var(--color-danger)]">
                {error}
              </p>

              <button
                type="button"
                onClick={refetch}
                className="mt-4 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredVideos.length === 0 && (
              <div className="py-12 text-center">
                <Video
                  size={42}
                  className="mx-auto text-[var(--color-text-secondary)]"
                />

                <h3 className="mt-4 font-semibold text-[var(--color-text-primary)]">
                  No videos available
                </h3>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {availableVideos.length === 0
                    ? 'All your videos are already in this playlist, or you have not uploaded any videos.'
                    : 'No videos match your search.'}
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            filteredVideos.length > 0 && (
              <div className="space-y-3">
                {filteredVideos.map((video) => {
                  const isSelected =
                    selectedVideoIds.includes(
                      video._id,
                    )

                  return (
                    <button
                      key={video._id}
                      type="button"
                      onClick={() =>
                        handleToggleVideo(video._id)
                      }
                      className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                          : 'border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'
                      }`}
                    >
                      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />

                        <div
                          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                              : 'border-white/60 bg-black/60 text-white'
                          }`}
                        >
                          {isSelected ? (
                            <Check size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 font-semibold text-[var(--color-text-primary)]">
                          {video.title}
                        </h3>

                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                          {video.views ?? 0} views
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {selectedVideoIds.length}{' '}
            {selectedVideoIds.length === 1
              ? 'video selected'
              : 'videos selected'}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full border border-[var(--color-border)] px-5 py-2.5 font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                selectedVideoIds.length === 0
              }
              className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {isSubmitting
                ? 'Adding videos...'
                : 'Add videos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVideosToPlaylistModal