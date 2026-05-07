import { Sidebar }   from '@/components/shell/Sidebar'
import { Topbar }    from '@/components/shell/Topbar'
import { MobileNav } from '@/components/shell/MobileNav'

interface Props {
  children:     React.ReactNode
  params:       Promise<{ workspaceId: string }>
}

export default async function WorkspaceLayout({ children, params }: Props) {
  const { workspaceId } = await params

  // TODO: fetch workspace + user from API using requireAuth token
  const workspaceName = 'Personal'
  const userName      = 'Usuario'

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        userName={userName}
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
