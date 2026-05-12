import { requireAuth }  from '@/lib/auth/session'
import { WorkspaceForm } from '@/domains/workspaces/components/WorkspaceForm'

export default async function OnboardingPage() {
  await requireAuth()

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="font-serif text-2xl text-ink tracking-tight">finapp</span>
          <h1 className="font-serif text-[36px] leading-[1.05] tracking-tight mt-4 mb-2">
            Crea tu primer workspace.
          </h1>
          <p className="text-ink-3 text-sm">
            Un workspace agrupa tus finanzas. Puedes crear mas despues.
          </p>
        </div>
        <WorkspaceForm submitLabel="Crear y entrar" />
      </div>
    </div>
  )
}
