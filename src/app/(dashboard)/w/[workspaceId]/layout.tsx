import { redirect }   from 'next/navigation'
import { Sidebar }   from '@/components/shell/Sidebar'
import { Topbar }    from '@/components/shell/Topbar'
import { MobileNav } from '@/components/shell/MobileNav'
import { requireAuth } from '@/lib/auth/session'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { auth as authApi }             from '@/lib/api/endpoints/auth'

interface Props {
  children: React.ReactNode
  params:   Promise<{ workspaceId: string }>
}

export default async function WorkspaceLayout({ children, params }: Props) {
  const { workspaceId } = await params
  await requireAuth()

  let workspaceList   = [{ id: workspaceId, name: 'Workspace', currency: 'COP', owner_id: '', created_at: '', updated_at: '' }]
  let userName        = 'Usuario'

  try {
    const [list, user] = await Promise.all([
      workspacesApi.list(),
      authApi.me(),
    ])
    if (list.length > 0) workspaceList = list
    userName = user.name
  } catch {
    // Fallback to defaults — actual 401 is caught by middleware
  }

  const currentWorkspace = workspaceList.find((w) => w.id === workspaceId)
  if (!currentWorkspace) redirect('/')

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        workspaceId={workspaceId}
        workspaceName={currentWorkspace.name}
        userName={userName}
        workspaces={workspaceList}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar workspaceId={workspaceId} />
        <main className="flex-1 px-6 py-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      <MobileNav workspaceId={workspaceId} />
    </div>
  )
}
