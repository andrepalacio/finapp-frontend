import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { GoalList }                    from '@/domains/savings/components/GoalList'

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function SavingsPage({ params }: Props) {
  const { workspaceId } = await params

  let currency = 'COP'
  try {
    const ws = await workspacesApi.get(workspaceId)
    currency = ws.currency
  } catch { /* fallback */ }

  return <GoalList workspaceId={workspaceId} currency={currency} />
}
