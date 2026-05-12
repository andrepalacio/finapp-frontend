'use client'

import { useState }         from 'react'
import { useTransactions }  from '@/domains/transactions/hooks/useTransactions'
import { useCategories }    from '@/domains/categories/hooks/useCategories'
import { TxCard }           from './TxCard'
import { formatDate }       from '@/lib/format/date'
import type { Transaction } from '@/types/domain'
import type { ListTransactionsParams } from '@/lib/api/endpoints/transactions'

interface Props {
  workspaceId: string
  currency:    string
  params?:     ListTransactionsParams
  onEdit?:     (tx: Transaction) => void
}

function groupByDate(txs: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>()
  for (const tx of txs) {
    const key = tx.date.slice(0, 10)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(tx)
  }
  return map
}

function TxSkeleton() {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-surface-2 animate-pulse shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-surface-2 rounded animate-pulse w-2/3" />
        <div className="h-2.5 bg-surface-2 rounded animate-pulse w-1/3" />
      </div>
      <div className="h-3.5 bg-surface-2 rounded animate-pulse w-20" />
    </div>
  )
}

export function TxList({ workspaceId, currency, params, onEdit }: Props) {
  const [cursor, setCursor] = useState<string | undefined>()

  const { data, isLoading, isFetching } = useTransactions(workspaceId, {
    ...params,
    limit:  30,
    cursor: cursor ?? undefined,
  })

  const { data: cats } = useCategories(workspaceId)
  const catMap = new Map(cats?.map((c) => [c.id, c]) ?? [])

  if (isLoading) {
    return (
      <div className="bg-surface rounded-[var(--r-lg)] border border-line overflow-hidden divide-y divide-line">
        {Array.from({ length: 8 }).map((_, i) => <TxSkeleton key={i} />)}
      </div>
    )
  }

  if (!data?.items.length) {
    return (
      <div className="bg-surface rounded-[var(--r-lg)] border border-line px-6 py-12 text-center">
        <p className="text-ink-3 text-sm">Sin transacciones</p>
        <p className="text-ink-4 text-xs mt-1">Agrega la primera usando el boton +</p>
      </div>
    )
  }

  const grouped = groupByDate(data.items)

  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([date, txs]) => (
        <div key={date} className="bg-surface rounded-[var(--r-lg)] border border-line overflow-hidden">
          {/* Date header */}
          <div className="px-4 py-2 bg-surface-2/50 border-b border-line">
            <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">
              {formatDate(date)}
            </p>
          </div>

          {/* Transactions */}
          <div className="divide-y divide-line/60">
            {txs.map((tx) => (
              <TxCard
                key={tx.id}
                tx={tx}
                category={tx.category_id ? catMap.get(tx.category_id) : null}
                currency={currency}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Load more */}
      {data.next_cursor && (
        <button
          onClick={() => setCursor(data.next_cursor ?? undefined)}
          disabled={isFetching}
          className="w-full py-2.5 text-sm text-ink-3 hover:text-ink transition-colors disabled:opacity-50"
        >
          {isFetching ? 'Cargando...' : 'Cargar mas'}
        </button>
      )}
    </div>
  )
}
