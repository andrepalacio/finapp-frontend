import { redirect }        from 'next/navigation'
import { requireAuth }     from '@/lib/auth/session'
import { workspaces }      from '@/lib/api/endpoints/workspaces'
import { WorkspacePicker } from '@/domains/workspaces/components/WorkspacePicker'

export default async function RootDashboardPage() {
  await requireAuth()

  const list = await workspaces.list()

  if (list.length === 0) redirect('/onboarding')
  if (list.length === 1) redirect(`/w/${list[0].id}`)

  return <WorkspacePicker workspaces={list} />
}
