// Generic pulsing placeholder block. Pass a className to control size/shape
// e.g. <Skeleton className="h-40 w-full rounded-xl" />
function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-bg-hover)] ${className}`}
    />
  )
}

export default Skeleton