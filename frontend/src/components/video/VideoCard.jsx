import { Link } from 'react-router-dom'
import { formatDuration } from '../../utils/formatDuration.js'
import { formatViews } from '../../utils/formatViews.js'
import { formatTimeAgo } from '../../utils/formatTimeAgo.js'

function VideoCard({ video }) {
  const { _id, title, thumbnail, duration, views, createdAt, owner } = video

  return (
    <Link to={`/watch/${_id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--color-bg-secondary)]">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="flex gap-3">
        <img
          src={owner?.avatar}
          alt={owner?.username}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
            {owner?.fullName}
          </p>
          <p className="truncate text-xs text-[var(--color-text-secondary)]">
            {formatViews(views)} • {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard