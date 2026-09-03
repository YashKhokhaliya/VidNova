import { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import * as commentService from '../../api/services/commentService.js'
import usePaginatedFetch from '../../hooks/usePaginatedFetch.js'
import CommentItem from './CommentItem.jsx'
import Skeleton from '../ui/Skeleton.jsx'

function CommentList({ videoId }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [page, setPage] = useState(1)

  // videoId is included in params so the hook refetches if the video changes
  const fetchComments = (params) =>
    commentService.getVideoComments(params.videoId, {
      page: params.page,
      limit: params.limit,
    })

  const { items: comments, pagination, isLoading, error, refetch } = usePaginatedFetch(
    fetchComments,
    { videoId, page, limit: 10 },
  )

  const handlePostComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsPosting(true)
    try {
      await commentService.addComment(videoId, newComment.trim())
      setNewComment('')
      setPage(1)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setIsPosting(false)
    }
  }

  const handleUpdateComment = async (commentId, content) => {
    try {
      await commentService.updateComment(commentId, content)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId)
      toast.success('Comment deleted')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-lg font-semibold">
        {pagination ? `${pagination.totalDocs} Comments` : 'Comments'}
      </h2>

      {isAuthenticated && (
        <form onSubmit={handlePostComment} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPosting || !newComment.trim()}
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            Post
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
          <button
            onClick={refetch}
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!pagination.hasPrevPage}
            className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm hover:bg-[var(--color-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
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

export default CommentList