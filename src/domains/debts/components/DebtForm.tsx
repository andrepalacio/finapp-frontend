'use client'

import { useEffect }                        from 'react'
import { useForm, Controller }               from 'react-hook-form'
import { zodResolver }         from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateDebt, useUpdateDebt } from '@/domains/debts/hooks/useDebts'
import { createDebtSchema, type CreateDebtInput } from '@/domains/debts/schemas'
import { todayISO }        from '@/lib/format/date'
import { ApiError }        from '@/lib/api/client'
import { Select }          from '@/components/shared/Select'
import type { Debt }       from '@/types/domain'

interface Props {
  workspaceId:    string
  onClose:        () => void
  editingDebt?:   Debt
}

function debtToFormValues(debt: Debt): CreateDebtInput {
  return {
    name:               debt.name,
    lender:             debt.lender ?? '',
    principal:          debt.principal,
    rate:               debt.rate,
    rate_type:          debt.rate_type,
    installments:       debt.installments,
    first_payment_date: debt.first_payment_date.slice(0, 10),
    notes:              debt.notes ?? '',
    insurance_rate:     debt.insurance_rate ?? 0,
    insurance_type:     debt.insurance_type ?? '',
  }
}

export function DebtForm({ workspaceId, onClose, editingDebt }: Props) {
  const isEdit = !!editingDebt
  const create = useCreateDebt(workspaceId)
  const update = useUpdateDebt(workspaceId, editingDebt?.id ?? '')

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateDebtInput>({
    resolver:      zodResolver(createDebtSchema),
    defaultValues: isEdit
      ? debtToFormValues(editingDebt)
      : { rate_type: 'effective_annual', first_payment_date: todayISO(), insurance_rate: 0, insurance_type: '' },
  })

  const insuranceType = watch('insurance_type')

  useEffect(() => {
    if (!insuranceType) setValue('insurance_rate', 0)
  }, [insuranceType, setValue])

  async function onSubmit(data: CreateDebtInput) {
    try {
      if (isEdit) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onClose()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : isEdit ? 'Error al actualizar deuda' : 'Error al crear deuda'
      setError('root', { message: msg })
    }
  }

  const field = (label: string, children: React.ReactNode, error?: string) => (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[11px] text-terra mt-1">{error}</p>}
    </div>
  )

  const inputCls = "w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md bg-surface border-line max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-ink">
            {isEdit ? 'Editar deuda' : 'Nueva deuda'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 mt-2">
          {field('Nombre', <input type="text" placeholder="Credito de consumo" {...register('name')} className={inputCls} />, errors.name?.message)}
          {field('Prestamista', <input type="text" placeholder="Banco XYZ (opcional)" {...register('lender')} className={inputCls} />)}

          <div className="grid grid-cols-2 gap-3">
            {field('Capital', <input type="number" step="1" min="0" {...register('principal', { valueAsNumber: true })} className={inputCls} />, errors.principal?.message)}
            {field('Cuotas', <input type="number" step="1" min="1" {...register('installments', { valueAsNumber: true })} className={inputCls} />, errors.installments?.message)}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('Tasa (%)',
              <input type="number" step="0.0001" min="0" placeholder="25.59" {...register('rate', { valueAsNumber: true })} className={inputCls} />,
              errors.rate?.message
            )}
            {field('Tipo de tasa',
              <Controller
                control={control}
                name="rate_type"
                render={({ field: f }) => (
                  <Select
                    value={f.value}
                    onChange={f.onChange}
                    className="w-full py-2.5 text-sm"
                    options={[
                      { value: 'effective_annual', label: 'EA anual' },
                      { value: 'nominal_annual',   label: 'NMV anual' },
                      { value: 'monthly',          label: 'MV mensual' },
                    ]}
                  />
                )}
              />
            )}
          </div>

          {field('Fecha primer pago',
            <input type="date" {...register('first_payment_date')} className={inputCls} />,
            errors.first_payment_date?.message
          )}

          <div className="border border-line rounded-[var(--r-sm)] p-3 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">Seguro (opcional)</p>
            <div className="grid grid-cols-2 gap-3">
              {field('Tipo de seguro',
                <Controller
                  control={control}
                  name="insurance_type"
                  render={({ field: f }) => (
                    <Select
                      value={f.value}
                      onChange={f.onChange}
                      className="w-full py-2.5 text-sm"
                      options={[
                        { value: '',              label: 'Sin seguro' },
                        { value: 'fixed_monthly', label: 'Fijo mensual' },
                        { value: 'on_balance',    label: '% sobre saldo' },
                      ]}
                    />
                  )}
                />
              )}
              {insuranceType
              ? field(
                  insuranceType === 'on_balance' ? 'Tasa seguro (%)' : 'Valor seguro',
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={insuranceType === 'on_balance' ? '0.3' : '45000'}
                    {...register('insurance_rate', { valueAsNumber: true })}
                    className={inputCls}
                  />,
                  errors.insurance_rate?.message
                )
              : <div />
            }
            </div>
          </div>

          {field('Notas',
            <textarea rows={2} {...register('notes')} className={`${inputCls} resize-none`} />
          )}

          {errors.root && (
            <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
              {errors.root.message}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60">
              {isSubmitting
                ? (isEdit ? 'Guardando...' : 'Creando...')
                : (isEdit ? 'Guardar cambios' : 'Crear deuda')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
