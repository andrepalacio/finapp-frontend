import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { BudgetCard }                  from '@/domains/budget/components/BudgetCard'
import { formatMonthYear }             from '@/lib/format/date'

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function BudgetPage({ params }: Props) {
  const { workspaceId } = await params

  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() + 1

  let currency = 'COP'
  try {
    const list = await workspacesApi.list()
    currency = list.find((w) => w.id === workspaceId)?.currency ?? currency
  } catch { /* fallback */ }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <h1 className="page-title">Presupuesto</h1>
        <span className="text-sm text-ink-3 capitalize">{formatMonthYear(year, month)}</span>
      </div>
      <BudgetCard
        workspaceId={workspaceId}
        currency={currency}
        year={year}
        month={month}
      />
    </div>
  )
}
