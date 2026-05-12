import { formatDateShort }  from '@/lib/format/date'
import { AmountDisplay }    from '@/components/shared/AmountDisplay'
import type { Transaction } from '@/types/domain'
import type { Category }    from '@/types/domain'

interface Props {
  tx:         Transaction
  category?:  Category | null
  currency:   string
  onEdit?:    (tx: Transaction) => void
}

function CategoryBubble({ category }: { category?: Category | null }) {
  const initial = category?.name?.charAt(0).toUpperCase() ?? '#'
  const color   = category?.color ?? 'var(--surface-2)'
  const icon    = category?.icon

  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
      style={{ background: color || 'var(--surface-2)' }}
    >
      {icon ?? initial}
    </div>
  )
}

export function TxCard({ tx, category, currency, onEdit }: Props) {
  return (
    <button
      onClick={() => onEdit?.(tx)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2/60 transition-colors text-left group"
    >
      <CategoryBubble category={category} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink truncate">
          {tx.description ?? category?.name ?? 'Sin descripcion'}
        </p>
        <p className="text-[11px] text-ink-4 mt-0.5">
          {category?.name && tx.description ? category.name : formatDateShort(tx.date)}
        </p>
      </div>

      <AmountDisplay
        amount={tx.amount}
        currency={currency}
        type={tx.type}
        direction={tx.transfer_direction}
        className="text-sm"
      />
    </button>
  )
}
