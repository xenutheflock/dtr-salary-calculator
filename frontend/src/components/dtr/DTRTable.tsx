import SectionCard from '@/components/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { DtrRow, DtrRowWithHours } from '@/types/dtr'

interface DTRTableProps {
  rows: DtrRowWithHours[]
  onAddRow: () => void
  onRemoveRow: (id: string) => void
  onUpdateRow: (id: string, field: keyof Omit<DtrRow, 'id'>, value: string) => void
}

const fields: Array<{ key: keyof Omit<DtrRow, 'id'>; label: string; placeholder: string }> = [
  { key: 'timeIn', label: 'Time In', placeholder: '09:56' },
  { key: 'breakOut', label: 'Break Out', placeholder: '13:03' },
  { key: 'breakIn', label: 'Break In', placeholder: '14:02' },
  { key: 'timeOut', label: 'Time Out', placeholder: '17:00' },
]

export default function DTRTable({ rows, onAddRow, onRemoveRow, onUpdateRow }: DTRTableProps) {
  return (
    <SectionCard
      step={3}
      title="Review Extracted Entries"
      description="OCR results appear here. Every cell is editable — correct any mistakes before calculating."
    >
      {rows.length === 0 ? (
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
              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75h1.5"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500">No entries yet</p>
        <p className="mt-1 text-xs text-zinc-600 max-w-xs">
          Upload your DTR images above and entries will appear here automatically.
        </p>
        <Button type="button" variant="outline" onClick={onAddRow} className="mt-4 border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]">
          Add row manually
        </Button>
      </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="hidden grid-cols-[repeat(4,1fr)_0.8fr_auto] gap-1 sm:grid">
              {fields.map((field) => (
                <span key={field.key} className="px-1 text-[9px] font-mono uppercase tracking-wide text-zinc-600">
                  {field.label}
                </span>
              ))}
              <span className="px-1 text-[9px] font-mono uppercase tracking-wide text-zinc-600">Hours</span>
              <span className="px-1 text-[9px] font-mono uppercase tracking-wide text-zinc-600">Remove</span>
            </div>

            {rows.map((row, rowIndex) => (
              <div key={row.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(4,1fr)_0.8fr_auto] sm:items-start sm:gap-1">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="mb-1 block text-[9px] font-mono uppercase tracking-wide text-zinc-600 sm:hidden">
                        {field.label}
                      </label>
                      <Input
                        value={row[field.key]}
                        placeholder={field.placeholder}
                        onChange={(event) => onUpdateRow(row.id, field.key, event.target.value)}
                        className="h-8 px-2 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-700 focus:border-white/20 font-mono text-xs"
                      />
                    </div>
                  ))}

                  <div>
                    <span className="mb-1 block text-[9px] font-mono uppercase tracking-wide text-zinc-600 sm:hidden">
                      Hours
                    </span>
                    <div className="flex min-h-8 items-center rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 text-[11px] font-mono">
                      <span className={row.error ? 'text-red-400' : 'text-zinc-400'}>{row.hoursLabel}</span>
                    </div>
                    {row.error && <p className="mt-1 text-[10px] text-red-400">{row.error}</p>}
                  </div>

                  <div className="flex items-end justify-end sm:items-center">
                    <button
                      type="button"
                      aria-label={`Remove row ${rowIndex + 1}`}
                      onClick={() => onRemoveRow(row.id)}
                      className="h-8 rounded-lg border border-red-400/20 bg-red-400/10 px-2 text-[11px] font-medium text-red-300 transition-colors hover:bg-red-400/20 hover:text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={onAddRow} className="border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]">
            Add row
          </Button>
        </div>
      )}
    </SectionCard>
  )
}
