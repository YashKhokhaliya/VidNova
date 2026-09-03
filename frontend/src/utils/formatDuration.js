// Converts seconds (e.g. 754) into "H:MM:SS" or "M:SS" format (e.g. "12:34")
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0) return '0:00'

  const seconds = Math.floor(totalSeconds % 60)
  const minutes = Math.floor((totalSeconds / 60) % 60)
  const hours = Math.floor(totalSeconds / 3600)

  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours > 0) {
    const paddedMinutes = String(minutes).padStart(2, '0')
    return `${hours}:${paddedMinutes}:${paddedSeconds}`
  }

  return `${minutes}:${paddedSeconds}`
}