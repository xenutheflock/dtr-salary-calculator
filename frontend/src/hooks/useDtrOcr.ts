import { useCallback, useState } from 'react'
import { createWorker, type LoggerMessage } from 'tesseract.js'
import type { DtrRow, OcrUploadState, UploadSide } from '@/types/dtr'
import { parseDtrText } from '@/utils/ocrParser'

const initialUploadState: OcrUploadState = {
  status: 'idle',
  progress: 0,
}

export function useDtrOcr() {
  const [uploads, setUploads] = useState<Record<UploadSide, OcrUploadState>>({
    front: initialUploadState,
    back: initialUploadState,
  })

  const updateUpload = useCallback((side: UploadSide, update: Partial<OcrUploadState>) => {
    setUploads((current) => ({
      ...current,
      [side]: {
        ...current[side],
        ...update,
      },
    }))
  }, [])

  const recognize = useCallback(
    async (side: UploadSide, file: File): Promise<DtrRow[]> => {
      updateUpload(side, {
        fileName: file.name,
        status: 'processing',
        progress: 0,
        message: 'Preparing OCR...',
      })

      let worker: Awaited<ReturnType<typeof createWorker>> | null = null

      try {
        worker = await createWorker('eng', 1, {
          logger: (message: LoggerMessage) => {
            if (message.status) {
              updateUpload(side, {
                progress: Math.round((message.progress ?? 0) * 100),
                message: message.status,
              })
            }
          },
        })

        const result = await worker.recognize(file)
        const rows = parseDtrText(result.data.text)

        updateUpload(side, {
          status: 'success',
          progress: 100,
          message: rows.length > 0 ? `Extracted ${rows.length} row(s).` : 'OCR finished, but no DTR rows were detected.',
        })

        return rows
      } catch (error) {
        updateUpload(side, {
          status: 'error',
          progress: 0,
          message: error instanceof Error ? error.message : 'OCR failed. Please try another image.',
        })
        return []
      } finally {
        await worker?.terminate()
      }
    },
    [updateUpload],
  )

  const setUploadError = useCallback(
    (side: UploadSide, fileName: string | undefined, message: string) => {
      updateUpload(side, {
        fileName,
        status: 'error',
        progress: 0,
        message,
      })
    },
    [updateUpload],
  )

  return {
    uploads,
    recognize,
    setUploadError,
  }
}
