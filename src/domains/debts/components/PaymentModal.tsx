'use client'

import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }           from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreatePayment } from '@/domains/debts/hooks/useDebts'
import { todayISO }         from '@/lib/format/date'
import { formatCurrency }   from '@/lib/format/currency'
import { ApiError }         from '@/lib/api/client'
import type { DebtScheduleInstallment } from '@/types/domain'

const schema = z.object({
  amount:  z.number().positive(),
  paid_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes:   z.string().nullable().optional(),
})
type FormInput = z.infer<typeof schema>

interface Props {
  workspaceId:  string
  debtId:       string
  installment:  DebtScheduleInstallment
  onClose:      () => void
}

export function PaymentModal({ workspaceId, debtId, installment, onClose }: Props) {
  const create = useCreatePayment(workspaceId, debtId)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver:      zodResolver(schema),
    defaultValues: { amount: installment.payment, paid_at: todayISO() },
  })

  async function onSubmit(data: FormInput) {
    try {
      await create.mutateAsync({ period: installment.period, ...data })
      onClose()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al registrar pago'
      setError('root', { message: msg })
    }
  }

  const inputCls = "w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm bg-surface border-line">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-ink">
            Registrar pago
          </DialogTitle>
        </DialogHeader>

        <div className="bg-surface-2 rounded-[var(--r-sm)] px-3 py-2.5 mb-1">
          <p className="text-[11px] uppercase tracking-[0.08em] text-ink-3 font-medium">Cuota #{installment.period}</p>
          <p className="text-sm text-ink tabular-nums mt-0.5">
            Valor esperado: <strong>{formatCurrency(installment.payment, 'COP')}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Monto pagado</label>
            <input type="number" step="1" min="0" {...register('amount', { valueAsNumber: true })} className={inputCls} />
            {errors.amount && <p className="text-[11px] text-terra mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Fecha de pago</label>
            <input type="date" {...register('paid_at')} className={inputCls} />
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
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60">
              {isSubmitting ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
