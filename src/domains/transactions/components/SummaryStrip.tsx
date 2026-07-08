'use client'

import { formatCurrency }      from '@/lib/format/currency'
import { formatMonthYear }     from '@/lib/format/date'
import type { WorkspaceSummary } from '@/types/domain'

interface Props {
  summary:  WorkspaceSummary
  currency: string
  year:     number
  month:    number
}

function StatCard({
  label, value, sub, currency, accent,
}: {
  label: string; value: number; sub?: string; currency: string; accent?: string
}) {
  return (
    <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
      <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">{label}</p>
      <p className={`font-serif text-2xl tracking-tight mt-1 ${accent ?? 'text-ink'}`}>
        {formatCurrency(value, currency)}
      </p>
      {sub && <p className="text-xs text-ink-3 mt-1">{sub}</p>}
    </div>
  )
}

export function SummaryStrip({ summary, currency, year, month }: Props) {
  const net = summary.income_total - summary.expense_total

  return (
    <div className="space-y-4">
      <h2 className="text-sm text-ink-3 font-medium capitalize">
        {formatMonthYear(year, month)}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Net */}
        <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">Saldo neto</p>
          <p className={`font-serif text-2xl tracking-tight mt-1 ${net >= 0 ? 'text-emerald' : 'text-terra'}`}>
            {net >= 0 ? '+' : ''}{formatCurrency(net, currency)}
          </p>
          <p className="text-xs text-ink-3 mt-1">
            {summary.income_count + summary.expense_count} transacciones
          </p>
        </div>

        <StatCard
          label="Ingresos"
          value={summary.income_total}
          currency={currency}
          accent="text-emerald"
          sub={`${summary.income_count} registro${summary.income_count !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Gastos"
          value={summary.expense_total}
          currency={currency}
          accent="text-terra"
          sub={`${summary.expense_count} registro${summary.expense_count !== 1 ? 's' : ''}`}
        />
      </div>
    </div>
  )
}
