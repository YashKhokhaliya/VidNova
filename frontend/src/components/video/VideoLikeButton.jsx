import { useState } from 'react'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { toggleVideoLike } from '../../api/services/likeService.js'

function VideoLikeButton({
  videoId,
  initialLikeCount = 0,
  initialIsLiked = false,
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isSubmitting, setIsSubmitting] = useState(false)



  const handleLikeToggle = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await toggleVideoLike(videoId)
      const newIsLiked = response.data.isLiked

      setIsLiked(newIsLiked)

      setLikeCount((currentCount) => {
        if (newIsLiked) {
          return currentCount + 1
        }

        return Math.max(currentCount - 1, 0)
      })

      toast.success(response.message)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to update like'

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLikeToggle}
      disabled={isSubmitting}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        isLiked
          ? 'bg-[var(--color-accent)] text-white'
          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
      } disabled:cursor-not-allowed disabled:opacity-60`}
      aria-label={isLiked ? 'Unlike video' : 'Like video'}
      aria-pressed={isLiked}
    >
      <Heart
        size={19}
        fill={isLiked ? 'currentColor' : 'none'}
      />

      <span>{likeCount}</span>
    </button>
  )
}

export default VideoLikeButton