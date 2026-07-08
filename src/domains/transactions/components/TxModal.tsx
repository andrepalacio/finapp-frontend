'use client'

import { useEffect }           from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver }         from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCategories }          from '@/domains/categories/hooks/useCategories'
import { useCreateTransaction, useDeleteTransaction } from '@/domains/transactions/hooks/useTransactions'
import { createTransactionSchema, type CreateTransactionInput } from '@/domains/transactions/schemas'
import { todayISO }               from '@/lib/format/date'
import { ApiError }               from '@/lib/api/client'
import { Select }                 from '@/components/shared/Select'
import type { Transaction }       from '@/types/domain'

interface Props {
  workspaceId: string
  open:        boolean
  onClose:     () => void
  editing?:    Transaction | null
}

const TYPE_LABELS = {
  expense:  'Gasto',
  income:   'Ingreso',
  transfer: 'Transferencia',
}

export function TxModal({ workspaceId, open, onClose, editing }: Props) {
  const { data: cats }  = useCategories(workspaceId)
  const createTx        = useCreateTransaction(workspaceId)
  const deleteTx        = useDeleteTransaction(workspaceId)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionInput>({
    resolver:      zodResolver(createTransactionSchema),
    defaultValues: { type: 'expense', date: todayISO() },
  })

  const txType = watch('type')

  useEffect(() => {
    if (editing) {
      reset({
        type:        editing.type,
        amount:      editing.amount,
        category_id: editing.category_id ?? undefined,
        description: editing.description ?? undefined,
        date:        editing.date.slice(0, 10),
      })
    } else {
      reset({ type: 'expense', date: todayISO() })
    }
  }, [editing, reset])

  async function onSubmit(data: CreateTransactionInput) {
    try {
      await createTx.mutateAsync(data)
      onClose()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al guardar'
      setError('root', { message: msg })
    }
  }

  async function handleDelete() {
    if (!editing) return
    await deleteTx.mutateAsync(editing.id)
    onClose()
  }

  const filteredCats = cats?.filter((c) => {
    if (txType === 'expense')  return c.type === 'expense'  || c.type === 'both'
    if (txType === 'income')   return c.type === 'income'   || c.type === 'both'
    return false
  }) ?? []

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md bg-surface border-line">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-ink">
            {editing ? 'Editar transaccion' : 'Nueva transaccion'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 mt-2">
          {/* Type tabs */}
          <div className="flex gap-1 bg-surface-2 p-1 rounded-[var(--r-sm)]">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <label
                key={t}
                className={`flex-1 text-center text-xs py-1.5 rounded-[calc(var(--r-sm)-2px)] cursor-pointer transition-colors font-medium ${
                  txType === t ? 'bg-surface shadow-[var(--shadow-sm)] text-ink' : 'text-ink-3 hover:text-ink'
                }`}
              >
                <input type="radio" value={t} {...register('type')} className="sr-only" />
                {TYPE_LABELS[t]}
              </label>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
              Monto
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="50000"
              {...register('amount', { valueAsNumber: true })}
              className="w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
            />
            {errors.amount && (
              <p className="text-[11px] text-terra mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
              Fecha
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
            />
            {errors.date && (
              <p className="text-[11px] text-terra mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Category — hidden for transfer */}
          {txType !== 'transfer' && (
            <div>
              <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
                Categoria
              </label>
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    clearable
                    placeholder="Sin categoria"
                    className="w-full py-2.5 text-sm"
                    options={filteredCats.map((c) => ({
                      value: c.id,
                      label: `${c.icon ? c.icon + ' ' : ''}${c.name}`,
                    }))}
                  />
                )}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
              Descripcion <span className="normal-case text-ink-4">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Mercado semanal..."
              {...register('description')}
              className="w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
            />
          </div>

          {errors.root && (
            <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
              {errors.root.message}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            {editing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 text-sm text-terra border border-terra-bg rounded-[var(--r-sm)] hover:bg-terra-bg/40 transition-colors"
              >
                Eliminar
              </button>
            )}
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
              {isSubmitting ? 'Guardando...' : editing ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
