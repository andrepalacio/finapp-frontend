'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import { cn }          from '@/lib/utils'
import type { Workspace } from '@/types/domain'

function ChevronIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

interface Props {
  currentWorkspaceId: string
  workspaces: Workspace[]
  userName: string
}

export function WorkspaceSwitcher({ currentWorkspaceId, workspaces, userName }: Props) {
  const router     = useRouter()
  const [open, setOpen] = useState(false)
  const current    = workspaces.find((w) => w.id === currentWorkspaceId)

  function handleSelect(id: string) {
    setOpen(false)
    router.push(`/w/${id}`)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-[var(--r-sm)] bg-surface-2 hover:bg-line/60 transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-full bg-ink text-bg text-xs font-medium flex items-center justify-center shrink-0">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-ink truncate">{current?.name ?? 'Workspace'}</p>
          <p className="text-[10px] text-ink-3 truncate">{userName}</p>
        </div>
        <span className={cn('text-ink-3 transition-transform shrink-0', open && 'rotate-180')}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          {/* Menu */}
          <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-surface border border-line rounded-[var(--r-md)] shadow-[var(--shadow-md)] py-1 overflow-hidden">
            <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-ink-4 font-medium">
              Workspaces
            </p>

            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-2 transition-colors text-left"
              >
                <div className="w-5 h-5 rounded bg-ink/10 text-ink text-[10px] font-medium flex items-center justify-center shrink-0">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 truncate">{ws.name}</span>
                <span className="text-xs text-ink-4 shrink-0">{ws.currency}</span>
                {ws.id === currentWorkspaceId && (
                  <span className="text-emerald shrink-0"><CheckIcon /></span>
                )}
              </button>
            ))}

            <div className="mx-2 my-1 h-px bg-line" />

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <PlusIcon />
              Nuevo workspace
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
