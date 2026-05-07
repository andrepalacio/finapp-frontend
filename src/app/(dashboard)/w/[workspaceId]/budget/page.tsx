interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function BudgetPage({ params }: Props) {
  const { workspaceId: _workspaceId } = await params

  return (
    <div className="space-y-6">
      <h1 className="page-title">Presupuesto</h1>
      <p className="text-ink-3 text-sm">[BudgetCard va aqui]</p>
    </div>
  )
}
