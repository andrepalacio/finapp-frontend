'use client'

import { useState }          from 'react'
import { useSavingsGoals }   from '@/domains/savings/hooks/useSavings'
import { GoalCard }          from './GoalCard'
import { GoalForm }          from './GoalForm'

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

export function GoalList({ workspaceId, currency }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const { data: goals, isLoading } = useSavingsGoals(workspaceId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Metas de ahorro</h1>
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
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface rounded-[var(--r-lg)] border border-line p-5 flex gap-4 animate-pulse">
              <div className="w-[72px] h-[72px] rounded-full bg-surface-2 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-surface-2 rounded w-1/3" />
                <div className="h-3 bg-surface-2 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && goals?.length === 0 && (
        <div className="bg-surface rounded-[var(--r-lg)] border border-line px-6 py-10 text-center">
          <p className="text-ink-3 text-sm mb-3">Sin metas de ahorro registradas</p>
          <button
            onClick={() => setFormOpen(true)}
            className="px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
          >
            Crear meta
          </button>
        </div>
      )}

      {goals?.map((goal) => (
        <GoalCard key={goal.id} goal={goal} workspaceId={workspaceId} currency={currency} />
      ))}

      {formOpen && (
        <GoalForm workspaceId={workspaceId} onClose={() => setFormOpen(false)} />
      )}
    </div>
  )
}
