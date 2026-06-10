interface SectionCardProps {
  title: string
  description?: string
  children: React.ReactNode
  step: number
}

export default function SectionCard({
  title,
  description,
  children,
  step,
}: SectionCardProps) {
  return (
    <div className="relative border border-white/[0.06] rounded-2xl bg-white/[0.02] p-6 md:p-8">
      {/* Step badge */}
      <div className="absolute -top-3 left-6">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-400">
          {step}
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-white tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  )
}