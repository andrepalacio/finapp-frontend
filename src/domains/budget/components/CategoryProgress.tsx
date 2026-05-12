import { formatCurrency } from '@/lib/format/currency'
import { cn }             from '@/lib/utils'
import type { BudgetCategory } from '@/types/domain'

interface Props {
  category: BudgetCategory
  currency: string
}

export function CategoryProgress({ category, currency }: Props) {
  const spent     = category.spent ?? 0
  const limit     = category.limit_amount
  const pct       = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const isOver    = spent > limit

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-ink">{category.category_name}</span>
        <div className="text-right">
          <span className={cn('text-sm tabular-nums font-medium', isOver ? 'text-terra' : 'text-ink')}>
            {formatCurrency(spent, currency)}
          </span>
          <span className="text-ink-4 text-xs"> / {formatCurrency(limit, currency)}</span>
        </div>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', isOver ? 'bg-terra' : 'bg-emerald')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isOver && (
        <p className="text-[10px] text-terra mt-1">
          +{formatCurrency(spent - limit, currency)} sobre el limite
        </p>
      )}
    </div>
  )
}
