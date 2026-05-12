'use client'

import { useState }              from 'react'
import { useSearchParams }       from 'next/navigation'
import { TxList }                from './TxList'
import { TxModal }               from './TxModal'
import { TxFilters, filtersFromSearchParams } from './TxFilters'
import { XlsxImport }           from './XlsxImport'
import type { Transaction }      from '@/types/domain'

interface Props {
  workspaceId: string
  currency:    string
}

function PlusIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

export function TxPageClient({ workspaceId, currency }: Props) {
  const searchParams               = useSearchParams()
  const [modalOpen, setModalOpen]  = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing]      = useState<Transaction | null>(null)
  const [importKey, setImportKey]  = useState(0)

  const filters = filtersFromSearchParams(searchParams)

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(tx: Transaction) {
    setEditing(tx)
    setModalOpen(true)
  }

  function handleImported() {
    setImportKey((k) => k + 1)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-title">Transacciones</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
          >
            <UploadIcon />
            Importar
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.98] transition-all"
          >
            <PlusIcon />
            Nueva
          </button>
        </div>
      </div>

      {/* Import panel */}
      {importOpen && (
        <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink">Importar desde Excel</p>
            <button onClick={() => setImportOpen(false)} className="text-xs text-ink-3 hover:text-ink">Cerrar</button>
          </div>
          <XlsxImport workspaceId={workspaceId} onImported={handleImported} />
        </div>
      )}

      {/* Filters */}
      <TxFilters workspaceId={workspaceId} />

      {/* List */}
      <TxList
        key={importKey}
        workspaceId={workspaceId}
        currency={currency}
        params={filters}
        onEdit={openEdit}
      />

      {/* Modal */}
      <TxModal
        workspaceId={workspaceId}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        editing={editing}
      />
    </div>
  )
}
