'use client'

import { useRef, useState, useCallback } from 'react'
import { transactions as txApi } from '@/lib/api/endpoints/transactions'
import { ApiError } from '@/lib/api/client'
import type { ImportRowResult, ImportSummary } from '@/types/domain'

interface Props {
  workspaceId: string
  onImported?: () => void
}

type Phase = 'idle' | 'preview' | 'importing' | 'done'

function RowStatusBadge({ valid }: { valid: boolean }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${valid ? 'bg-emerald/10 text-emerald' : 'bg-terra/10 text-terra'}`}>
      {valid ? 'OK' : 'Error'}
    </span>
  )
}

export function XlsxImport({ workspaceId, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile]           = useState<File | null>(null)
  const [phase, setPhase]         = useState<Phase>('idle')
  const [preview, setPreview]     = useState<ImportSummary | null>(null)
  const [result, setResult]       = useState<ImportSummary | null>(null)
  const [error, setError]         = useState('')
  const [dragging, setDragging]   = useState(false)

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.endsWith('.xlsx')) {
      setError('Solo se aceptan archivos .xlsx')
      return
    }
    setError('')
    setFile(f)
    setPhase('preview')
    try {
      const summary = await txApi.import.upload(workspaceId, f, true)
      setPreview(summary)
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : 'Error al leer el archivo')
      setPhase('idle')
    }
  }, [workspaceId])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  async function confirmImport() {
    if (!file) return
    setPhase('importing')
    try {
      const summary = await txApi.import.upload(workspaceId, file, false)
      setResult(summary)
      setPhase('done')
      onImported?.()
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : 'Error al importar')
      setPhase('preview')
    }
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    setPhase('idle')
  }

  const validRows = preview?.rows.filter((r) => r.valid) ?? []
  const invalidRows = preview?.rows.filter((r) => !r.valid) ?? []

  return (
    <div className="space-y-4">
      {/* Download template */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-3">Descarga la plantilla, llenala y sube el archivo</p>
        <a
          href={txApi.import.templateUrl(workspaceId)}
          download
          className="text-xs text-ink border border-line px-2.5 py-1.5 rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
        >
          Descargar plantilla
        </a>
      </div>

      {/* Upload zone — only shown in idle */}
      {phase === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-[var(--r-lg)] p-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-ink bg-surface-2' : 'border-line hover:border-ink/30 hover:bg-surface-2/50'
          }`}
        >
          <p className="text-sm text-ink-3">Arrastra tu archivo .xlsx aqui</p>
          <p className="text-xs text-ink-4 mt-1">o haz clic para seleccionar</p>
          <input ref={inputRef} type="file" accept=".xlsx" onChange={onInputChange} className="hidden" />
        </div>
      )}

      {error && <p className="text-xs text-terra">{error}</p>}

      {/* Preview */}
      {phase === 'preview' && preview && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-3">{preview.total} filas</span>
            <span className="text-emerald">{validRows.length} validas</span>
            {invalidRows.length > 0 && <span className="text-terra">{invalidRows.length} con error</span>}
          </div>

          {/* Preview table — first 10 rows */}
          <div className="overflow-x-auto rounded-[var(--r-lg)] border border-line">
            <table className="w-full text-xs">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-3 py-2 text-left text-ink-3 font-medium w-8">#</th>
                  <th className="px-3 py-2 text-left text-ink-3 font-medium">Fecha</th>
                  <th className="px-3 py-2 text-left text-ink-3 font-medium">Descripcion</th>
                  <th className="px-3 py-2 text-right text-ink-3 font-medium">Monto</th>
                  <th className="px-3 py-2 text-left text-ink-3 font-medium">Tipo</th>
                  <th className="px-3 py-2 text-left text-ink-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 10).map((row: ImportRowResult) => (
                  <tr key={row.row} className={`border-t border-line ${!row.valid ? 'bg-terra/5' : ''}`}>
                    <td className="px-3 py-2 text-ink-4">{row.row}</td>
                    <td className="px-3 py-2 text-ink">{row.date ?? '-'}</td>
                    <td className="px-3 py-2 text-ink max-w-[160px] truncate">{row.description ?? '-'}</td>
                    <td className="px-3 py-2 text-right text-ink">{row.amount?.toLocaleString('es-CO') ?? '-'}</td>
                    <td className="px-3 py-2 text-ink">{row.type ?? '-'}</td>
                    <td className="px-3 py-2">
                      {row.valid ? <RowStatusBadge valid /> : (
                        <span className="text-terra text-[10px]">{row.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.rows.length > 10 && (
              <p className="text-center text-xs text-ink-4 py-2">
                +{preview.rows.length - 10} filas mas
              </p>
            )}
          </div>

          {validRows.length === 0 ? (
            <p className="text-sm text-terra">No hay filas validas para importar</p>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={confirmImport}
                className="px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
              >
                Importar {validRows.length} transacciones
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 text-sm text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
          {invalidRows.length > 0 && validRows.length > 0 && (
            <p className="text-xs text-ink-4">Las filas con error se omitiran</p>
          )}
        </div>
      )}

      {/* Importing */}
      {phase === 'importing' && (
        <div className="flex items-center gap-2 text-sm text-ink-3">
          <div className="w-4 h-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
          Importando...
        </div>
      )}

      {/* Done */}
      {phase === 'done' && result && (
        <div className="space-y-3">
          <div className="bg-emerald/5 border border-emerald/20 rounded-[var(--r-lg)] p-4 flex items-center gap-3">
            <span className="text-emerald text-lg">✓</span>
            <div>
              <p className="text-sm font-medium text-ink">Importacion completa</p>
              <p className="text-xs text-ink-3">{result.imported} importadas · {result.skipped} omitidas</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-xs text-ink-3 hover:text-ink transition-colors"
          >
            Importar otro archivo
          </button>
        </div>
      )}
    </div>
  )
}
