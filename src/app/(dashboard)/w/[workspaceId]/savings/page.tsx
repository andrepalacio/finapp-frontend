import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { GoalList }                    from '@/domains/savings/components/GoalList'

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function SavingsPage({ params }: Props) {
  const { workspaceId } = await params

  let currency = 'COP'
  try {
    const list = await workspacesApi.list()
    currency = list.find((w) => w.id === workspaceId)?.currency ?? currency
  } catch { /* fallback */ }

  return <GoalList workspaceId={workspaceId} currency={currency} />
}
