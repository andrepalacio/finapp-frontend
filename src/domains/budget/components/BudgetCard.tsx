'use client'

import { useState }         from 'react'
import { formatCurrency }   from '@/lib/format/currency'
import { useBudget }        from '@/domains/budget/hooks/useBudget'
import { CategoryProgress } from './CategoryProgress'
import { BudgetForm }       from './BudgetForm'
import { cn }               from '@/lib/utils'

interface Props {
  workspaceId: string
  currency:    string
  year:        number
  month:       number
}

export function BudgetCard({ workspaceId, currency, year, month }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const { data: budget, isLoading } = useBudget(workspaceId, year, month)

  if (isLoading) {
    return (
      <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5 space-y-3">
        <div className="h-5 bg-surface-2 rounded animate-pulse w-1/3" />
        <div className="h-8 bg-surface-2 rounded animate-pulse w-1/2" />
      </div>
    )
  }

  if (!budget) {
    return (
      <div className="bg-surface rounded-[var(--r-lg)] border border-line px-6 py-10 text-center">
        <p className="text-ink-3 text-sm mb-3">Sin presupuesto para este mes</p>
        <button
          onClick={() => setFormOpen(true)}
          className="px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
        >
          Crear presupuesto
        </button>
        {formOpen && (
          <BudgetForm
            workspaceId={workspaceId}
            currency={currency}
            year={year}
            month={month}
            onClose={() => setFormOpen(false)}
          />
        )}
      </div>
    )
  }

  const pct     = budget.total_limit > 0
    ? Math.min((budget.total_spent / budget.total_limit) * 100, 100)
    : 0
  const isOver  = budget.total_spent > budget.total_limit

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink-3 font-medium">Presupuesto total</p>
            <p className="font-serif text-3xl tracking-tight text-ink mt-0.5">
              {formatCurrency(budget.total_limit, currency)}
            </p>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="text-xs text-ink-3 hover:text-ink border border-line px-2.5 py-1 rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
          >
            Editar
          </button>
        </div>

        {/* Total progress bar */}
        <div className="space-y-1.5">
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', isOver ? 'bg-terra' : pct > 80 ? 'bg-gold' : 'bg-emerald')}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-ink-3 tabular-nums">
            <span>Gastado: {formatCurrency(budget.total_spent, currency)}</span>
            <span className={isOver ? 'text-terra' : ''}>
              {isOver ? 'Excedido' : `Restante: ${formatCurrency(budget.remaining, currency)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Per-category */}
      {budget.categories.length > 0 && (
        <div className="bg-surface rounded-[var(--r-lg)] border border-line overflow-hidden">
          <p className="px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 border-b border-line bg-surface-2/50">
            Por categoria
          </p>
          <div className="divide-y divide-line/60">
            {budget.categories.map((cat) => (
              <CategoryProgress key={cat.category_id} category={cat} currency={currency} />
            ))}
          </div>
        </div>
      )}

      {formOpen && (
        <BudgetForm
          workspaceId={workspaceId}
          currency={currency}
          year={year}
          month={month}
          existing={budget}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  )
}
