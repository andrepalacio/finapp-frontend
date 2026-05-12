import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { savings as savingsApi }        from '@/lib/api/endpoints/savings'
import { GoalCard }                    from '@/domains/savings/components/GoalCard'
import { ContributionList }            from '@/domains/savings/components/ContributionList'
import Link                            from 'next/link'

interface Props {
  params: Promise<{ workspaceId: string; goalId: string }>
}

export default async function SavingsGoalDetailPage({ params }: Props) {
  const { workspaceId, goalId } = await params

  let currency = 'COP'
  let goal = null

  try {
    const [ws, g] = await Promise.all([
      workspacesApi.get(workspaceId),
      savingsApi.get(workspaceId, goalId),
    ])
    currency = ws.currency
    goal     = g
  } catch { /* fallback */ }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/w/${workspaceId}/savings`}
          className="text-xs text-ink-3 hover:text-ink transition-colors flex items-center gap-1 mb-3"
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Metas
        </Link>
        <h1 className="page-title">{goal?.name ?? 'Meta de ahorro'}</h1>
      </div>

      {goal && (
        <GoalCard
          goal={goal}
          workspaceId={workspaceId}
          currency={currency}
          showDetail
        />
      )}

      <ContributionList workspaceId={workspaceId} goalId={goalId} currency={currency} />
    </div>
  )
}
