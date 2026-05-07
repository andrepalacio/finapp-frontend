'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

function HomeIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx={4} cy={6} r={1} />
      <circle cx={4} cy={12} r={1} />
      <circle cx={4} cy={18} r={1} />
    </svg>
  )
}

function PieIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v9l8 4A9 9 0 1 1 12 3Z" />
      <path d="M12 3a9 9 0 0 1 9 9h-9Z" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1.5} fill="currentColor" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={9} />
      <path d="M9 9h4.5a2 2 0 0 1 0 4H9m0 0h5a2 2 0 0 1 0 4H9" />
    </svg>
  )
}

function CogIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3} />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  )
}

interface SidebarProps {
  workspaceId: string
  workspaceName: string
  userName: string
}

export function Sidebar({ workspaceId, workspaceName, userName }: SidebarProps) {
  const pathname = usePathname()
  const base = `/w/${workspaceId}`

  const mainItems: NavItem[] = [
    { href: base,                      label: 'Inicio',        icon: <HomeIcon /> },
    { href: `${base}/transactions`,    label: 'Transacciones', icon: <ListIcon /> },
    { href: `${base}/budget`,          label: 'Presupuesto',   icon: <PieIcon /> },
    { href: `${base}/savings`,         label: 'Metas',         icon: <TargetIcon /> },
    { href: `${base}/debts`,           label: 'Deudas',        icon: <CoinIcon /> },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-surface border-r border-line">
      {/* Brand */}
      <div className="px-5 pt-6 pb-2">
        <span className="font-serif text-2xl text-ink tracking-tight">finapp</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-ink-4 mb-1">
          Resumen
        </p>
        {mainItems.map((item) => {
          const isActive = item.href === base
            ? pathname === base || pathname === `${base}/`
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2 py-2 rounded-[var(--r-sm)] text-sm transition-colors',
                isActive
                  ? 'bg-ink text-bg font-medium'
                  : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
              )}
            >
              <span className="opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-ink-4 mt-4 mb-1">
          Herramientas
        </p>
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-[var(--r-sm)] text-sm transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-ink text-bg font-medium'
              : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
          )}
        >
          <span className="opacity-80"><CogIcon /></span>
          Ajustes
        </Link>
      </nav>

      {/* Workspace + user footer */}
      <div className="px-3 pb-5">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[var(--r-sm)] bg-surface-2">
          <div className="w-7 h-7 rounded-full bg-ink text-bg text-xs font-medium flex items-center justify-center shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink truncate">{workspaceName}</p>
            <p className="text-[10px] text-ink-3 truncate">{userName}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
