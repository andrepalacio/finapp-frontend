'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback }    from 'react'
import { useCategories }  from '@/domains/categories/hooks/useCategories'
import { DatePicker }     from '@/components/shared/DatePicker'
import { Select }         from '@/components/shared/Select'
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
      <Select
        value={type}
        onChange={(v) => update('type', v)}
        clearable
        placeholder="Todos los tipos"
        options={[
          { value: 'expense',  label: 'Gastos' },
          { value: 'income',   label: 'Ingresos' },
          { value: 'transfer', label: 'Transferencias' },
        ]}
      />

      {/* Category */}
      <Select
        value={categoryId}
        onChange={(v) => update('category_id', v)}
        clearable
        placeholder="Todas las categorias"
        options={cats?.map((c) => ({ value: c.id, label: `${c.icon ? c.icon + ' ' : ''}${c.name}` })) ?? []}
      />

      {/* Date from */}
      <DatePicker
        value={dateFrom}
        onChange={(v) => update('date_from', v)}
        placeholder="Desde"
      />

      {/* Date to */}
      <DatePicker
        value={dateTo}
        onChange={(v) => update('date_to', v)}
        placeholder="Hasta"
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
