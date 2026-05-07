interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function SavingsPage({ params }: Props) {
  const { workspaceId: _workspaceId } = await params

  return (
    <div className="space-y-6">
      <h1 className="page-title">Metas de ahorro</h1>
      <p className="text-ink-3 text-sm">[GoalList va aqui]</p>
    </div>
  )
}
