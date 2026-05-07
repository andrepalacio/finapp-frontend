import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth/session'

// Redirects to the first available workspace.
// TODO: read workspaceId from user preferences or query the API.
export default async function RootDashboardPage() {
  await requireAuth()
  redirect('/settings')
}
