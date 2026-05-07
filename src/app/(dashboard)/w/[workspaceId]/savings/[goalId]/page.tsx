interface Props {
  params: Promise<{ workspaceId: string; goalId: string }>
}

export default async function SavingsGoalDetailPage({ params }: Props) {
  const { workspaceId: _workspaceId, goalId: _goalId } = await params

  return (
    <div className="space-y-6">
      <h1 className="page-title">Meta de ahorro</h1>
      <p className="text-ink-3 text-sm">[ProgressRing + ContributionList van aqui]</p>
    </div>
  )
}
