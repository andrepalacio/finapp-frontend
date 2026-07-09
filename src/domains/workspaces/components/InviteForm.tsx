'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { Select } from '@/components/shared/Select'
import { ApiError } from '@/lib/api/client'
import { inviteMemberSchema, type InviteMemberInput } from '@/domains/workspaces/schemas'

interface Props {
  workspaceId: string
  onInvited?: () => void
}

export function InviteForm({ workspaceId, onInvited }: Props) {
  const [sent, setSent] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberInput>({
    resolver:      zodResolver(inviteMemberSchema),
    defaultValues: { email: '', role: 'member' },
  })

  async function onSubmit(data: InviteMemberInput) {
    setSent(false)
    try {
      await workspacesApi.invitations.send(workspaceId, data.email, data.role)
      reset({ email: '', role: data.role })
      setSent(true)
      onInvited?.()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al enviar invitacion'
      setError('root', { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="email@ejemplo.com"
          {...register('email')}
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-ink/20"
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: 'member', label: 'Miembro' },
                { value: 'admin',  label: 'Admin' },
              ]}
            />
          )}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? '...' : 'Invitar'}
        </button>
      </div>
      {errors.email && <p className="text-xs text-terra">{errors.email.message}</p>}
      {errors.root  && <p className="text-xs text-terra">{errors.root.message}</p>}
      {sent         && <p className="text-xs text-emerald">Invitacion enviada</p>}
    </form>
  )
}
