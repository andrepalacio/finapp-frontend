'use client'

import { useState }          from 'react'
import { useSavingsGoals }   from '@/domains/savings/hooks/useSavings'
import { GoalCard }          from './GoalCard'
import { GoalForm }          from './GoalForm'
import { PlusIcon }          from '@/components/shared/icons'
import { EmptyState }        from '@/components/shared/EmptyState'

interface Props {
  workspaceId: string
  currency:    string
  canWrite?:   boolean
}

export function GoalList({ workspaceId, currency, canWrite = true }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const { data: goals, isLoading } = useSavingsGoals(workspaceId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Metas de ahorro</h1>
        {canWrite && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.98] transition-all"
          >
            <PlusIcon />
            Nueva
          </button>
        )}
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
        <EmptyState
          title="Sin metas de ahorro registradas"
          actionLabel={canWrite ? 'Crear meta' : undefined}
          onAction={() => setFormOpen(true)}
        />
      )}

      {goals?.map((goal) => (
        <GoalCard key={goal.id} goal={goal} workspaceId={workspaceId} currency={currency} canWrite={canWrite} />
      ))}

      {canWrite && formOpen && (
        <GoalForm workspaceId={workspaceId} onClose={() => setFormOpen(false)} />
      )}
    </div>
  )
}
