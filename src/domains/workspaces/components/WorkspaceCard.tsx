'use client'

import { useState }       from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver }         from '@hookform/resolvers/zod'
import { useRouter }      from 'next/navigation'
import { MemberList }     from './MemberList'
import { useUpdateWorkspace, useDeleteWorkspace } from '../hooks/useWorkspaces'
import { createWorkspaceSchema, type CreateWorkspaceInput } from '../schemas'
import { ApiError }       from '@/lib/api/client'
import { Select }         from '@/components/shared/Select'
import type { Workspace, WorkspaceMember, WorkspaceInvitation } from '@/types/domain'

const CURRENCIES = [
  { code: 'COP', label: 'COP — Peso colombiano' },
  { code: 'USD', label: 'USD — Dolar estadounidense' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'MXN', label: 'MXN — Peso mexicano' },
  { code: 'ARS', label: 'ARS — Peso argentino' },
  { code: 'BRL', label: 'BRL — Real brasileno' },
]

const inputCls = 'w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors'

interface Props {
  ws:            Workspace
  currentUserId: string
  members:       WorkspaceMember[]
  invitations:   WorkspaceInvitation[]
}

export function WorkspaceCard({ ws, currentUserId, members, invitations }: Props) {
  const router   = useRouter()
  const isOwner  = ws.owner_id === currentUserId
  const update   = useUpdateWorkspace()
  const remove   = useDeleteWorkspace()

  const [mode, setMode] = useState<'view' | 'edit' | 'confirmDelete'>('view')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceInput>({
    resolver:      zodResolver(createWorkspaceSchema),
    defaultValues: { name: ws.name, currency: ws.currency },
  })

  async function onEdit(data: CreateWorkspaceInput) {
    try {
      await update.mutateAsync({ id: ws.id, data })
      setMode('view')
      router.refresh()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al guardar'
      setError('root', { message: msg })
    }
  }

  async function onDelete() {
    try {
      await remove.mutateAsync(ws.id)
      router.refresh()
    } catch {
      setMode('view')
    }
  }

  return (
    <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink truncate">{ws.name}</p>
          <p className="text-xs text-ink-3">{ws.currency}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={`/w/${ws.id}`}
            className="text-xs text-ink-3 hover:text-ink transition-colors border border-line px-2.5 py-1 rounded-[var(--r-sm)] hover:bg-surface-2"
          >
            Entrar
          </a>
          {isOwner && mode === 'view' && (
            <>
              <button
                type="button"
                onClick={() => { reset({ name: ws.name, currency: ws.currency }); setMode('edit') }}
                className="text-xs text-ink-3 hover:text-ink transition-colors border border-line px-2.5 py-1 rounded-[var(--r-sm)] hover:bg-surface-2"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => setMode('confirmDelete')}
                className="text-xs text-terra hover:text-terra transition-colors border border-terra-bg px-2.5 py-1 rounded-[var(--r-sm)] hover:bg-terra-bg/30"
              >
                Eliminar
              </button>
            </>
          )}
          {mode !== 'view' && (
            <button
              type="button"
              onClick={() => setMode('view')}
              className="text-xs text-ink-4 hover:text-ink transition-colors px-2 py-1"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Inline edit form */}
      {mode === 'edit' && (
        <form onSubmit={handleSubmit(onEdit)} noValidate className="space-y-3 pt-1 border-t border-line">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Nombre</label>
            <input type="text" {...register('name')} className={inputCls} />
            {errors.name && <p className="text-[11px] text-terra mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Moneda</label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full py-2.5 text-sm"
                  options={CURRENCIES.map(({ code, label }) => ({ value: code, label }))}
                />
              )}
            />
          </div>
          {errors.root && (
            <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
              {errors.root.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}

      {/* Delete confirmation */}
      {mode === 'confirmDelete' && (
        <div className="pt-3 border-t border-terra-bg space-y-3">
          <p className="text-sm text-ink">
            Eliminar <span className="font-medium">{ws.name}</span>? Esta accion borra todas las transacciones, presupuestos, deudas y metas de ahorro del workspace.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('view')}
              className="flex-1 py-2.5 text-sm text-ink-3 border border-line rounded-[var(--r-sm)] hover:bg-surface-2 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={remove.isPending}
              className="flex-1 py-2.5 text-sm font-medium bg-terra text-bg rounded-[var(--r-sm)] hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {remove.isPending ? 'Eliminando...' : 'Eliminar workspace'}
            </button>
          </div>
        </div>
      )}

      {/* Members */}
      <div className="pt-3 border-t border-line">
        <p className="text-xs text-ink-3 font-medium mb-3">Miembros</p>
        <MemberList
          workspaceId={ws.id}
          ownerId={ws.owner_id}
          currentUserId={currentUserId}
          initialMembers={members}
          initialInvitations={invitations}
        />
      </div>
    </div>
  )
}
