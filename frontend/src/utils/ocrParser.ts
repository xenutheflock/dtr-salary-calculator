import type { DtrRow } from '@/types/dtr'
import { normalizeTime } from '@/utils/time'

const MONTH_PATTERN = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*'
const DATE_PATTERN = new RegExp(`\\b(${MONTH_PATTERN}\\s*\\d{1,2}|\\d{1,2}[/-]\\d{1,2}(?:[/-]\\d{2,4})?)\\b`, 'i')
const TIME_PATTERN = /\b(?:[01]?\d|2[0-3])\s*[:.;]?\s*\d{2}\b/g

function normalizeDate(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function createId(index: number): string {
  return `ocr-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`
}

function extractTimeLikeValues(text: string): string[] {
  return [...text.matchAll(TIME_PATTERN)]
    .map((match) => normalizeTime(match[0].replace(/\s+/g, '')))
    .filter(Boolean)
}

function groupTimesIntoRows(times: string[], dates: string[]): DtrRow[] {
  const rows: DtrRow[] = []

  for (let index = 0; index < times.length; index += 4) {
    const group = times.slice(index, index + 4)
    if (group.length < 4) break

    rows.push({
      id: createId(index / 4),
      date: dates[index / 4] ?? '',
      timeIn: group[0],
      breakOut: group[1],
      breakIn: group[2],
      timeOut: group[3],
    })
  }

  return rows
}

export function parseDtrText(text: string): DtrRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/[|]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const lineRows = lines
    .map((line, index) => {
      const date = line.match(DATE_PATTERN)?.[1] ?? ''
      const times = extractTimeLikeValues(line)

      if (times.length < 4) return null

      return {
        id: createId(index),
        date: date ? normalizeDate(date) : '',
        timeIn: times[0],
        breakOut: times[1],
        breakIn: times[2],
        timeOut: times[3],
      } satisfies DtrRow
    })
    .filter((row): row is DtrRow => row !== null)

  if (lineRows.length > 0) return lineRows

  const allTimes = extractTimeLikeValues(lines.join(' '))
  const dates = lines
    .map((line) => line.match(DATE_PATTERN)?.[1])
    .filter((date): date is string => Boolean(date))
    .map(normalizeDate)

  return groupTimesIntoRows(allTimes, dates)
}
