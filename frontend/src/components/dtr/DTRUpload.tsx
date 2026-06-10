import { useRef } from 'react'
import SectionCard from '@/components/shared/SectionCard'
import type { OcrUploadState, UploadSide } from '@/types/dtr'

interface UploadBoxProps {
  label: string
  side: 'Front' | 'Back'
  state: OcrUploadState
  onUpload: (file: File) => void
}

function UploadBox({ label, side, state, onUpload }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isProcessing = state.status === 'processing'

  return (
    <div
      onClick={() => !isProcessing && inputRef.current?.click()}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-8 cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04] min-h-[160px]"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        disabled={isProcessing}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(file)
          event.target.value = ''
        }}
      />

      {/* Upload icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:border-white/20 transition-colors">
        <svg
          className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
          {label}
        </p>
        <p className="mt-1 text-xs text-zinc-600">
          Click to upload — JPG, JPEG, PNG
        </p>
        {state.fileName && (
          <p className="mt-2 text-[10px] text-zinc-500 truncate max-w-[180px]">
            {state.fileName}
          </p>
        )}
        {state.status !== 'idle' && (
          <p className={`mt-2 text-xs ${state.status === 'error' ? 'text-red-400' : state.status === 'success' ? 'text-emerald-400' : 'text-zinc-400'}`}>
            {state.message ?? state.status}
            {isProcessing ? ` ${state.progress}%` : ''}
          </p>
        )}
      </div>

      {/* Side badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[10px] font-mono text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
          {side}
        </span>
      </div>
    </div>
  )
}

interface DTRUploadProps {
  uploads: Record<UploadSide, OcrUploadState>
  onUpload: (side: UploadSide, file: File) => void
}

export default function DTRUpload({ uploads, onUpload }: DTRUploadProps) {
  return (
    <SectionCard
      step={2}
      title="Upload DTR Images"
      description="Upload the front and back of your Daily Time Record. OCR will extract your schedule automatically."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UploadBox label="Front of DTR" side="Front" state={uploads.front} onUpload={(file) => onUpload('front', file)} />
        <UploadBox label="Back of DTR" side="Back" state={uploads.back} onUpload={(file) => onUpload('back', file)} />
      </div>
    </SectionCard>
  )
}
