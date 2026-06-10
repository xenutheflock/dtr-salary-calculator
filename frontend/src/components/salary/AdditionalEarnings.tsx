import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SectionCard from '@/components/shared/SectionCard'

const fields = [
  { id: 'transport', label: 'Transportation Allowance' },
  { id: 'legal-holiday', label: 'Legal Holiday Pay' },
  { id: 'special-holiday', label: 'Special Holiday Pay' },
  { id: 'night-diff', label: 'Night Differential' },
  { id: 'other', label: 'Other Earnings' },
]

export default function AdditionalEarnings() {
  return (
    <SectionCard
      step={5}
      title="Additional Earnings"
      description="Optional. Leave blank if not applicable."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.id}>
            <Label
              htmlFor={field.id}
              className="text-xs text-zinc-400 mb-2 block"
            >
              {field.label}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">
                ₱
              </span>
              <Input
                id={field.id}
                type="number"
                placeholder="0.00"
                className="pl-7 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-white/20 font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}