import { requireAuth } from '@/lib/auth/session'

export default async function SettingsPage() {
  await requireAuth()

  return (
    <div className="min-h-screen bg-bg px-6 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="page-title">Ajustes</h1>
        <p className="text-ink-3 text-sm">[ProfileForm + WorkspaceSwitcher van aqui]</p>
      </div>
    </div>
  )
}
