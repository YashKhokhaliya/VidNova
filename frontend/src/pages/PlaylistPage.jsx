import { useCallback, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  ListVideo,
  LoaderCircle,
  Pencil,
  Play,
  Plus,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  deletePlaylist,
  getPlaylistById,
  removeVideoFromPlaylist,
} from '../api/services/playlistService.js'
import useFetch from '../hooks/useFetch.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import AddVideosToPlaylistModal from '../components/playlist/AddVideosToPlaylistModal.jsx'
import UpdatePlaylistForm from '../components/playlist/UpdatePlaylistForm.jsx'

function formatViews(views = 0) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(views) || 0)
}

function formatDuration(duration = 0) {
  const totalSeconds = Math.floor(Number(duration) || 0)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function PlaylistPage() {
  const { playlistId } = useParams()
  const navigate = useNavigate()

  const currentUser = useSelector(
    (state) => state.auth.user,
  )

  const [isAddVideosOpen, setIsAddVideosOpen] =
    useState(false)

  const [showUpdateForm, setShowUpdateForm] =
    useState(false)

  const [isDeletePlaylistModalOpen, setIsDeletePlaylistModalOpen] =
    useState(false)

  const [isDeletingPlaylist, setIsDeletingPlaylist] =
    useState(false)

  const [videoToRemove, setVideoToRemove] =
    useState(null)

  const [removingVideoId, setRemovingVideoId] =
    useState(null)

  const fetchPlaylist = useCallback(() => {
    return getPlaylistById(playlistId)
  }, [playlistId])

  const {
    data: playlist,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchPlaylist)

  const handleVideosAdded = async () => {
    await refetch()
  }

  const handlePlaylistUpdated = async () => {
    await refetch()
  }

  const handleRemoveVideo = async () => {
    if (!videoToRemove?._id || !playlist?._id) return

    try {
      setRemovingVideoId(videoToRemove._id)

      const response = await removeVideoFromPlaylist(
        playlist._id,
        videoToRemove._id,
      )

      toast.success(
        response?.message ||
          'Video removed from playlist',
      )

      setVideoToRemove(null)
      await refetch()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to remove video',
      )
    } finally {
      setRemovingVideoId(null)
    }
  }

  const handleDeletePlaylist = async () => {
    if (!playlist?._id) return

    try {
      setIsDeletingPlaylist(true)

      const response = await deletePlaylist(
        playlist._id,
      )

      toast.success(
        response?.message ||
          'Playlist deleted successfully',
      )

      setIsDeletePlaylistModalOpen(false)

      if (playlist.owner?.username) {
        navigate(
          `/channel/${playlist.owner.username}`,
          {
            replace: true,
            state: {
              activeTab: 'playlists',
            },
          },
        )
      } else {
        navigate('/', { replace: true })
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to delete playlist',
      )
    } finally {
      setIsDeletingPlaylist(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <Skeleton className="aspect-video w-full rounded-3xl lg:aspect-auto lg:h-72" />

          <div className="flex flex-col justify-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-72" />
            <Skeleton className="mt-4 h-5 w-full max-w-xl" />
            <Skeleton className="mt-2 h-5 w-80" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div key={index}>
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <Skeleton className="mt-3 h-5 w-4/5" />
                <Skeleton className="mt-2 h-4 w-2/5" />
              </div>
            ),
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold text-red-400">
            Failed to load playlist
          </h1>

          <p className="mt-2 text-sm text-red-300">
            {typeof error === 'string'
              ? error
              : error?.message ||
                'Something went wrong'}
          </p>

          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="text-2xl font-bold">
          Playlist not found
        </h1>
      </div>
    )
  }

  const videos = Array.isArray(playlist.videos)
    ? playlist.videos
    : []

  const firstVideo = videos[0]

  const playlistOwnerId =
    playlist.owner?._id ?? playlist.owner

  const isOwnPlaylist =
    Boolean(currentUser?._id && playlistOwnerId) &&
    String(currentUser._id) === String(playlistOwnerId)

  const existingVideoIds = videos.map(
    (video) => video._id,
  )

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="grid lg:grid-cols-[420px_1fr]">
          <div className="relative aspect-video overflow-hidden bg-black lg:aspect-auto lg:min-h-[310px]">
            {playlist.thumbnail ? (
              <img
                src={playlist.thumbnail}
                alt={`${playlist.name} playlist thumbnail`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center">
                <ListVideo
                  size={72}
                  className="text-[var(--color-text-secondary)]"
                />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/75 px-3 py-1.5 text-sm font-medium text-white">
              <ListVideo size={16} />

              {videos.length}{' '}
              {videos.length === 1
                ? 'video'
                : 'videos'}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Playlist
            </p>

            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl font-bold sm:text-4xl">
                {playlist.name}
              </h1>

              {isOwnPlaylist && (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowUpdateForm(true)
                    }
                    disabled={isDeletingPlaylist}
                    className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Pencil size={17} />
                    Edit playlist
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIsDeletePlaylistModalOpen(true)
                    }
                    disabled={isDeletingPlaylist}
                    className="flex items-center gap-2 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeletingPlaylist ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={17} />
                        Delete playlist
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {playlist.description && (
              <p className="mt-4 max-w-3xl leading-7 text-[var(--color-text-secondary)]">
                {playlist.description}
              </p>
            )}

            {playlist.owner && (
              <Link
                to={`/channel/${playlist.owner.username}`}
                className="mt-6 flex w-fit items-center gap-3 rounded-xl transition hover:opacity-80"
              >
                {playlist.owner.avatar && (
                  <img
                    src={playlist.owner.avatar}
                    alt={playlist.owner.fullName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                )}

                <div>
                  <p className="font-semibold">
                    {playlist.owner.fullName}
                  </p>

                  <p className="text-sm text-[var(--color-text-secondary)]">
                    @{playlist.owner.username}
                  </p>
                </div>
              </Link>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {firstVideo && (
                <Link
                  to={`/watch/${firstVideo._id}`}
                  className="flex w-fit items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  <Play
                    size={18}
                    fill="currentColor"
                  />
                  Play all
                </Link>
              )}

              {isOwnPlaylist && (
                <button
                  type="button"
                  onClick={() =>
                    setIsAddVideosOpen(true)
                  }
                  className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-primary)]"
                >
                  <Plus size={18} />
                  Add videos
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">
            Playlist videos
          </h2>

          <p className="text-sm text-[var(--color-text-secondary)]">
            {videos.length} total
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
            <ListVideo
              size={48}
              className="mx-auto text-[var(--color-text-secondary)]"
            />

            <h3 className="mt-4 text-lg font-semibold">
              This playlist is empty
            </h3>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Videos added to this playlist will appear
              here.
            </p>

            {isOwnPlaylist && (
              <button
                type="button"
                onClick={() =>
                  setIsAddVideosOpen(true)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                <Plus size={18} />
                Add your first video
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const isRemoving =
                removingVideoId === video._id

              return (
                <article
                  key={video._id}
                  className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative">
                    <Link
                      to={`/watch/${video._id}`}
                      className="block"
                    >
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                          {formatDuration(
                            video.duration,
                          )}
                        </span>
                      </div>
                    </Link>

                    {isOwnPlaylist && (
                      <button
                        type="button"
                        onClick={() =>
                          setVideoToRemove(video)
                        }
                        disabled={isRemoving}
                        aria-label={`Remove ${video.title} from playlist`}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRemoving ? (
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <Link
                      to={`/watch/${video._id}`}
                    >
                      <h3 className="line-clamp-2 font-semibold transition hover:text-[var(--color-primary)]">
                        {video.title}
                      </h3>
                    </Link>

                    <p className="mt-2 truncate text-sm text-[var(--color-text-secondary)]">
                      {video.owner?.fullName ||
                        video.owner?.username ||
                        'Unknown creator'}
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {formatViews(video.views)} views
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <AddVideosToPlaylistModal
        isOpen={isAddVideosOpen}
        onClose={() =>
          setIsAddVideosOpen(false)
        }
        playlistId={playlist._id}
        userId={currentUser?._id}
        existingVideoIds={existingVideoIds}
        onVideosAdded={handleVideosAdded}
      />

      {showUpdateForm && (
        <UpdatePlaylistForm
          key={playlist._id}
          playlist={playlist}
          onClose={() =>
            setShowUpdateForm(false)
          }
          onUpdated={handlePlaylistUpdated}
        />
      )}

      <ConfirmModal
        isOpen={isDeletePlaylistModalOpen}
        title="Delete playlist"
        description="Are you sure you want to permanently delete this playlist?"
        itemName={playlist.name}
        confirmText="Delete playlist"
        isLoading={isDeletingPlaylist}
        onConfirm={handleDeletePlaylist}
        onClose={() => {
          if (!isDeletingPlaylist) {
            setIsDeletePlaylistModalOpen(false)
          }
        }}
      />

      <ConfirmModal
        isOpen={Boolean(videoToRemove)}
        title="Remove video"
        description="Are you sure you want to remove this video from the playlist?"
        itemName={videoToRemove?.title}
        confirmText="Remove video"
        isLoading={
          removingVideoId === videoToRemove?._id
        }
        onConfirm={handleRemoveVideo}
        onClose={() => {
          if (!removingVideoId) {
            setVideoToRemove(null)
          }
        }}
      />
    </div>
  )
}

export default PlaylistPage