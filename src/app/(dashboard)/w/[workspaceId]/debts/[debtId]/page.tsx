import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { debts as debtsApi }            from '@/lib/api/endpoints/debts'
import { ScheduleTable }               from '@/domains/debts/components/ScheduleTable'
import { formatCurrency }              from '@/lib/format/currency'
import { formatDate }                  from '@/lib/format/date'
import Link                            from 'next/link'

interface Props {
  params: Promise<{ workspaceId: string; debtId: string }>
}

export default async function DebtDetailPage({ params }: Props) {
  const { workspaceId, debtId } = await params

  let currency = 'COP'
  let debtName = 'Deuda'
  let principal = 0

  try {
    const [list, debt] = await Promise.all([
      workspacesApi.list(),
      debtsApi.get(workspaceId, debtId),
    ])
    currency  = list.find((w) => w.id === workspaceId)?.currency ?? currency
    debtName  = debt.name
    principal = debt.principal
  } catch { /* fallback */ }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/w/${workspaceId}/debts`}
          className="text-xs text-ink-3 hover:text-ink transition-colors flex items-center gap-1 mb-3"
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Deudas
        </Link>
        <h1 className="page-title">{debtName}</h1>
        <p className="text-ink-3 text-sm mt-1 tabular-nums">
          Capital: {formatCurrency(principal, currency)}
        </p>
      </div>

      <ScheduleTable workspaceId={workspaceId} debtId={debtId} currency={currency} />
    </div>
  )
}
