import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
  UploadCloud,
  CheckCircle2,
  CircleAlert,
  ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../../features/auth/authSlice.js'

function Navbar({ onToggleSidebar }) {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth,
  )

  const {
    isUploading,
    progress,
    fileName,
    status,
  } = useSelector((state) => state.upload)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()

    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery) {
      navigate(`/?q=${encodeURIComponent(trimmedQuery)}`)
    } else {
      navigate('/')
    }

    setIsMobileSearchOpen(false)
  }

  const handleLogout = async () => {
    const result = await dispatch(logout())

    setIsMenuOpen(false)

    if (logout.fulfilled.match(result)) {
      toast.success('Logged out successfully')
      navigate('/login')
    } else {
      toast.error(result.payload || 'Logout failed')
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4">
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-50 flex items-center gap-2 bg-[var(--color-bg-primary)] px-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-hover)]"
            aria-label="Close search"
          >
            <ArrowLeft size={20} />
          </button>

          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center"
          >
            <div className="flex w-full items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search videos"
                autoFocus
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none"
              />

              <button
                type="submit"
                className="text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                aria-label="Search videos"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-full p-2 hover:bg-[var(--color-bg-hover)] lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <Link
          to="/"
          className="text-lg font-semibold tracking-tight"
        >
          Vid
          <span className="text-[var(--color-accent)]">
            Nova
          </span>
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="hidden max-w-xl flex-1 items-center md:flex"
      >
        <div className="flex w-full items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-1.5">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search videos"
            className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none"
          />

          <button
            type="submit"
            className="text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
            aria-label="Search videos"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-hover)] md:hidden"
          aria-label="Open search"
        >
          <Search size={20} />
        </button>

        {status === 'uploading' && (
          <Link
            to="/upload"
            className="hidden min-w-44 max-w-56 items-center gap-3 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 transition hover:bg-purple-500/15 sm:flex"
            title={fileName}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
              <UploadCloud className="h-4 w-4 text-purple-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-medium text-[var(--color-text-primary)]">
                  Uploading
                </p>

                <span className="text-xs font-semibold text-purple-400">
                  {progress}%
                </span>
              </div>

              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </Link>
        )}

        {status === 'success' && (
          <Link
            to="/upload"
            className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-400 transition hover:bg-green-500/15 sm:flex"
          >
            <CheckCircle2 className="h-4 w-4" />
            Uploaded
          </Link>
        )}

        {status === 'error' && (
          <Link
            to="/upload"
            className="hidden items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-500/15 sm:flex"
          >
            <CircleAlert className="h-4 w-4" />
            Upload failed
          </Link>
        )}

        {isUploading && (
          <Link
            to="/upload"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 sm:hidden"
            aria-label={`Uploading video ${progress}%`}
          >
            <UploadCloud className="h-4 w-4 text-purple-400" />
          </Link>
        )}

        {isAuthenticated && user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen((previous) => !previous)
              }
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] py-1 pl-1 pr-2 hover:bg-[var(--color-bg-hover)]"
              aria-label="Account menu"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="h-7 w-7 rounded-full object-cover"
              />

              <ChevronDown
                size={16}
                className="text-[var(--color-text-secondary)]"
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-48 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-2 shadow-lg">
                <div className="border-b border-[var(--color-border)] px-4 py-2">
                  <p className="truncate text-sm font-medium">
                    {user.fullName}
                  </p>

                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    @{user.username}
                  </p>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-bg-hover)]"
                >
                  <Settings size={16} />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-bg-hover)]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm hover:bg-[var(--color-bg-hover)]"
          >
            <User size={18} />
            <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar