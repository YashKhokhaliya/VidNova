import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListVideo, Plus } from 'lucide-react'
import { getUserPlaylists } from '../../api/services/playlistService.js'
import useFetch from '../../hooks/useFetch.js'
import Skeleton from '../ui/Skeleton.jsx'
import CreatePlaylistModal from '../playlist/CreatePlaylistModal.jsx'

function ChannelPlaylists({
  userId,
  canCreatePlaylist = false,
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false)

  const fetchPlaylists = useCallback(() => {
    return getUserPlaylists(userId)
  }, [userId])

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchPlaylists)

  const playlists = Array.isArray(data)
    ? data
    : data?.docs ?? data?.playlists ?? []

  const handlePlaylistCreated = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div>
        {canCreatePlaylist && (
          <div className="mb-6 flex justify-end">
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="mt-3 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
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
          className="mt-4 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Playlists
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {playlists.length}{' '}
            {playlists.length === 1
              ? 'playlist'
              : 'playlists'}
          </p>
        </div>

        {canCreatePlaylist && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            <Plus size={18} />
            New playlist
          </button>
        )}
      </div>

      {playlists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center">
          <ListVideo
            size={34}
            className="mx-auto text-[var(--color-text-secondary)]"
          />

          <h2 className="mt-3 font-semibold text-[var(--color-text-primary)]">
            No playlists yet
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {canCreatePlaylist
              ? 'Create your first playlist to organize your videos.'
              : 'This channel has not created any playlists.'}
          </p>

          {canCreatePlaylist && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              <Plus size={18} />
              Create playlist
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => {
            const videoCount =
              playlist.videos?.length ?? 0

            return (
              <Link
                key={playlist._id}
                to={`/playlist/${playlist._id}`}
                className="group min-w-0"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--color-bg-secondary)]">
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail}
                      alt={`${playlist.name} playlist thumbnail`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ListVideo
                        size={40}
                        className="text-[var(--color-text-secondary)]"
                      />
                    </div>
                  )}

                  <div className="absolute bottom-0 right-0 top-0 flex w-24 flex-col items-center justify-center gap-1 bg-black/70 text-white">
                    <ListVideo size={22} />

                    <span className="text-sm font-semibold">
                      {videoCount}
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 line-clamp-2 font-semibold leading-5 text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]">
                  {playlist.name}
                </h3>

                {playlist.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                    {playlist.description}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />
    </>
  )
}

export default ChannelPlaylists