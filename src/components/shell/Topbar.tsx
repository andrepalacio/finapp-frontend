'use client'

import { usePathname } from 'next/navigation'

const ROUTE_LABELS: Record<string, string> = {
  transactions: 'Transacciones',
  budget:       'Presupuesto',
  savings:      'Metas de ahorro',
  debts:        'Deudas',
  settings:     'Ajustes',
}

function pageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  return ROUTE_LABELS[last] ?? 'Inicio'
}

interface TopbarProps {
  workspaceId?: string
}

export function Topbar({ workspaceId: _workspaceId }: TopbarProps) {
  const pathname = usePathname()
  const title = pageTitle(pathname)

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-line bg-surface sticky top-0 z-10">
      <h1 className="text-base font-medium text-ink">{title}</h1>
    </header>
  )
}
