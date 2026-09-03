import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Check,
  LoaderCircle,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { formatTimeAgo } from '../../utils/formatTimeAgo.js'
import ConfirmModal from '../ui/ConfirmModal.jsx'

function CommentItem({
  comment,
  onUpdate,
  onDelete,
}) {
  const { user } = useSelector((state) => state.auth)

  const isOwner =
    user?._id === comment.owner?._id

  const [isEditing, setIsEditing] =
    useState(false)

  const [editedContent, setEditedContent] =
    useState(comment.content)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false)

  const [isDeleting, setIsDeleting] =
    useState(false)

  const handleSaveEdit = async () => {
    const trimmedContent = editedContent.trim()

    if (
      !trimmedContent ||
      trimmedContent === comment.content
    ) {
      setIsEditing(false)
      setEditedContent(comment.content)
      return
    }

    try {
      setIsSubmitting(true)

      await onUpdate(
        comment._id,
        trimmedContent,
      )

      setIsEditing(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedContent(comment.content)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      await onDelete(comment._id)

      setIsDeleteModalOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <img
          src={comment.owner?.avatar}
          alt={
            comment.owner?.username ||
            'Comment author'
          }
          loading="lazy"
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">
              {comment.owner?.fullName ||
                'Unknown user'}
            </p>

            <p className="text-xs text-[var(--color-text-secondary)]">
              {formatTimeAgo(comment.createdAt)}
            </p>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(event) =>
                  setEditedContent(
                    event.target.value,
                  )
                }
                rows={2}
                autoFocus
                disabled={isSubmitting}
                className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Check size={14} />
                  )}

                  {isSubmitting
                    ? 'Saving...'
                    : 'Save'}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs transition hover:bg-[var(--color-bg-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[var(--color-text-primary)]">
              {comment.content}
            </p>
          )}

          {isOwner && !isEditing && (
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil size={12} />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsDeleteModalOpen(true)
                }
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] transition hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <LoaderCircle
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={12} />
                )}

                {isDeleting
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete comment"
        description="Are you sure you want to permanently delete this comment?"
        itemName={comment.content}
        confirmText="Delete comment"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false)
          }
        }}
      />
    </>
  )
}

export default CommentItem