import { requireAuth } from '@/lib/auth/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  return <>{children}</>
}
