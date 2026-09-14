import { Suspense } from 'react'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { TxPageClient } from '@/domains/transactions/components/TxPageClient'

interface Props {
  params:      Promise<{ workspaceId: string }>
  searchParams: Promise<Record<string, string>>
}

export default async function TransactionsPage({ params }: Props) {
  const { workspaceId } = await params

  let currency  = 'COP'
  let canWrite  = true
  try {
    const list = await workspacesApi.list()
    const ws   = list.find((w) => w.id === workspaceId)
    currency   = ws?.currency ?? currency
    canWrite   = ws?.role !== 'viewer'
  } catch { /* fallback */ }

  return (
    <Suspense>
      <TxPageClient workspaceId={workspaceId} currency={currency} canWrite={canWrite} />
    </Suspense>
  )
}
