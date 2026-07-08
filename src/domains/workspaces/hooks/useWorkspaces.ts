'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaces }                             from '@/lib/api'
import type { CreateWorkspaceInput }              from '@/domains/workspaces/schemas'

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn:  () => workspaces.list(),
  })
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn:  () => workspaces.get(id),
    enabled:  !!id,
  })
}

export function useCreateWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => workspaces.create(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}

export function useUpdateWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateWorkspaceInput }) =>
      workspaces.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}

export function useDeleteWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => workspaces.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}
