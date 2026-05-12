'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budget }                                 from '@/lib/api'
import type { UpsertBudgetInput }                 from '@/domains/budget/schemas'

export function useBudget(workspaceId: string, year: number, month: number) {
  return useQuery({
    queryKey: ['budget', workspaceId, year, month],
    queryFn:  () => budget.get(workspaceId, year, month),
    enabled:  !!workspaceId,
    retry:    (count, err: { status?: number } & Error) => {
      if (err?.status === 404) return false
      return count < 2
    },
  })
}

export function useUpsertBudget(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpsertBudgetInput) => budget.upsert(workspaceId, data),
    onSuccess:  (result) => {
      qc.invalidateQueries({ queryKey: ['budget', workspaceId, result.year, result.month] })
    },
  })
}

export function useDeleteBudget(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budget.delete(workspaceId, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['budget', workspaceId] }),
  })
}
