import { NavLink } from 'react-router-dom'
import { Home, Compass, Clock, ThumbsUp, LayoutDashboard, UploadCloud, Settings } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Subscriptions', to: '/subscriptions', icon: Compass },
  { label: 'History', to: '/history', icon: Clock },
  { label: 'Liked Videos', to: '/liked-videos', icon: ThumbsUp },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload', to: '/upload', icon: UploadCloud },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] p-2 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--color-bg-hover)] font-medium text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar