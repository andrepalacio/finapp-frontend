interface Props {
  params: Promise<{ workspaceId: string; debtId: string }>
}

export default async function DebtDetailPage({ params }: Props) {
  const { workspaceId: _workspaceId, debtId: _debtId } = await params

  return (
    <div className="space-y-6">
      <h1 className="page-title">Detalle de deuda</h1>
      <p className="text-ink-3 text-sm">[ScheduleTable va aqui]</p>
    </div>
  )
}
