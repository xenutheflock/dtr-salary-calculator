export type UploadSide = 'front' | 'back'

export type Cutoff = '15th' | '30th'

export type OcrStatus = 'idle' | 'processing' | 'success' | 'error'

export interface DtrRow {
  id: string
  date: string
  timeIn: string
  breakOut: string
  breakIn: string
  timeOut: string
}

export interface DtrRowWithHours extends DtrRow {
  hours: number
  hoursLabel: string
  error?: string
}

export interface AdditionalEarningsValues {
  transport: string
  legalHoliday: string
  specialHoliday: string
  nightDiff: string
  other: string
}

export interface OcrUploadState {
  fileName?: string
  status: OcrStatus
  progress: number
  message?: string
}

export interface SalaryResult {
  totalHours: number
  hourlyRate: number
  basePay: number
  additionalEarnings: number
  grossPay: number
  deductionRate: number
  deduction: number
  netPay: number
}
