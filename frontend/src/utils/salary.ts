import type { AdditionalEarningsValues, Cutoff, DtrRow, DtrRowWithHours, SalaryResult } from '@/types/dtr'
import { calculateDailyHours } from '@/utils/time'

export function parseAmount(value: string): number {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 ? amount : 0
}

export function enrichRowsWithHours(rows: DtrRow[]): DtrRowWithHours[] {
  return rows.map((row) => {
    const result = calculateDailyHours(row.timeIn, row.breakOut, row.breakIn, row.timeOut)
    return {
      ...row,
      hours: result.hours,
      hoursLabel: result.label,
      error: result.error,
    }
  })
}

export function sumAdditionalEarnings(values: AdditionalEarningsValues): number {
  return Object.values(values).reduce((total, value) => total + parseAmount(value), 0)
}

export function getDeductionRate(cutoff: Cutoff): number {
  return cutoff === '15th' ? 0.07 : 0.11
}

export function calculateSalary(
  rows: DtrRowWithHours[],
  hourlyRateInput: string,
  earnings: AdditionalEarningsValues,
  cutoff: Cutoff,
): SalaryResult {
  const totalHours = rows.reduce((total, row) => total + row.hours, 0)
  const hourlyRate = parseAmount(hourlyRateInput)
  const basePay = totalHours * hourlyRate
  const additionalEarnings = sumAdditionalEarnings(earnings)
  const grossPay = basePay + additionalEarnings
  const deductionRate = getDeductionRate(cutoff)
  const deduction = grossPay * deductionRate
  const netPay = grossPay - deduction

  return {
    totalHours,
    hourlyRate,
    basePay,
    additionalEarnings,
    grossPay,
    deductionRate,
    deduction,
    netPay,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(value)
}
