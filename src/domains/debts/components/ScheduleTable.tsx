'use client'

import { useState }      from 'react'
import { useDebtSchedule } from '@/domains/debts/hooks/useDebts'
import { formatCurrency }  from '@/lib/format/currency'
import { formatDate }      from '@/lib/format/date'
import { cn }              from '@/lib/utils'
import { PaymentModal }    from './PaymentModal'
import type { DebtScheduleInstallment } from '@/types/domain'

interface Props {
  workspaceId: string
  debtId:      string
  currency:    string
}

export function ScheduleTable({ workspaceId, debtId, currency }: Props) {
  const { data: schedule, isLoading } = useDebtSchedule(workspaceId, debtId)
  const [paying, setPaying] = useState<DebtScheduleInstallment | null>(null)

  if (isLoading) {
    return (
      <div className="bg-surface rounded-[var(--r-lg)] border border-line overflow-hidden">
        <div className="px-4 py-3 border-b border-line bg-surface-2/50">
          <div className="h-3 bg-surface-2 rounded animate-pulse w-1/4" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-line/50 flex gap-4">
            {[1,2,3,4,5,6].map((j) => <div key={j} className="flex-1 h-3 bg-surface-2 rounded animate-pulse" />)}
          </div>
        ))}
      </div>
    )
  }

  if (!schedule?.length) return null

  const paid    = schedule.filter((r) => r.status === 'paid').length
  const total   = schedule.length

  return (
    <>
      <div className="bg-surface rounded-[var(--r-lg)] border border-line overflow-hidden">
        <div className="px-4 py-3 bg-surface-2/50 border-b border-line flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">
            Tabla de amortizacion
          </p>
          <span className="text-xs text-ink-3">{paid}/{total} pagadas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.06em] text-ink-4">
                <th className="px-4 py-2.5 text-left font-medium">#</th>
                <th className="px-4 py-2.5 text-left font-medium">Fecha</th>
                <th className="px-4 py-2.5 text-right font-medium">Cuota</th>
                <th className="px-4 py-2.5 text-right font-medium">Capital</th>
                <th className="px-4 py-2.5 text-right font-medium">Interes</th>
                <th className="px-4 py-2.5 text-right font-medium">Saldo</th>
                <th className="px-4 py-2.5 text-center font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {schedule.map((row) => (
                <tr
                  key={row.period}
                  onClick={() => row.status === 'pending' && setPaying(row)}
                  className={cn(
                    'transition-colors',
                    row.status === 'paid'    && 'opacity-50',
                    row.status === 'pending' && 'hover:bg-surface-2/60 cursor-pointer',
                  )}
                >
                  <td className="px-4 py-2.5 text-ink-3">{row.period}</td>
                  <td className="px-4 py-2.5 text-ink">{formatDate(row.due_date)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink">{formatCurrency(row.payment, currency)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink-3">{formatCurrency(row.principal, currency)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-terra">{formatCurrency(row.interest, currency)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink-3">{formatCurrency(row.balance, currency)}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.status === 'paid' ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] bg-emerald-bg text-emerald rounded-full font-medium">Pagada</span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[10px] bg-surface-2 text-ink-3 rounded-full font-medium">Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paying && (
        <PaymentModal
          workspaceId={workspaceId}
          debtId={debtId}
          installment={paying}
          onClose={() => setPaying(null)}
        />
      )}
    </>
  )
}
