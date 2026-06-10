import SectionCard from '@/components/shared/SectionCard'

const options = [
  {
    value: '15th',
    label: '15th Cutoff',
    deduction: '7%',
    description: 'Mid-month payroll',
  },
  {
    value: '30th',
    label: '30th Cutoff',
    deduction: '11%',
    description: 'End-of-month payroll',
  },
]

export default function CutoffSelector() {
  return (
    <SectionCard
      step={4}
      title="Payroll Cutoff"
      description="Select which cutoff period this DTR covers. The deduction rate changes based on the cutoff."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            className="group relative flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                {option.label}
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                -{option.deduction}
              </span>
            </div>
            <span className="text-xs text-zinc-500">{option.description}</span>
          </button>
        ))}
      </div>
    </SectionCard>
  )
}