import type { Cutoff, SalaryResult } from '@/types/dtr'
import { formatCurrency } from '@/utils/salary'

interface SalaryResultsProps {
  result: SalaryResult | null
  cutoff: Cutoff
}

export default function SalaryResults({ result, cutoff }: SalaryResultsProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-medium text-white">Salary Summary</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Results will appear here after calculating.
        </p>
      </div>

      {result ? (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500">Total Hours</p>
              <p className="mt-1 text-xl font-mono text-white">{result.totalHours.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500">Net Pay</p>
              <p className="mt-1 text-xl font-mono text-emerald-400">{formatCurrency(result.netPay)}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">Total Hours × Hourly Rate</span>
              <span className="font-mono text-zinc-300">{result.totalHours.toFixed(2)} × {formatCurrency(result.hourlyRate)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">Base Pay</span>
              <span className="font-mono text-white">{formatCurrency(result.basePay)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">Additional Earnings</span>
              <span className="font-mono text-white">{formatCurrency(result.additionalEarnings)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">Gross Pay</span>
              <span className="font-mono text-white">{formatCurrency(result.grossPay)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">Deduction ({cutoff} cutoff × {(result.deductionRate * 100).toFixed(0)}%)</span>
              <span className="font-mono text-red-400">-{formatCurrency(result.deduction)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-zinc-300 font-medium">Net Pay</span>
              <span className="font-mono text-lg text-emerald-400">{formatCurrency(result.netPay)}</span>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
          <svg
            className="w-5 h-5 text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500">No results yet</p>
        <p className="mt-1 text-xs text-zinc-600 max-w-xs">
          Complete the steps above and click Calculate Salary to see your breakdown.
        </p>
      </div>
      )}
    </div>
  )
}
