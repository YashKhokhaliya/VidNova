import { useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Eye, Calendar } from 'lucide-react'
import { getVideoById } from '../api/services/videoService.js'
import useFetch from '../hooks/useFetch.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import CommentList from '../components/comment/CommentList.jsx'
import VideoLikeButton from '../components/video/VideoLikeButton.jsx'
import { formatViews } from '../utils/formatViews.js'
import { formatTimeAgo } from '../utils/formatTimeAgo.js'
import SubscribeButton from '../components/subscription/SubscribeButton.jsx'
import RecommendedVideos from '../components/video/RecommendedVideo.jsx'

function WatchPage() {
  const { videoId } = useParams()

  const fetchVideo = useCallback(() => {
    return getVideoById(videoId)
  }, [videoId])

  const {
    data: video,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchVideo)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="mt-4 h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium text-[var(--color-danger)]">
          {error}
        </p>

        <button
          type="button"
          onClick={refetch}
          className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-accent-hover)]"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium">Video not found</p>

        <Link
          to="/"
          className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-accent-hover)]"
        >
          Back to Home
        </Link>
      </div>
    )
  }

 return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
           <video
              src={video.videoFile}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
          />
          </div>

          <h1 className="mt-4 text-xl font-semibold">
            {video.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Eye size={16} />
                {formatViews(video.views)}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {formatTimeAgo(video.createdAt)}
              </span>
            </div>

            <VideoLikeButton
              videoId={video._id}
              initialLikeCount={video.likeCount ?? 0}
              initialIsLiked={video.isLiked ?? false}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--color-border)] py-5">
            <Link
              to={`/channel/${video.owner?.username}`}
              className="group flex min-w-0 items-center gap-3"
            >
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username || 'Channel avatar'}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-[var(--color-accent)]"
              />

              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]">
                  {video.owner?.fullName}
                </p>

                <p className="truncate text-sm text-[var(--color-text-secondary)]">
                  @{video.owner?.username}
                </p>
              </div>
            </Link>

            <SubscribeButton
              key={video.owner?._id}
              channelId={video.owner?._id}
              initialIsSubscribed={video.isSubscribed ?? false}
              initialSubscriberCount={video.subscriberCount ?? 0}
            />
          </div>

          <div className="mt-4 rounded-xl bg-[var(--color-bg-secondary)] p-4">
            <p className="whitespace-pre-wrap text-sm text-[var(--color-text-primary)]">
              {video.description}
            </p>
          </div>

          <CommentList videoId={video._id} />
        </main>

        <aside className="min-w-0">
          <RecommendedVideos currentVideoId={video._id} />
        </aside>
      </div>
    </div>
  )
}

export default WatchPage