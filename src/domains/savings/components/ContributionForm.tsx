'use client'

import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateContribution } from '@/domains/savings/hooks/useSavings'
import { createContributionSchema, type CreateContributionInput } from '@/domains/savings/schemas'
import { todayISO }              from '@/lib/format/date'
import { ApiError }              from '@/lib/api/client'

interface Props {
  workspaceId: string
  goalId:      string
  onClose:     () => void
}

export function ContributionForm({ workspaceId, goalId, onClose }: Props) {
  const create = useCreateContribution(workspaceId, goalId)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateContributionInput>({
    resolver:      zodResolver(createContributionSchema),
    defaultValues: { contributed_at: todayISO() },
  })

  async function onSubmit(data: CreateContributionInput) {
    try {
      await create.mutateAsync(data)
      onClose()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al registrar abono'
      setError('root', { message: msg })
    }
  }

  const inputCls = "w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm bg-surface border-line">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-ink">Agregar abono</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 mt-2">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Monto</label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="50000"
              {...register('amount', { valueAsNumber: true })}
              className={inputCls}
            />
            {errors.amount && <p className="text-[11px] text-terra mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Fecha</label>
            <input type="date" {...register('contributed_at')} className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Notas <span className="normal-case text-ink-4">(opcional)</span></label>
            <input type="text" {...register('notes')} className={inputCls} />
          </div>

          {errors.root && (
            <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
              {errors.root.message}
            </p>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60">
              {isSubmitting ? 'Guardando...' : 'Abonar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
