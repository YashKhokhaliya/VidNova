import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center shadow-xl sm:p-12">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <SearchX size={40} />
          </div>

          <p className="mt-8 text-7xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-8xl">
            404
          </p>

          <h1 className="mt-4 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base">
            The page you are looking for may have been removed, renamed, or
            does not exist.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-hover)]"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <Home size={18} />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFoundPage