import { useCallback, useState } from 'react'
import { Bell, Compass, Loader2, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useFetch from '../hooks/useFetch.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import { getCurrentUser } from '../api/services/userService.js'
import {
  getSubscribedChannels,
  toggleSubscription,
} from '../api/services/subscriptionService.js'

function SubscriptionsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <Skeleton className="mt-6 h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

function SubscriptionsPage() {
  const [unsubscribingChannelId, setUnsubscribingChannelId] =
    useState(null)

  const fetchSubscriptions = useCallback(async () => {
    const currentUserResponse = await getCurrentUser()
    const currentUser =
      currentUserResponse?.data ?? currentUserResponse

    if (!currentUser?._id) {
      throw new Error('Current user information is unavailable')
    }

    return getSubscribedChannels(currentUser._id)
  }, [])

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchSubscriptions)

  const subscriptions = Array.isArray(data)
    ? data
    : data?.docs ?? data?.channels ?? []

  const validSubscriptions = subscriptions.filter(
    (subscription) => subscription?.channel?._id,
  )

  const handleUnsubscribe = async (channelId) => {
    try {
      setUnsubscribingChannelId(channelId)

      const response = await toggleSubscription(channelId)
      const result = response?.data ?? response

      if (result?.isSubscribed === true) {
        toast.error('Channel is still subscribed')
        return
      }

      await refetch()

      toast.success('Channel unsubscribed successfully')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Unable to unsubscribe from channel',
      )
    } finally {
      setUnsubscribingChannelId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-12">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>

        <SubscriptionsSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-red-500/30 bg-red-500/10 p-7">
        <h1 className="text-xl font-semibold">
          Unable to load subscriptions
        </h1>

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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/15" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary)] text-white shadow-lg">
              <Bell size={38} fill="currentColor" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Your channels
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Subscriptions
              </h1>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                You are subscribed to {validSubscriptions.length}{' '}
                {validSubscriptions.length === 1
                  ? 'channel'
                  : 'channels'}
                .
              </p>
            </div>
          </div>
        </div>
      </header>

      {validSubscriptions.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
            <Compass
              size={38}
              className="text-[var(--color-primary)]"
            />
          </div>

          <h2 className="mt-6 text-2xl font-semibold">
            No subscriptions yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-[var(--color-text-secondary)]">
            Subscribe to channels you enjoy, and they will appear here.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Compass size={18} />
            Discover videos
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {validSubscriptions.map((subscription) => {
            const channel = subscription.channel
            const isUnsubscribing =
              unsubscribingChannelId === channel._id

            return (
              <article
                key={subscription._id}
                className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <Link
                    to={`/channel/${channel.username}`}
                    className="shrink-0"
                  >
                    {channel.avatar ? (
                      <img
                        src={channel.avatar}
                        alt={channel.fullName || 'Channel avatar'}
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-[var(--color-primary)]"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface-secondary)]">
                        <UserRound
                          size={34}
                          className="text-[var(--color-text-secondary)]"
                        />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/channel/${channel.username}`}
                      className="block"
                    >
                      <h2 className="truncate text-lg font-semibold transition hover:text-[var(--color-primary)]">
                        {channel.fullName || 'Unknown channel'}
                      </h2>
                    </Link>

                    <p className="mt-1 truncate text-sm text-[var(--color-text-secondary)]">
                      @{channel.username || 'channel'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    to={`/channel/${channel.username}`}
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--color-surface-secondary)]"
                  >
                    View channel
                  </Link>

                  <button
                    type="button"
                    disabled={isUnsubscribing}
                    onClick={() => handleUnsubscribe(channel._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-surface-secondary)] px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUnsubscribing ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Removing
                      </>
                    ) : (
                      <>
                        <Bell size={16} />
                        Subscribed
                      </>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}

export default SubscriptionsPage