'use client'

import { useState }      from 'react'
import { useDebts }      from '@/domains/debts/hooks/useDebts'
import { DebtCard }      from './DebtCard'
import { DebtForm }      from './DebtForm'

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

export function DebtList({ workspaceId, currency }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const { data: debts, isLoading } = useDebts(workspaceId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Deudas</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.98] transition-all"
        >
          <PlusIcon />
          Nueva
        </button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-[var(--r-lg)] border border-line p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-surface-2 rounded w-1/3" />
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map((j) => <div key={j} className="h-8 bg-surface-2 rounded" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && debts?.length === 0 && (
        <div className="bg-surface rounded-[var(--r-lg)] border border-line px-6 py-12 text-center">
          <p className="text-ink-3 text-sm">Sin deudas registradas</p>
          <p className="text-ink-4 text-xs mt-1">Registra un credito o prestamo usando el boton +</p>
        </div>
      )}

      {debts?.map((d) => (
        <DebtCard key={d.id} debt={d} workspaceId={workspaceId} currency={currency} />
      ))}

      {formOpen && (
        <DebtForm
          workspaceId={workspaceId}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  )
}
