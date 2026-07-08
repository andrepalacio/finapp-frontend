import { Suspense }                    from 'react'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { SummaryStrip }               from '@/domains/transactions/components/SummaryStrip'
import Link                           from 'next/link'
import type { WorkspaceSummary }      from '@/types/domain'

interface Props {
  params: Promise<{ workspaceId: string }>
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function WorkspaceDashboardPage({ params }: Props) {
  const { workspaceId } = await params

  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() + 1

  const monthStart = toISODate(new Date(year, month - 1, 1))
  const monthEnd   = toISODate(new Date(year, month, 0))

  let currency = 'COP'
  let summary: WorkspaceSummary = { income_total: 0, income_count: 0, expense_total: 0, expense_count: 0 }

  try {
    const [ws, sum] = await Promise.all([
      workspacesApi.get(workspaceId),
      workspacesApi.summary(workspaceId, { date_from: monthStart, date_to: monthEnd }),
    ])
    currency = ws.currency
    summary  = sum
  } catch { /* fallback */ }

  return (
    <div className="space-y-8">
      <Suspense>
        <SummaryStrip
          summary={summary}
          currency={currency}
          year={year}
          month={month}
        />
      </Suspense>


      {/* Quick nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: 'transactions', label: 'Transacciones', emoji: '📋' },
          { href: 'budget',       label: 'Presupuesto',   emoji: '📊' },
          { href: 'savings',      label: 'Metas',         emoji: '🎯' },
          { href: 'debts',        label: 'Deudas',        emoji: '💳' },
        ].map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={`/w/${workspaceId}/${href}`}
            className="bg-surface rounded-[var(--r-lg)] border border-line p-4 text-center hover:shadow-[var(--shadow-md)] transition-shadow"
          >
            <span className="text-2xl">{emoji}</span>
            <p className="text-xs text-ink-3 mt-2 font-medium">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
