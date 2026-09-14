'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import Link                    from 'next/link'
import { getLastWorkspaceId }  from '@/lib/workspace-storage'
import type { Workspace }      from '@/types/domain'

interface Props {
  workspaces: Workspace[]
}

// Redirects straight to the last active workspace when it still exists;
// otherwise lets the user pick one.
export function WorkspacePicker({ workspaces }: Props) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const lastId = getLastWorkspaceId()
    if (lastId && workspaces.some((w) => w.id === lastId)) {
      router.replace(`/w/${lastId}`)
      return
    }
    setChecked(true)
  }, [router, workspaces])

  if (!checked) return null

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <span className="font-serif text-2xl text-ink tracking-tight">finapp</span>
          <h1 className="font-serif text-[36px] leading-[1.05] tracking-tight mt-4 mb-2">
            Elige un workspace.
          </h1>
          <p className="text-ink-3 text-sm">
            Selecciona en cual quieres trabajar hoy.
          </p>
        </div>

        <div className="space-y-3">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/w/${ws.id}`}
              className="flex items-center justify-between bg-surface border border-line rounded-[var(--r-lg)] px-5 py-4 hover:shadow-[var(--shadow-md)] hover:border-ink/20 transition-all group"
            >
              <div>
                <p className="font-medium text-ink text-[15px]">{ws.name}</p>
                <p className="text-xs text-ink-3 mt-0.5">{ws.currency}</p>
              </div>
              <span className="text-ink-4 group-hover:text-ink transition-colors text-lg leading-none">
                &rarr;
              </span>
            </Link>
          ))}
        </div>

        <p className="text-center text-[13px] text-ink-3 mt-6">
          <Link
            href="/onboarding"
            className="text-ink font-medium hover:text-ink-2 transition-colors"
          >
            + Crear nuevo workspace
          </Link>
        </p>
      </div>
    </div>
  )
}
