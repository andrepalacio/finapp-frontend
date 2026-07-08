import Link             from 'next/link'
import { formatCurrency } from '@/lib/format/currency'
import { formatDate }     from '@/lib/format/date'
import type { Debt }      from '@/types/domain'

const RATE_LABELS: Record<string, string> = {
  effective_annual: 'EA',
  nominal_annual:   'NMV',
  monthly:          'MV',
}

function PencilIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

interface Props {
  debt:        Debt
  workspaceId: string
  currency:    string
  onEdit:      (debt: Debt) => void
}

export function DebtCard({ debt, workspaceId, currency, onEdit }: Props) {
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
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.08em] bg-surface-2 text-ink-3 px-2 py-1 rounded-full font-medium">
            {debt.installments} cuotas
          </span>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(debt) }}
            className="p-1.5 text-ink-4 hover:text-ink hover:bg-surface-2 rounded-[var(--r-sm)] transition-colors"
            aria-label="Editar deuda"
          >
            <PencilIcon />
          </button>
        </div>
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
            {debt.rate.toFixed(2)}% {RATE_LABELS[debt.rate_type] ?? ''}
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
