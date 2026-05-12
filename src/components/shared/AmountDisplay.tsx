import { cn }           from '@/lib/utils'
import { formatCurrency } from '@/lib/format/currency'
import type { TransactionType, TransferDirection } from '@/types/domain'

interface Props {
  amount:    number
  currency:  string
  type:      TransactionType
  direction?: TransferDirection | null
  className?: string
}

export function AmountDisplay({ amount, currency, type, direction, className }: Props) {
  const isPositive = type === 'income' || (type === 'transfer' && direction === 'in')
  const isNegative = type === 'expense' || (type === 'transfer' && direction === 'out')

  const prefix = isPositive ? '+' : isNegative ? '-' : ''

  return (
    <span
      className={cn(
        'tabular-nums font-medium',
        isPositive && 'text-emerald',
        isNegative && 'text-terra',
        !isPositive && !isNegative && 'text-ink-3',
        className,
      )}
    >
      {prefix}{formatCurrency(Math.abs(amount), currency)}
    </span>
  )
}
