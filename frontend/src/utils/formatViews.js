// Converts a raw view count (e.g. 1234567) into a short readable form (e.g. "1.2M views")
export const formatViews = (views = 0) => {
  if (views < 1000) return `${views} views`
  if (views < 1_000_000) return `${(views / 1000).toFixed(1)}K views`
  return `${(views / 1_000_000).toFixed(1)}M views`
}