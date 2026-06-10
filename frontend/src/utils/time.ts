const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/

export function normalizeTime(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''

  const colonMatch = trimmed.match(/^(\d{1,2})[:.;](\d{1,2})$/)
  if (colonMatch) {
    const hours = colonMatch[1].padStart(2, '0')
    const minutes = colonMatch[2].padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const compactMatch = trimmed.match(/^(\d{1,2})(\d{2})$/)
  if (compactMatch) {
    return `${compactMatch[1].padStart(2, '0')}:${compactMatch[2]}`
  }

  return trimmed
}

export function timeToMinutes(value: string): number | null {
  const normalized = normalizeTime(value)
  const match = normalized.match(TIME_PATTERN)
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  return hours * 60 + minutes
}

export function formatHours(totalHours: number): string {
  if (!Number.isFinite(totalHours) || totalHours <= 0) return '0h 00m'

  const totalMinutes = Math.round(totalHours * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function calculateDailyHours(
  timeIn: string,
  breakOut: string,
  breakIn: string,
  timeOut: string,
): { hours: number; label: string; error?: string } {
  if (!timeIn && !breakOut && !breakIn && !timeOut) {
    return { hours: 0, label: '0h 00m' }
  }

  const start = timeToMinutes(timeIn)
  const lunchStart = timeToMinutes(breakOut)
  const lunchEnd = timeToMinutes(breakIn)
  const end = timeToMinutes(timeOut)

  if ([start, lunchStart, lunchEnd, end].some((value) => value === null)) {
    return { hours: 0, label: 'Invalid', error: 'Enter valid HH:MM times.' }
  }

  const firstHalf = lunchStart! - start!
  const secondHalf = end! - lunchEnd!

  if (firstHalf < 0 || secondHalf < 0) {
    return { hours: 0, label: 'Invalid', error: 'Time sequence is invalid.' }
  }

  const hours = (firstHalf + secondHalf) / 60
  return { hours, label: formatHours(hours) }
}
