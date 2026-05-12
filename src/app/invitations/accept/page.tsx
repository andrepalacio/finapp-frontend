'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { workspaces as workspacesApi } from '@/lib/api/endpoints/workspaces'
import { Suspense } from 'react'

function AcceptInvitationContent() {
  const params    = useSearchParams()
  const router    = useRouter()
  const token     = params.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [workspaceId, setWorkspaceId] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token de invitacion no encontrado')
      return
    }

    workspacesApi.invitations.accept(token)
      .then((inv) => {
        setWorkspaceId(inv.workspace_id)
        setStatus('success')
      })
      .catch((err: Error) => {
        setStatus('error')
        setMessage(err.message ?? 'La invitacion no es valida o ya expiro')
      })
  }, [token])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-ink border-t-transparent animate-spin" />
        <p className="text-sm text-ink-3">Verificando invitacion...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-terra-bg flex items-center justify-center text-terra text-xl">!</div>
        <p className="text-ink font-medium">Invitacion invalida</p>
        <p className="text-sm text-ink-3 text-center max-w-xs">{message}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
        >
          Ir al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center text-emerald text-xl">
        ✓
      </div>
      <p className="text-ink font-medium">Invitacion aceptada</p>
      <p className="text-sm text-ink-3">Ya eres miembro del workspace</p>
      <button
        onClick={() => router.push(workspaceId ? `/w/${workspaceId}` : '/')}
        className="mt-2 px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
      >
        Entrar al workspace
      </button>
    </div>
  )
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="bg-surface rounded-[var(--r-xl)] border border-line p-10 w-full max-w-sm text-center">
        <p className="font-serif text-2xl text-ink mb-8">FinApp</p>
        <Suspense fallback={
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-ink border-t-transparent animate-spin" />
            <p className="text-sm text-ink-3">Cargando...</p>
          </div>
        }>
          <AcceptInvitationContent />
        </Suspense>
      </div>
    </div>
  )
}
