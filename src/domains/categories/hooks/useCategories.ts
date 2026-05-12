'use client'

import { useQuery } from '@tanstack/react-query'
import { categories } from '@/lib/api'

export function useCategories(workspaceId: string) {
  return useQuery({
    queryKey: ['categories', workspaceId],
    queryFn:  () => categories.list(workspaceId),
    enabled:  !!workspaceId,
    staleTime: 5 * 60 * 1000, // categories change rarely
  })
}
