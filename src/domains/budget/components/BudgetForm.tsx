'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver }           from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCategories }    from '@/domains/categories/hooks/useCategories'
import { useUpsertBudget }  from '@/domains/budget/hooks/useBudget'
import { upsertBudgetSchema, type UpsertBudgetInput } from '@/domains/budget/schemas'
import { formatCurrency }   from '@/lib/format/currency'
import { ApiError }         from '@/lib/api/client'
import type { Budget }      from '@/types/domain'

interface Props {
  workspaceId: string
  currency:    string
  year:        number
  month:       number
  existing?:   Budget | null
  onClose:     () => void
}

export function BudgetForm({ workspaceId, currency, year, month, existing, onClose }: Props) {
  const { data: cats }  = useCategories(workspaceId)
  const upsert          = useUpsertBudget(workspaceId)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpsertBudgetInput>({
    resolver:      zodResolver(upsertBudgetSchema),
    defaultValues: {
      year,
      month,
      total_limit: existing?.total_limit ?? 0,
      categories:  existing?.categories.map((c) => ({
        category_id:  c.category_id,
        limit_amount: c.limit_amount,
      })) ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'categories' })

  async function onSubmit(data: UpsertBudgetInput) {
    try {
      await upsert.mutateAsync(data)
      onClose()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al guardar presupuesto'
      setError('root', { message: msg })
    }
  }

  const expenseCats = cats?.filter((c) => c.type === 'expense' || c.type === 'both') ?? []
  const addedIds    = new Set(fields.map((f) => f.category_id))

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md bg-surface border-line max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-ink">
            {existing ? 'Editar presupuesto' : 'Nuevo presupuesto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 mt-2">
          <input type="hidden" {...register('year', { valueAsNumber: true })} />
          <input type="hidden" {...register('month', { valueAsNumber: true })} />

          {/* Total limit */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
              Limite total
            </label>
            <input
              type="number"
              step="1"
              min="0"
              {...register('total_limit', { valueAsNumber: true })}
              className="w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
            />
            {errors.total_limit && (
              <p className="text-[11px] text-terra mt-1">{errors.total_limit.message}</p>
            )}
          </div>

          {/* Per-category limits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">
                Limites por categoria
              </label>
            </div>

            {fields.length > 0 && (
              <div className="space-y-2 mb-2">
                {fields.map((field, index) => {
                  const cat = cats?.find((c) => c.id === field.category_id)
                  return (
                    <div key={field.id} className="flex items-center gap-2">
                      <span className="text-sm text-ink flex-1 truncate">
                        {cat?.icon ? `${cat.icon} ` : ''}{cat?.name ?? field.category_id}
                      </span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        {...register(`categories.${index}.limit_amount`, { valueAsNumber: true })}
                        className="w-32 px-2.5 py-1.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-ink-4 hover:text-terra text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add category */}
            <select
              value=""
              onChange={(e) => {
                if (!e.target.value) return
                append({ category_id: e.target.value, limit_amount: 0 })
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-surface-2 border border-line rounded-[var(--r-sm)] text-ink-3 focus:outline-none focus:border-ink transition-colors"
            >
              <option value="">+ Agregar categoria...</option>
              {expenseCats
                .filter((c) => !addedIds.has(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon ? `${c.icon} ` : ''}{c.name}
                  </option>
                ))}
            </select>
          </div>

          {errors.root && (
            <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
              {errors.root.message}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
