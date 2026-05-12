'use client'

import { useForm }       from 'react-hook-form'
import { zodResolver }   from '@hookform/resolvers/zod'
import { useRouter }     from 'next/navigation'
import { createWorkspaceSchema, type CreateWorkspaceInput } from '@/domains/workspaces/schemas'
import { useCreateWorkspace } from '@/domains/workspaces/hooks/useWorkspaces'
import { ApiError }          from '@/lib/api/client'

const CURRENCIES = [
  { code: 'COP', label: 'COP — Peso colombiano' },
  { code: 'USD', label: 'USD — Dolar estadounidense' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'MXN', label: 'MXN — Peso mexicano' },
  { code: 'ARS', label: 'ARS — Peso argentino' },
  { code: 'BRL', label: 'BRL — Real brasileno' },
]

interface Props {
  onSuccess?: (workspaceId: string) => void
  submitLabel?: string
}

export function WorkspaceForm({ onSuccess, submitLabel = 'Crear workspace' }: Props) {
  const router  = useRouter()
  const create  = useCreateWorkspace()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { currency: 'COP' },
  })

  async function onSubmit(data: CreateWorkspaceInput) {
    try {
      const ws = await create.mutateAsync(data)
      if (onSuccess) {
        onSuccess(ws.id)
      } else {
        router.push(`/w/${ws.id}`)
        router.refresh()
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al crear workspace'
      setError('root', { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
          Nombre
        </label>
        <input
          type="text"
          placeholder="Personal"
          {...register('name')}
          className="w-full px-3 py-2.5 text-sm bg-surface border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
        />
        {errors.name && (
          <p className="text-[11px] text-terra mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Moneda */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
          Moneda principal
        </label>
        <select
          {...register('currency')}
          className="w-full px-3 py-2.5 text-sm bg-surface border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
        >
          {CURRENCIES.map(({ code, label }) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
        {errors.currency && (
          <p className="text-[11px] text-terra mt-1">{errors.currency.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center py-3.5 px-4 bg-ink text-bg text-sm font-medium rounded-[var(--r-md)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creando...' : submitLabel}
      </button>
    </form>
  )
}
