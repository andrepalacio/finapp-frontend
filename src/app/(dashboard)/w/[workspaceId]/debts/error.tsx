'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <p className="text-ink-3 text-sm mb-4">No se pudo cargar esta seccion.</p>
      <button onClick={reset} className="px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors">
        Reintentar
      </button>
    </div>
  )
}
