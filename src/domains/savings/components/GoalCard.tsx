'use client'

import { useState }         from 'react'
import Link                 from 'next/link'
import { ProgressRing }     from './ProgressRing'
import { ContributionForm } from './ContributionForm'
import { formatCurrency }   from '@/lib/format/currency'
import { formatDate }       from '@/lib/format/date'
import type { SavingsGoalProgress } from '@/types/domain'

interface Props {
  goal:        SavingsGoalProgress
  workspaceId: string
  currency:    string
  showDetail?: boolean
}

export function GoalCard({ goal, workspaceId, currency, showDetail = false }: Props) {
  const [contributing, setContributing] = useState(false)
  const pct = goal.progress_pct

  const ringColor = pct >= 100 ? 'var(--emerald)' : pct > 60 ? 'var(--gold)' : 'var(--emerald)'

  return (
    <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
      <div className="flex items-start gap-4">
        {/* Ring */}
        <div className="relative shrink-0">
          <ProgressRing pct={pct} size={72} stroke={5} color={ringColor} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-medium tabular-nums text-ink">
              {Math.round(pct)}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {showDetail ? (
            <h3 className="font-medium text-ink text-base">{goal.name}</h3>
          ) : (
            <Link
              href={`/w/${workspaceId}/savings/${goal.id}`}
              className="font-medium text-ink text-base hover:text-ink-2 transition-colors"
            >
              {goal.name}
            </Link>
          )}

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm tabular-nums font-medium text-ink">
              {formatCurrency(goal.total_contributed, currency)}
            </span>
            <span className="text-xs text-ink-4">
              de {formatCurrency(goal.target_amount, currency)}
            </span>
          </div>

          {goal.deadline && (
            <p className="text-[11px] text-ink-3 mt-1">
              Meta: {formatDate(goal.deadline)}
            </p>
          )}
        </div>

        <button
          onClick={() => setContributing(true)}
          className="shrink-0 px-3 py-1.5 text-xs font-medium border border-line text-ink rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
        >
          + Abonar
        </button>
      </div>

      {goal.remaining > 0 && (
        <p className="text-[11px] text-ink-3 mt-3 pl-[88px]">
          Faltan {formatCurrency(goal.remaining, currency)}
        </p>
      )}

      {contributing && (
        <ContributionForm
          workspaceId={workspaceId}
          goalId={goal.id}
          onClose={() => setContributing(false)}
        />
      )}
    </div>
  )
}
