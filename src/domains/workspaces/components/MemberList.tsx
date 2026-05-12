'use client'

import { useState, useCallback } from 'react'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { InviteForm } from './InviteForm'
import type { WorkspaceMember, WorkspaceInvitation } from '@/types/domain'

interface Props {
  workspaceId:   string
  ownerId:       string
  currentUserId: string
  initialMembers:     WorkspaceMember[]
  initialInvitations: WorkspaceInvitation[]
}

const roleBadge: Record<string, string> = {
  owner:  'bg-ink/10 text-ink',
  admin:  'bg-gold/10 text-gold',
  member: 'bg-surface-2 text-ink-3',
}

const roleLabel: Record<string, string> = {
  owner:  'Owner',
  admin:  'Admin',
  member: 'Miembro',
}

export function MemberList({ workspaceId, ownerId, currentUserId, initialMembers, initialInvitations }: Props) {
  const [members, setMembers]         = useState(initialMembers)
  const [invitations, setInvitations] = useState(initialInvitations)
  const [loading, setLoading]         = useState<string | null>(null)

  const isOwner = currentUserId === ownerId

  const refresh = useCallback(async () => {
    const [m, i] = await Promise.all([
      workspacesApi.members.list(workspaceId),
      workspacesApi.invitations.list(workspaceId),
    ])
    setMembers(m)
    setInvitations(i)
  }, [workspaceId])

  async function removeMember(userId: string) {
    setLoading(userId)
    try {
      await workspacesApi.members.remove(workspaceId, userId)
      setMembers((prev) => prev.filter((m) => m.user_id !== userId))
    } finally {
      setLoading(null)
    }
  }

  async function cancelInvitation(invId: string) {
    setLoading(invId)
    try {
      await workspacesApi.invitations.cancel(workspaceId, invId)
      setInvitations((prev) => prev.filter((i) => i.id !== invId))
    } finally {
      setLoading(null)
    }
  }

  async function updateRole(userId: string, role: string) {
    setLoading(userId + '-role')
    try {
      await workspacesApi.members.updateRole(workspaceId, userId, role)
      setMembers((prev) => prev.map((m) => m.user_id === userId ? { ...m, role: role as WorkspaceMember['role'] } : m))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current members */}
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.user_id} className="bg-surface rounded-[var(--r-lg)] border border-line px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ink text-bg flex items-center justify-center text-sm font-serif shrink-0">
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{m.name}</p>
              <p className="text-xs text-ink-3 truncate">{m.email}</p>
            </div>

            {isOwner && m.user_id !== ownerId ? (
              <select
                value={m.role}
                disabled={loading === m.user_id + '-role'}
                onChange={(e) => updateRole(m.user_id, e.target.value)}
                className="text-xs bg-bg border border-line rounded-[var(--r-sm)] px-2 py-1 text-ink focus:outline-none"
              >
                <option value="member">Miembro</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${roleBadge[m.role] ?? 'bg-surface-2 text-ink-3'}`}>
                {roleLabel[m.role] ?? m.role}
              </span>
            )}

            {isOwner && m.user_id !== ownerId && (
              <button
                onClick={() => removeMember(m.user_id)}
                disabled={loading === m.user_id}
                className="text-xs text-terra hover:underline disabled:opacity-50 ml-1"
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-ink-3 font-medium uppercase tracking-wide">Invitaciones pendientes</p>
          {invitations.map((inv) => (
            <div key={inv.id} className="bg-surface rounded-[var(--r-lg)] border border-dashed border-line px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">{inv.email}</p>
                <p className="text-xs text-ink-4">Expira {new Date(inv.expires_at).toLocaleDateString('es-CO')}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${roleBadge[inv.role] ?? 'bg-surface-2 text-ink-3'}`}>
                {roleLabel[inv.role] ?? inv.role}
              </span>
              {isOwner && (
                <button
                  onClick={() => cancelInvitation(inv.id)}
                  disabled={loading === inv.id}
                  className="text-xs text-ink-3 hover:text-terra transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Invite form */}
      {isOwner && (
        <div className="pt-2 border-t border-line">
          <p className="text-xs text-ink-3 mb-2 font-medium">Invitar persona</p>
          <InviteForm workspaceId={workspaceId} onInvited={refresh} />
        </div>
      )}
    </div>
  )
}
