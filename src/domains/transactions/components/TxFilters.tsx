'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback }    from 'react'
import { useCategories }  from '@/domains/categories/hooks/useCategories'
import type { ListTransactionsParams } from '@/lib/api/endpoints/transactions'

interface Props {
  workspaceId: string
}

export function TxFilters({ workspaceId }: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const { data: cats } = useCategories(workspaceId)

  const type        = searchParams.get('type') ?? ''
  const categoryId  = searchParams.get('category_id') ?? ''
  const dateFrom    = searchParams.get('date_from') ?? ''
  const dateTo      = searchParams.get('date_to') ?? ''

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params}`)
  }, [router, pathname, searchParams])

  const hasFilters = type || categoryId || dateFrom || dateTo

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Type */}
      <select
        value={type}
        onChange={(e) => update('type', e.target.value)}
        className="px-2.5 py-1.5 text-xs bg-surface border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink transition-colors"
      >
        <option value="">Todos los tipos</option>
        <option value="expense">Gastos</option>
        <option value="income">Ingresos</option>
        <option value="transfer">Transferencias</option>
      </select>

      {/* Category */}
      <select
        value={categoryId}
        onChange={(e) => update('category_id', e.target.value)}
        className="px-2.5 py-1.5 text-xs bg-surface border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink transition-colors"
      >
        <option value="">Todas las categorias</option>
        {cats?.map((c) => (
          <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
        ))}
      </select>

      {/* Date from */}
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => update('date_from', e.target.value)}
        className="px-2.5 py-1.5 text-xs bg-surface border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink transition-colors"
      />

      {/* Date to */}
      <input
        type="date"
        value={dateTo}
        onChange={(e) => update('date_to', e.target.value)}
        className="px-2.5 py-1.5 text-xs bg-surface border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink transition-colors"
      />

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => router.replace(pathname)}
          className="px-2.5 py-1.5 text-xs text-ink-3 hover:text-terra transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}

export function filtersFromSearchParams(sp: URLSearchParams): ListTransactionsParams {
  const params: ListTransactionsParams = {}
  const type = sp.get('type')
  if (type) params.type = type
  const cat = sp.get('category_id')
  if (cat) params.category_id = cat
  const from = sp.get('date_from')
  if (from) params.date_from = from
  const to = sp.get('date_to')
  if (to) params.date_to = to
  return params
}
