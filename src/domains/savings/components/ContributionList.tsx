'use client'

import { useQuery }         from '@tanstack/react-query'
import { savings }          from '@/lib/api'
import { formatCurrency }   from '@/lib/format/currency'
import { formatDate }       from '@/lib/format/date'

interface Props {
  workspaceId: string
  goalId:      string
  currency:    string
}

export function ContributionList({ workspaceId, goalId, currency }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['savings', workspaceId, goalId, 'contributions'],
    queryFn:  () => savings.contributions.list(workspaceId, goalId),
    enabled:  !!workspaceId && !!goalId,
    retry:    false,
  })

  if (isLoading) {
    return (
      <div className="bg-surface rounded-[var(--r-lg)] border border-line p-4 space-y-2">
        {[1,2,3].map((i) => (
          <div key={i} className="flex justify-between animate-pulse">
            <div className="h-3 bg-surface-2 rounded w-24" />
            <div className="h-3 bg-surface-2 rounded w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (!data?.length) return null

  return (
    <div className="bg-surface rounded-[var(--r-lg)] border border-line overflow-hidden">
      <p className="px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 border-b border-line bg-surface-2/50">
        Historial de abonos
      </p>
      <div className="divide-y divide-line/60">
        {data.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm text-ink tabular-nums font-medium">
                {formatCurrency(c.amount, currency)}
              </p>
              {c.notes && <p className="text-[11px] text-ink-3 mt-0.5">{c.notes}</p>}
            </div>
            <p className="text-xs text-ink-4">{formatDate(c.contributed_at)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
