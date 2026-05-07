'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactions }                           from '@/lib/api'
import type { ListTransactionsParams }            from '@/lib/api/endpoints/transactions'
import type { CreateTransactionInput }            from '@/domains/transactions/schemas'

export function useTransactions(workspaceId: string, params?: ListTransactionsParams) {
  return useQuery({
    queryKey: ['transactions', workspaceId, params],
    queryFn:  () => transactions.list(workspaceId, params),
    enabled:  !!workspaceId,
  })
}

export function useTransaction(workspaceId: string, id: string) {
  return useQuery({
    queryKey: ['transactions', workspaceId, id],
    queryFn:  () => transactions.get(workspaceId, id),
    enabled:  !!workspaceId && !!id,
  })
}

export function useCreateTransaction(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionInput) =>
      transactions.create(workspaceId, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['transactions', workspaceId] }),
  })
}

export function useDeleteTransaction(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactions.delete(workspaceId, id),
    onSuccess:  () =>
      qc.invalidateQueries({ queryKey: ['transactions', workspaceId] }),
  })
}

export function useTransactionSummary(
  workspaceId: string,
  params: { date_from: string; date_to: string },
) {
  return useQuery({
    queryKey: ['transactions', workspaceId, 'summary', params],
    queryFn:  () => transactions.summary(workspaceId, params),
    enabled:  !!workspaceId,
  })
}
