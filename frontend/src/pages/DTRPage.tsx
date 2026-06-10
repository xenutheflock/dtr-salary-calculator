import { useMemo, useState } from 'react'
import HourlyRateInput from '@/components/dtr/HourlyRateInput'
import DTRUpload from '@/components/dtr/DTRUpload'
import DTRTable from '@/components/dtr/DTRTable'
import CutoffSelector from '@/components/salary/CutoffSelector'
import AdditionalEarnings from '@/components/salary/AdditionalEarnings'
import SalaryResults from '@/components/salary/SalaryResults'
import { Button } from '@/components/ui/button'
import { useDtrOcr } from '@/hooks/useDtrOcr'
import type { AdditionalEarningsValues, Cutoff, DtrRow, UploadSide } from '@/types/dtr'
import { calculateSalary, enrichRowsWithHours } from '@/utils/salary'
import { validateEarnings, validateHourlyRate, validateImage, validateRows } from '@/utils/validation'

const initialEarnings: AdditionalEarningsValues = {
  transport: '',
  legalHoliday: '',
  specialHoliday: '',
  nightDiff: '',
  other: '',
}

function createEmptyRow(): DtrRow {
  return {
    id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: '',
    timeIn: '',
    breakOut: '',
    breakIn: '',
    timeOut: '',
  }
}

export default function DTRPage() {
  const [hourlyRate, setHourlyRate] = useState('')
  const [rows, setRows] = useState<DtrRow[]>([])
  const [cutoff, setCutoff] = useState<Cutoff>('15th')
  const [earnings, setEarnings] = useState<AdditionalEarningsValues>(initialEarnings)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { uploads, recognize, setUploadError } = useDtrOcr()

  const rowsWithHours = useMemo(() => enrichRowsWithHours(rows), [rows])
  const salaryResult = useMemo(
    () => calculateSalary(rowsWithHours, hourlyRate, earnings, cutoff),
    [rowsWithHours, hourlyRate, earnings, cutoff],
  )
  const earningsErrors = useMemo(() => validateEarnings(earnings), [earnings])
  const hourlyRateError = hasCalculated ? validateHourlyRate(hourlyRate) : null

  const handleUpload = async (side: UploadSide, file: File) => {
    setFormError(null)

    const uploadError = validateImage(file)
    if (uploadError) {
      setUploadError(side, file.name, uploadError)
      return
    }

    const extractedRows = await recognize(side, file)
    if (extractedRows.length > 0) {
      setRows((current) => [...current, ...extractedRows])
      setHasCalculated(false)
    }
  }

  const updateRow = (id: string, field: keyof Omit<DtrRow, 'id'>, value: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    )
    setHasCalculated(false)
  }

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id))
    setHasCalculated(false)
  }

  const addRow = () => {
    setRows((current) => [...current, createEmptyRow()])
    setHasCalculated(false)
  }

  const handleCalculate = () => {
    const rowError = validateRows(rowsWithHours)
    const rateError = validateHourlyRate(hourlyRate)
    const hasEarningsError = Object.keys(earningsErrors).length > 0

    setHasCalculated(true)

    if (rateError || rowError || hasEarningsError) {
      setFormError(rateError ?? rowError ?? 'Fix invalid additional earnings before calculating.')
      return
    }

    setFormError(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle gradient at top */}
      <div className="fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/10 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-zinc-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-white tracking-tight">
              DTR Calculator
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 bg-white/[0.03] px-2 py-1 rounded-full border border-white/[0.06]">
            v1.0
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 py-10">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Salary Calculator
          </h1>
          <p className="mt-2 text-xs text-zinc-600">
            Estimates only. Actual deductions may vary.
          </p>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            Upload your DTR, review the extracted entries, and get your estimated net pay.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          <HourlyRateInput value={hourlyRate} onChange={setHourlyRate} error={hourlyRateError} />
          <DTRUpload uploads={uploads} onUpload={handleUpload} />
          <DTRTable rows={rowsWithHours} onAddRow={addRow} onRemoveRow={removeRow} onUpdateRow={updateRow} />
          <CutoffSelector value={cutoff} onChange={setCutoff} />
          <AdditionalEarnings values={earnings} errors={earningsErrors} onChange={setEarnings} />
        </div>

        {/* Calculate button */}
        <div className="mt-6">
          <Button
            size="lg"
            onClick={handleCalculate}
            className="w-full bg-white text-black hover:bg-zinc-100 font-medium transition-all duration-200 rounded-xl h-12 text-sm"
          >
            Calculate Salary
          </Button>
          {formError && <p className="mt-3 text-xs text-red-400 text-center">{formError}</p>}
        </div>

        {/* Results */}
        <div className="mt-6">
          <SalaryResults result={hasCalculated && !formError ? salaryResult : null} cutoff={cutoff} />
        </div>

      </main>
    </div>
  )
}
