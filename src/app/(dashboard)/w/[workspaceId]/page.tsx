interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function WorkspaceDashboardPage({ params }: Props) {
  const { workspaceId } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Inicio</h1>
        <p className="text-sm text-ink-3 mt-1">Workspace: {workspaceId}</p>
      </div>
      <p className="text-ink-3 text-sm">[Dashboard cards van aqui]</p>
    </div>
  )
}
