import type { AdditionalEarningsValues, DtrRowWithHours } from '@/types/dtr'

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png']

export function validateImage(file: File): string | null {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a JPG, JPEG, or PNG image only.'
  }

  return null
}

export function validateHourlyRate(value: string): string | null {
  if (!value.trim()) return 'Hourly rate is required.'

  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return 'Hourly rate must be greater than zero.'

  return null
}

export function validateEarnings(values: AdditionalEarningsValues): Partial<Record<keyof AdditionalEarningsValues, string>> {
  return Object.entries(values).reduce<Partial<Record<keyof AdditionalEarningsValues, string>>>((errors, [key, value]) => {
    if (value.trim() && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
      errors[key as keyof AdditionalEarningsValues] = 'Enter a valid amount.'
    }

    return errors
  }, {})
}

export function validateRows(rows: DtrRowWithHours[]): string | null {
  if (rows.length === 0) return 'Upload DTR images or add at least one row.'

  const invalidRow = rows.find((row) => row.error)
  if (invalidRow) return 'Fix invalid time entries before calculating.'

  return null
}
