'use client'

import { useEffect } from 'react'
import { setLastWorkspaceId } from '@/lib/workspace-storage'

// Persists the workspace the user is currently viewing so the root
// dashboard page can redirect back to it on the next visit.
export function RememberWorkspace({ workspaceId }: { workspaceId: string }) {
  useEffect(() => {
    setLastWorkspaceId(workspaceId)
  }, [workspaceId])

  return null
}
