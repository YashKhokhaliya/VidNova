import { useState } from 'react'
import { Bell, BellRing, LoaderCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { toggleSubscription } from '../../api/services/subscriptionService.js'

function SubscribeButton({
  channelId,
  initialIsSubscribed = false,
  initialSubscriberCount = 0,
}) {
  const [isSubscribed, setIsSubscribed] = useState(
    initialIsSubscribed,
  )

  const [subscriberCount, setSubscriberCount] = useState(
    initialSubscriberCount,
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscriptionToggle = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await toggleSubscription(channelId)
      const newIsSubscribed = response.data.isSubscribed

      setIsSubscribed(newIsSubscribed)

      setSubscriberCount((currentCount) => {
        if (newIsSubscribed) {
          return currentCount + 1
        }

        return Math.max(currentCount - 1, 0)
      })

      toast.success(response.message)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to update subscription'

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-medium text-[var(--color-text-secondary)]">
          {subscriberCount.toLocaleString()} subscribers
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubscriptionToggle}
        disabled={isSubmitting}
        aria-pressed={isSubscribed}
        className={`group flex min-w-32 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
          isSubscribed
            ? 'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
            : 'bg-[var(--color-accent)] text-white shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)]'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isSubmitting ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : isSubscribed ? (
          <BellRing size={18} />
        ) : (
          <Bell size={18} />
        )}

        <span>
          {isSubmitting
            ? 'Please wait'
            : isSubscribed
              ? 'Subscribed'
              : 'Subscribe'}
        </span>
      </button>
    </div>
  )
}

export default SubscribeButton