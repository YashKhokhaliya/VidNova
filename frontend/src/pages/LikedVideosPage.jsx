import { useCallback, useState } from 'react'
import { Heart, Play, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useFetch from '../hooks/useFetch.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import {
  getLikedVideos,
  toggleVideoLike,
} from '../api/services/likeService.js'
import { formatTimeAgo } from '../utils/formatTimeAgo.js'

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
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function LikedVideosSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-[240px_1fr]"
        >
          <Skeleton className="aspect-video w-full rounded-xl" />

          <div className="space-y-3">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

function LikedVideosPage() {
  const [removingVideoId, setRemovingVideoId] = useState(null)

  const fetchLikedVideos = useCallback(() => {
    return getLikedVideos()
  }, [])

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchLikedVideos)

  const likedItems = Array.isArray(data)
    ? data
    : data?.docs ?? data?.likedVideos ?? []

  const validLikedItems = likedItems.filter((item) => item?.video?._id)

  const handleRemoveLike = async (videoId) => {
    try {
      setRemovingVideoId(videoId)

      const response = await toggleVideoLike(videoId)
      const result = response?.data ?? response

      if (result?.isLiked === true) {
        toast.error('Video is still liked')
        return
      }

      await refetch()
      toast.success('Video removed from liked videos')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to remove liked video',
      )
    } finally {
      setRemovingVideoId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-12">
        <div>
          <Skeleton className="h-10 w-56" />
          <Skeleton className="mt-3 h-5 w-80 max-w-full" />
        </div>

        <LikedVideosSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
        <h1 className="text-xl font-semibold">Unable to load liked videos</h1>

        <p className="mt-2 text-sm text-red-500">
          {typeof error === 'string'
            ? error
            : error?.message || 'Something went wrong'}
        </p>

        <button
          type="button"
          onClick={refetch}
          className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <header className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="relative p-7 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-pink-500/10" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500 text-white shadow-lg">
              <Heart size={38} fill="currentColor" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                Your collection
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Liked videos
              </h1>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                {validLikedItems.length}{' '}
                {validLikedItems.length === 1 ? 'video' : 'videos'} saved in
                your liked collection.
              </p>
            </div>
          </div>
        </div>
      </header>

      {validLikedItems.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
            <Heart size={36} className="text-red-500" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold">No liked videos yet</h2>

          <p className="mx-auto mt-2 max-w-md text-[var(--color-text-secondary)]">
            Videos you like will appear here so you can easily watch them
            again.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Play size={18} fill="currentColor" />
            Explore videos
          </Link>
        </section>
      ) : (
        <section className="space-y-5">
          {validLikedItems.map((item) => {
            const video = item.video
            const isRemoving = removingVideoId === video._id

            return (
              <article
                key={item._id}
                className="group grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:grid-cols-[260px_1fr]"
              >
                <Link
                  to={`/watch/${video._id}`}
                  className="relative block aspect-video overflow-hidden rounded-xl bg-[var(--color-surface-secondary)]"
                >
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Play
                        size={40}
                        className="text-[var(--color-text-secondary)]"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black">
                      <Play size={22} fill="currentColor" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                    {formatDuration(video.duration)}
                  </span>
                </Link>

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link to={`/watch/${video._id}`}>
                        <h2 className="line-clamp-2 text-lg font-semibold transition hover:text-[var(--color-primary)] sm:text-xl">
                          {video.title}
                        </h2>
                      </Link>

                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        {formatViews(video.views)} views
                        <span className="mx-2">•</span>
                        {formatTimeAgo(video.createdAt)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() => handleRemoveLike(video._id)}
                      aria-label={`Remove ${video.title} from liked videos`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-500/25 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2
                        size={17}
                        className={isRemoving ? 'animate-pulse' : ''}
                      />

                      <span className="hidden sm:inline">
                        {isRemoving ? 'Removing...' : 'Remove'}
                      </span>
                    </button>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      to={`/channel/${video.owner?.username}`}
                      className="shrink-0"
                    >
                      {video.owner?.avatar ? (
                        <img
                          src={video.owner.avatar}
                          alt={video.owner.fullName || 'Channel avatar'}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-secondary)] text-sm font-semibold">
                          {video.owner?.fullName?.charAt(0)?.toUpperCase() ||
                            'C'}
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0">
                      <Link
                        to={`/channel/${video.owner?.username}`}
                        className="block truncate text-sm font-medium transition hover:text-[var(--color-primary)]"
                      >
                        {video.owner?.fullName || 'Unknown channel'}
                      </Link>

                      <p className="truncate text-xs text-[var(--color-text-secondary)]">
                        @{video.owner?.username || 'channel'}
                      </p>
                    </div>
                  </div>

                  {video.description && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {video.description}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}

export default LikedVideosPage