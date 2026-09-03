import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'

import { getAllVideos } from '../api/services/videoService.js'
import usePaginatedFetch from '../hooks/usePaginatedFetch.js'
import VideoGrid from '../components/video/VideoGrid.jsx'

const sortOptions = [
  {
    label: 'Newest',
    sortBy: 'createdAt',
    sortType: 'desc',
  },
  {
    label: 'Oldest',
    sortBy: 'createdAt',
    sortType: 'asc',
  },
  {
    label: 'Most Viewed',
    sortBy: 'views',
    sortType: 'desc',
  },
]

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery = searchParams.get('q')?.trim() || ''

  const [page, setPage] = useState(1)
  const [sortIndex, setSortIndex] = useState(0)

  const { sortBy, sortType } = sortOptions[sortIndex]

  const {
    items: videos,
    pagination,
    isLoading,
    error,
    refetch,
  } = usePaginatedFetch(getAllVideos, {
    page,
    limit: 12,
    sortBy,
    sortType,
    query: searchQuery || undefined,
  })

  const handleSortChange = (index) => {
    setSortIndex(index)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchParams({})
    setPage(1)
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

  return (
    <div>
      {searchQuery && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
              <Search
                size={18}
                className="text-[var(--color-accent)]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Search results for
              </p>

              <p className="truncate font-semibold text-[var(--color-text-primary)]">
                “{searchQuery}”
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearSearch}
            className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm transition hover:bg-[var(--color-bg-hover)]"
          >
            <X size={16} />
            Clear search
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {sortOptions.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleSortChange(index)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              index === sortIndex
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage={
          searchQuery
            ? `No videos found for "${searchQuery}"`
            : 'No videos yet'
        }
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((previous) => previous - 1)}
            disabled={!pagination.hasPrevPage}
            className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm hover:bg-[var(--color-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-[var(--color-text-secondary)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((previous) => previous + 1)}
            disabled={!pagination.hasNextPage}
            className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm hover:bg-[var(--color-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage