import { useCallback } from 'react'
import { Clock, RefreshCw } from 'lucide-react'

import { getWatchHistory } from '../api/services/userService.js'
import useFetch from '../hooks/useFetch.js'
import VideoGrid from '../components/video/VideoGrid.jsx'

function HistoryPage() {
  const fetchWatchHistory = useCallback(() => {
    return getWatchHistory()
  }, [])

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchWatchHistory)

  const videos = Array.isArray(data)
    ? data
    : data?.watchHistory ?? data?.videos ?? []

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <Clock className="h-7 w-7 text-red-400" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Could not load watch history
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15">
          <Clock className="h-6 w-6 text-[var(--color-accent)]" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Watch history
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Videos you have recently watched.
          </p>
        </div>
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage="Your watch history is empty"
      />
    </div>
  )
}

export default HistoryPage