import { useEffect } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'

function ConfirmModal({
  isOpen,
  title = 'Confirm action',
  description = 'Are you sure you want to continue?',
  itemName = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]'

  const iconClass =
    variant === 'danger'
      ? 'bg-red-500/10 text-red-500'
      : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'

  const handleBackdropClick = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const handleModalClick = (event) => {
    event.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-2xl"
        onMouseDown={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
            >
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2
                id="confirm-modal-title"
                className="text-xl font-semibold text-[var(--color-text-primary)]"
              >
                {title}
              </h2>

              <p
                id="confirm-modal-description"
                className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]"
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close confirmation modal"
          >
            <X size={20} />
          </button>
        </div>

        {itemName && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Selected item
              </p>

              <p className="mt-1 line-clamp-2 font-medium text-[var(--color-text-primary)]">
                {itemName}
              </p>
            </div>
          </div>
        )}

        <div className="p-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmButtonClass}`}
            >
              {isLoading && <Loader2 size={17} className="animate-spin" />}

              {isLoading ? 'Please wait...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal