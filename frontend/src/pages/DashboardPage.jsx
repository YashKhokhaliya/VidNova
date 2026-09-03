import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Heart,
  LoaderCircle,
  Pencil,
  PlaySquare,
  Trash2,
  Upload,
  Users,
  Video,
} from 'lucide-react'
import {
  getChannelStats,
  getChannelVideos,
} from '../api/services/dashboardService.js'
import useFetch from '../hooks/useFetch.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import UpdateVideoForm from '../components/dashboard/UpdateVideoForm.jsx'
import { deleteVideo, togglePublishStatus, } from '../api/services/videoService.js'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'

function formatNumber(value = 0) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0)
}

function DashboardPage() {
  const fetchStats = useCallback(() => {
    return getChannelStats()
  }, [])

  const fetchVideos = useCallback(() => {
    return getChannelVideos()
  }, [])

  const [selectedVideo, setSelectedVideo] =
  useState(null)

  const [deletingVideoId, setDeletingVideoId] =
  useState(null)

  const [videoToDelete, setVideoToDelete] =
    useState(null)

  const [togglingVideoId, setTogglingVideoId] =
  useState(null)

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useFetch(fetchStats)

  const {
    data: videosData,
    isLoading: areVideosLoading,
    error: videosError,
    refetch: refetchVideos,
  } = useFetch(fetchVideos)

  const videos = Array.isArray(videosData)
    ? videosData
    : videosData?.docs ??
      videosData?.videos ??
      []

  const statCards = [
    {
      title: 'Total videos',
      value: stats?.totalVideos ?? videos.length,
      icon: Video,
    },
    {
      title: 'Total views',
      value: stats?.totalViews ?? 0,
      icon: Eye,
    },
    {
      title: 'Subscribers',
      value: stats?.totalSubscribers ?? 0,
      icon: Users,
    },
    {
      title: 'Total likes',
      value: stats?.totalLikes ?? 0,
      icon: Heart,
    },
  ]

  const handleRetry = async () => {
    await Promise.all([
      refetchStats(),
      refetchVideos(),
    ])
  }

  const handleVideoUpdated = async () => {
    await Promise.all([
      refetchVideos(),
      refetchStats(),
    ])
  }

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return

    try {
      setDeletingVideoId(videoToDelete._id)

      const response = await deleteVideo(videoToDelete._id)

      toast.success(
        response.message ||
        'Video deleted successfully',
      )

      setVideoToDelete(null)

      await Promise.all([
        refetchVideos(),
        refetchStats(),
      ])
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Unable to delete video',
      )
    } finally {
      setDeletingVideoId(null)
    }
  }

  const handleTogglePublish = async (video) => {
    try {
      setTogglingVideoId(video._id)

      const response = await togglePublishStatus(
        video._id,
      )

      toast.success(
        response.message ||
          `Video ${
            video.isPublished
              ? 'unpublished'
              : 'published'
          } successfully`,
      )

      await Promise.all([
        refetchVideos(),
        refetchStats(),
      ])
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to change publish status',
      )
    } finally {
      setTogglingVideoId(null)
    }
  }

  if (statsError || videosError) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold text-red-400">
            Failed to load dashboard
          </h1>

          <p className="mt-2 text-sm text-red-300">
            {statsError || videosError}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Creator Studio
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Creator Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
            Track your channel performance and manage
            your uploaded videos.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <Upload size={18} />
          Upload video
        </Link>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isStatsLoading
          ? Array.from({ length: 4 }).map(
              (_, index) => (
                <Skeleton
                  key={index}
                  className="h-36 rounded-2xl"
                />
              ),
            )
          : statCards.map((stat) => {
              const Icon = stat.icon

              return (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {stat.title}
                      </p>

                      <p className="mt-3 text-3xl font-bold">
                        {formatNumber(stat.value)}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <Icon size={22} />
                    </div>
                  </div>
                </article>
              )
            })}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Your videos
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Manage all videos uploaded to your
              channel.
            </p>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)]">
            {videos.length} total
          </p>
        </div>

        {areVideosLoading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Skeleton
                  key={index}
                  className="h-28 rounded-2xl"
                />
              ),
            )}
          </div>
        ) : videos.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
            <PlaySquare
              size={48}
              className="mx-auto text-[var(--color-text-secondary)]"
            />

            <h3 className="mt-4 text-lg font-semibold">
              No videos uploaded
            </h3>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Upload your first video to start growing
              your channel.
            </p>

            <Link
              to="/upload"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Upload size={17} />
              Upload first video
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            {videos.map((video, index) => (
              <article
                key={video._id}
                className={`grid gap-4 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center ${
                  index !== videos.length - 1
                    ? 'border-b border-[var(--color-border)]'
                    : ''
                }`}
              >
                <Link
                  to={`/watch/${video._id}`}
                  className="relative block aspect-video overflow-hidden rounded-xl bg-black"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />

                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                    {video.isPublished
                      ? 'Published'
                      : 'Private'}
                  </span>
                </Link>

                <div className="min-w-0">
                  <Link
                    to={`/watch/${video._id}`}
                    className="font-semibold transition hover:text-[var(--color-primary)]"
                  >
                    <h3 className="line-clamp-2">
                      {video.title}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                    {video.description ||
                      'No description provided'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <Eye size={15} />
                      {formatNumber(video.views)} views
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Heart size={15} />
                      {formatNumber(
                        video.likeCount ??
                          video.likesCount ??
                          0,
                      )}{' '}
                      likes
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/watch/${video._id}`}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--color-bg-primary)]"
                  >
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedVideo(video)}
                    disabled={deletingVideoId === video._id}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--color-bg-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(video)}
                    disabled={
                      togglingVideoId === video._id ||
                      deletingVideoId === video._id
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--color-bg-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {togglingVideoId === video._id ? (
                      <>
                        <LoaderCircle
                          size={15}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : video.isPublished ? (
                      <>
                        <EyeOff size={15} />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye size={15} />
                        Publish
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoToDelete(video)}
                    disabled={deletingVideoId === video._id}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingVideoId === video._id ? (
                      <>
                        <LoaderCircle
                          size={15}
                          className="animate-spin"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={15} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

        {selectedVideo && (
        <UpdateVideoForm
          key={selectedVideo._id}
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onUpdated={handleVideoUpdated}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(videoToDelete)}
        title="Delete Video"
        description="Are you sure you want to permanently delete this video?"
        itemName={videoToDelete?.title}
        confirmText="Delete"
        isLoading={
          deletingVideoId === videoToDelete?._id
        }
        onConfirm={handleDeleteVideo}
        onClose={() => {
          if (!deletingVideoId) {
            setVideoToDelete(null)
          }
        }}
      />

    </div>
  )
}

export default DashboardPage