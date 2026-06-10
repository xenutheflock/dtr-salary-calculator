import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SectionCard from '@/components/shared/SectionCard'

export default function HourlyRateInput() {
  return (
    <SectionCard
      step={1}
      title="Hourly Rate"
      description="Enter your hourly rate in Philippine Peso."
    >
      <div className="max-w-xs">
        <Label htmlFor="hourly-rate" className="text-xs text-zinc-400 mb-2 block">
          Rate per hour (₱)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">
            ₱
          </span>
          <Input
            id="hourly-rate"
            type="number"
            placeholder="0.00"
            className="pl-7 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-white/20 font-mono"
          />
        </div>
      </div>
    </SectionCard>
  )
}