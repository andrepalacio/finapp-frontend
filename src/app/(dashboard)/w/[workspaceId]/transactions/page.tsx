interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function TransactionsPage({ params }: Props) {
  const { workspaceId: _workspaceId } = await params

  return (
    <div className="space-y-6">
      <h1 className="page-title">Transacciones</h1>
      <p className="text-ink-3 text-sm">[TxList va aqui]</p>
    </div>
  )
}
