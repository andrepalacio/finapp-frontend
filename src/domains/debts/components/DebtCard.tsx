import Link             from 'next/link'
import { formatCurrency } from '@/lib/format/currency'
import { formatDate }     from '@/lib/format/date'
import type { Debt }      from '@/types/domain'

const RATE_LABELS: Record<string, string> = {
  effective_annual: 'EA',
  nominal_annual:   'NMV',
  monthly:          'MV',
}

interface Props {
  debt:        Debt
  workspaceId: string
  currency:    string
}

export function DebtCard({ debt, workspaceId, currency }: Props) {
  return (
    <Link
      href={`/w/${workspaceId}/debts/${debt.id}`}
      className="block bg-surface rounded-[var(--r-lg)] border border-line p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-ink text-base">{debt.name}</h3>
          {debt.lender && (
            <p className="text-xs text-ink-3 mt-0.5">{debt.lender}</p>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-[0.08em] bg-surface-2 text-ink-3 px-2 py-1 rounded-full font-medium">
          {debt.installments} cuotas
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.06em] text-ink-4 mb-0.5">Capital</p>
          <p className="text-sm tabular-nums font-medium text-ink">
            {formatCurrency(debt.principal, currency)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.06em] text-ink-4 mb-0.5">Tasa</p>
          <p className="text-sm tabular-nums font-medium text-ink">
            {(debt.rate * 100).toFixed(2)}% {RATE_LABELS[debt.rate_type] ?? ''}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.06em] text-ink-4 mb-0.5">Inicio</p>
          <p className="text-sm text-ink">{formatDate(debt.first_payment_date)}</p>
        </div>
      </div>
    </Link>
  )
}
