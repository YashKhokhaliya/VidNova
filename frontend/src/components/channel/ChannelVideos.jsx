import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { getChannelVideos } from '../../api/services/channelService.js'
import useFetch from '../../hooks/useFetch.js'
import Skeleton from '../ui/Skeleton.jsx'
import { formatViews } from '../../utils/formatViews.js'
import { formatTimeAgo } from '../../utils/formatTimeAgo.js'

function ChannelVideos({ userId }) {
  const fetchVideos = useCallback(() => {
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

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="mt-3 h-5 w-4/5" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-sm text-[var(--color-danger)]">
          {error}
        </p>

        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center">
        <h2 className="font-semibold">
          No videos yet
        </h2>

        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          This channel has not uploaded any videos.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Link
          key={video._id}
          to={`/watch/${video._id}`}
          className="group min-w-0"
        >
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>

          <h3 className="mt-3 line-clamp-2 font-semibold leading-5 group-hover:text-[var(--color-accent)]">
            {video.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {formatViews(video.views)} views
            </span>

            <span>•</span>

            <span>
              {formatTimeAgo(video.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ChannelVideos