'use client'

import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency }    from '@/lib/format/currency'
import { formatDateShort }   from '@/lib/format/date'
import { formatMonthYear }   from '@/lib/format/date'
import type { DailySummary } from '@/types/domain'

interface Props {
  summary:  DailySummary[]
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
  const safeSummary = Array.isArray(summary) ? summary : []
  const totalExpense  = safeSummary.reduce((s, d) => s + d.total_expense, 0)
  const totalIncome   = safeSummary.reduce((s, d) => s + d.total_income,  0)
  const net           = totalIncome - totalExpense

  const chartData = safeSummary.map((d) => ({
    date:    formatDateShort(d.date),
    expense: d.total_expense,
    income:  d.total_income,
  }))

  return (
    <div className="space-y-4">
      {/* Month label */}
      <h2 className="text-sm text-ink-3 font-medium capitalize">
        {formatMonthYear(year, month)}
      </h2>

      {/* 3-card strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
          <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">Saldo neto</p>
          <p className={`font-serif text-2xl tracking-tight mt-1 ${net >= 0 ? 'text-emerald' : 'text-terra'}`}>
            {net >= 0 ? '+' : ''}{formatCurrency(net, currency)}
          </p>
          {/* Sparkline */}
          {chartData.length > 0 && (
            <div className="h-10 mt-3 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={1}>
                  <Bar dataKey="expense" fill="var(--terra)" radius={[2,2,0,0]} opacity={0.6} />
                  <Bar dataKey="income"  fill="var(--emerald)" radius={[2,2,0,0]} opacity={0.6} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}
                    labelStyle={{ color: 'var(--ink-3)' }}
                    formatter={(v: number) => formatCurrency(v, currency)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <StatCard
          label="Ingresos"
          value={totalIncome}
          currency={currency}
          accent="text-emerald"
          sub={`${safeSummary.filter((d) => d.total_income > 0).length} dias con ingreso`}
        />
        <StatCard
          label="Gastos"
          value={totalExpense}
          currency={currency}
          accent="text-terra"
          sub={`${safeSummary.reduce((s, d) => s + d.transaction_count, 0)} transacciones`}
        />
      </div>
    </div>
  )
}
