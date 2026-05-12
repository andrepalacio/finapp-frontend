import { requireAuth }  from '@/lib/auth/session'
import { auth as authApi } from '@/lib/api/endpoints/auth'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { ProfileForm }  from '@/domains/workspaces/components/ProfileForm'
import { WorkspaceForm } from '@/domains/workspaces/components/WorkspaceForm'
import { MemberList }  from '@/domains/workspaces/components/MemberList'
import { LogoutButton } from '@/domains/auth/components/LogoutButton'
import type { Workspace, WorkspaceMember, WorkspaceInvitation } from '@/types/domain'

export default async function SettingsPage() {
  await requireAuth()

  let user       = null
  let workspaceList: Workspace[] = []

  try {
    const [u, list] = await Promise.all([authApi.me(), workspacesApi.list()])
    user          = u
    workspaceList = list
  } catch { /* fallback */ }

  // Per-workspace members + invitations (best-effort)
  const wsMeta: Record<string, { members: WorkspaceMember[]; invitations: WorkspaceInvitation[] }> = {}
  await Promise.allSettled(
    workspaceList.map(async (ws) => {
      const [members, invitations] = await Promise.all([
        workspacesApi.members.list(ws.id),
        workspacesApi.invitations.list(ws.id),
      ])
      wsMeta[ws.id] = { members, invitations }
    })
  )

  return (
    <div className="min-h-screen bg-bg px-6 py-8">
      <div className="max-w-xl mx-auto space-y-10">
        <h1 className="page-title">Ajustes</h1>

        {/* Profile */}
        <section>
          <h2 className="text-base font-medium text-ink mb-4">Perfil</h2>
          {user ? (
            <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-line">
                <div className="w-12 h-12 rounded-full bg-ink text-bg flex items-center justify-center font-serif text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-ink">{user.name}</p>
                  <p className="text-sm text-ink-3">{user.email}</p>
                </div>
              </div>
              <ProfileForm user={user} />
            </div>
          ) : (
            <p className="text-ink-3 text-sm">No se pudo cargar el perfil</p>
          )}
        </section>

        {/* Workspaces + Members */}
        <section>
          <h2 className="text-base font-medium text-ink mb-4">Workspaces</h2>
          <div className="space-y-4">
            {workspaceList.map((ws) => {
              const meta = wsMeta[ws.id] ?? { members: [], invitations: [] }
              return (
                <div key={ws.id} className="bg-surface rounded-[var(--r-lg)] border border-line p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{ws.name}</p>
                      <p className="text-xs text-ink-3">{ws.currency}</p>
                    </div>
                    <a
                      href={`/w/${ws.id}`}
                      className="text-xs text-ink-3 hover:text-ink transition-colors border border-line px-2.5 py-1 rounded-[var(--r-sm)] hover:bg-surface-2"
                    >
                      Entrar
                    </a>
                  </div>
                  {user && (
                    <div className="pt-3 border-t border-line">
                      <p className="text-xs text-ink-3 font-medium mb-3">Miembros</p>
                      <MemberList
                        workspaceId={ws.id}
                        ownerId={ws.owner_id}
                        currentUserId={user.id}
                        initialMembers={meta.members}
                        initialInvitations={meta.invitations}
                      />
                    </div>
                  )}
                </div>
              )
            })}
            <div className="bg-surface rounded-[var(--r-lg)] border border-dashed border-line p-5">
              <p className="text-xs text-ink-3 mb-3">Nuevo workspace</p>
              <WorkspaceForm submitLabel="Crear workspace" />
            </div>
          </div>
        </section>

        {/* Session */}
        <section>
          <h2 className="text-base font-medium text-ink mb-4">Sesion</h2>
          <div className="bg-surface rounded-[var(--r-lg)] border border-line p-5">
            <p className="text-sm text-ink-3 mb-3">Cerrar sesion en este dispositivo</p>
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  )
}
