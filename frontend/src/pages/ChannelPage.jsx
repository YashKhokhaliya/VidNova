import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Calendar, Video } from 'lucide-react'

import { getChannelProfile } from '../api/services/channelService.js'
import useFetch from '../hooks/useFetch.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import SubscribeButton from '../components/subscription/SubscribeButton.jsx'
import { formatTimeAgo } from '../utils/formatTimeAgo.js'
import ChannelVideos from '../components/channel/ChannelVideos.jsx'
import ChannelPlaylists from '../components/channel/ChannelPlaylists.jsx'

function ChannelPage() {
  const { username } = useParams()

  const [activeTab, setActiveTab] = useState('videos')

  const currentUser = useSelector(
    (state) => state.auth.user,
  )

  const fetchChannel = useCallback(() => {
    return getChannelProfile(username)
  }, [username])

  const {
    data: channel,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchChannel)

  /*
    This handles different possible Redux structures:

    userData = {
      _id,
      username
    }

    userData = {
      data: {
        _id,
        username
      }
    }

    userData = {
      user: {
        _id,
        username
      }
    }

    userData = {
      data: {
        user: {
          _id,
          username
        }
      }
    }
  */

 

  
  const isOwnChannel =
  Boolean(currentUser?._id && channel?._id) &&
  String(currentUser._id) === String(channel._id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-48 w-full rounded-2xl" />

        <div className="mt-6 flex items-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full" />

          <div className="flex-1">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="mt-3 h-4 w-36" />
            <Skeleton className="mt-3 h-4 w-64" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-[var(--color-danger)]">
          {error}
        </p>

        <button
          type="button"
          onClick={refetch}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)]">
          Channel not found
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="h-40 overflow-hidden rounded-2xl bg-[var(--color-bg-secondary)] sm:h-52 md:h-64">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt={`${channel.fullName} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-bg-secondary)]" />
        )}
      </div>

      <section className="relative px-4 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <img
              src={channel.avatar}
              alt={channel.username}
              className="h-24 w-24 rounded-full border-4 border-[var(--color-bg-primary)] object-cover sm:h-32 sm:w-32"
            />

            <div className="pb-1">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
                {channel.fullName}
              </h1>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                @{channel.username}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                <span>
                  {channel.subscribersCount ?? 0}{' '}
                  {(channel.subscribersCount ?? 0) === 1
                    ? 'subscriber'
                    : 'subscribers'}
                </span>

                <span className="flex items-center gap-1.5">
                  <Video size={16} />
                  Channel
                </span>

                {channel.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    Joined {formatTimeAgo(channel.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isOwnChannel && (
            <div className="pb-1">
              <SubscribeButton
                key={channel._id}
                channelId={channel._id}
                initialIsSubscribed={
                  channel.isSubscribed ?? false
                }
                initialSubscriberCount={
                  channel.subscribersCount ?? 0
                }
              />
            </div>
          )}
        </div>

        {channel.description && (
          <p className="mt-6 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-secondary)]">
            {channel.description}
          </p>
        )}
      </section>

      <div className="border-b border-[var(--color-border)]">
        <nav className="flex gap-7 overflow-x-auto px-4 sm:px-8">
          {['videos', 'playlists', 'about'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 py-4 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() +
                tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <section className="px-4 py-8 sm:px-8">
        {activeTab === 'videos' && (
          <ChannelVideos userId={channel._id} />
        )}

        {activeTab === 'playlists' && (
          <ChannelPlaylists
            userId={channel._id}
            canCreatePlaylist={isOwnChannel}
          />
        )}

        {activeTab === 'about' && (
          <div className="rounded-xl bg-[var(--color-bg-secondary)] p-6">
            <h2 className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">
              About
            </h2>

            <p className="whitespace-pre-wrap text-[var(--color-text-secondary)]">
              {channel.description ||
                'No description available.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default ChannelPage