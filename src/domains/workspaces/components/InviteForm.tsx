'use client'

import { useState } from 'react'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'

interface Props {
  workspaceId: string
  onInvited?: () => void
}

export function InviteForm({ workspaceId, onInvited }: Props) {
  const [email, setEmail] = useState('')
  const [role, setRole]   = useState<'member' | 'admin'>('member')
  const [error, setError] = useState('')
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSent(false)
    setLoading(true)
    try {
      await workspacesApi.invitations.send(workspaceId, email, role)
      setEmail('')
      setSent(true)
      onInvited?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar invitacion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@ejemplo.com"
          required
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-ink/20"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
          className="px-2 py-2 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none"
        >
          <option value="member">Miembro</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? '...' : 'Invitar'}
        </button>
      </div>
      {error && <p className="text-xs text-terra">{error}</p>}
      {sent  && <p className="text-xs text-emerald">Invitacion enviada</p>}
    </form>
  )
}
