'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savings }                                from '@/lib/api'
import type { CreateSavingsGoalInput, CreateContributionInput } from '@/domains/savings/schemas'

export function useSavingsGoals(workspaceId: string) {
  return useQuery({
    queryKey: ['savings', workspaceId],
    queryFn:  () => savings.list(workspaceId),
    enabled:  !!workspaceId,
  })
}

export function useSavingsGoal(workspaceId: string, id: string) {
  return useQuery({
    queryKey: ['savings', workspaceId, id],
    queryFn:  () => savings.get(workspaceId, id),
    enabled:  !!workspaceId && !!id,
  })
}

export function useCreateSavingsGoal(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSavingsGoalInput) => savings.create(workspaceId, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['savings', workspaceId] }),
  })
}

export function useDeleteSavingsGoal(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => savings.delete(workspaceId, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['savings', workspaceId] }),
  })
}

export function useCreateContribution(workspaceId: string, goalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContributionInput) =>
      savings.contributions.create(workspaceId, goalId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings', workspaceId] })
      qc.invalidateQueries({ queryKey: ['savings', workspaceId, goalId] })
    },
  })
}
