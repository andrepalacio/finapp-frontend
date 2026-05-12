'use client'

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-ink-3 text-sm mb-4">Ocurrio un error al cargar la pagina.</p>
      <p className="text-[11px] text-ink-4 mb-6 font-mono">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
      >
        Reintentar
      </button>
    </div>
  )
}
