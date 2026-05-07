'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  workspaceId: string
}

export function MobileNav({ workspaceId }: MobileNavProps) {
  const pathname = usePathname()
  const base = `/w/${workspaceId}`

  const items = [
    {
      href: base,
      label: 'Inicio',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
        </svg>
      ),
    },
    {
      href: `${base}/transactions`,
      label: 'Gastos',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13M8 12h13M8 18h13" />
          <circle cx={4} cy={6} r={1} />
          <circle cx={4} cy={12} r={1} />
          <circle cx={4} cy={18} r={1} />
        </svg>
      ),
    },
    {
      href: `${base}/budget`,
      label: 'Budget',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v9l8 4A9 9 0 1 1 12 3Z" />
          <path d="M12 3a9 9 0 0 1 9 9h-9Z" />
        </svg>
      ),
    },
    {
      href: `${base}/savings`,
      label: 'Metas',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={9} />
          <circle cx={12} cy={12} r={5} />
          <circle cx={12} cy={12} r={1.5} fill="currentColor" />
        </svg>
      ),
    },
    {
      href: `${base}/debts`,
      label: 'Deudas',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={9} />
          <path d="M9 9h4.5a2 2 0 0 1 0 4H9m0 0h5a2 2 0 0 1 0 4H9" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface border-t border-line">
      <div className="flex items-stretch">
        {items.map((item) => {
          const isActive = item.href === base
            ? pathname === base || pathname === `${base}/`
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] transition-colors',
                isActive ? 'text-ink font-medium' : 'text-ink-4',
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
