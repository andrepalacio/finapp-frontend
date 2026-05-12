import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { DebtList }                    from '@/domains/debts/components/DebtList'

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function DebtsPage({ params }: Props) {
  const { workspaceId } = await params

  let currency = 'COP'
  try {
    const ws = await workspacesApi.get(workspaceId)
    currency = ws.currency
  } catch { /* fallback */ }

  return <DebtList workspaceId={workspaceId} currency={currency} />
}
