import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllVideos } from '../../api/services/videoService.js'
import useFetch from '../../hooks/useFetch.js'
import Skeleton from '../ui/Skeleton.jsx'
import { formatViews } from '../../utils/formatViews.js'
import { formatTimeAgo } from '../../utils/formatTimeAgo.js'

function RecommendedVideos({ currentVideoId }) {
  const fetchRecommendedVideos = useCallback(() => {
    return getAllVideos({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortType: 'desc',
    })
  }, [])

  const {
    data,
    isLoading,
    error,
  } = useFetch(fetchRecommendedVideos)

  /*
    This supports common backend response structures:

    data.docs
    data.videos
    data as a direct array
  */
  const videos = Array.isArray(data)
    ? data
    : data?.docs ?? data?.videos ?? []

  const recommendedVideos = videos
    .filter((video) => video._id !== currentVideoId)
    .slice(0, 8)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-3"
          >
            <Skeleton className="aspect-video w-40 shrink-0 rounded-lg" />

            <div className="flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-[var(--color-danger)]">
        Could not load recommended videos.
      </p>
    )
  }

  if (recommendedVideos.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        No recommended videos available.
      </p>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
        Recommended videos
      </h2>

      <div className="space-y-4">
        {recommendedVideos.map((recommendedVideo) => (
          <Link
            key={recommendedVideo._id}
            to={`/watch/${recommendedVideo._id}`}
            className="group flex gap-3"
          >
            <div className="aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-black">
              <img
                src={recommendedVideo.thumbnail}
                alt={recommendedVideo.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
                {recommendedVideo.title}
              </h3>

              <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                {recommendedVideo.owner?.fullName ||
                  recommendedVideo.owner?.username ||
                  'Unknown channel'}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                <span>
                  {formatViews(recommendedVideo.views)} views
                </span>

                <span>•</span>

                <span>
                  {formatTimeAgo(recommendedVideo.createdAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecommendedVideos