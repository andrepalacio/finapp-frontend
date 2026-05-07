'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debts }                                  from '@/lib/api'
import type { CreateDebtInput }                   from '@/domains/debts/schemas'
import type { CreatePaymentInput }                from '@/lib/api/endpoints/debts'

export function useDebts(workspaceId: string) {
  return useQuery({
    queryKey: ['debts', workspaceId],
    queryFn:  () => debts.list(workspaceId),
    enabled:  !!workspaceId,
  })
}

export function useDebt(workspaceId: string, id: string) {
  return useQuery({
    queryKey: ['debts', workspaceId, id],
    queryFn:  () => debts.get(workspaceId, id),
    enabled:  !!workspaceId && !!id,
  })
}

export function useDebtSchedule(workspaceId: string, debtId: string) {
  return useQuery({
    queryKey: ['debts', workspaceId, debtId, 'schedule'],
    queryFn:  () => debts.schedule(workspaceId, debtId),
    enabled:  !!workspaceId && !!debtId,
  })
}

export function useCreateDebt(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDebtInput) => debts.create(workspaceId, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['debts', workspaceId] }),
  })
}

export function useDeleteDebt(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => debts.delete(workspaceId, id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['debts', workspaceId] }),
  })
}

export function useCreatePayment(workspaceId: string, debtId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentInput) =>
      debts.payments.create(workspaceId, debtId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['debts', workspaceId, debtId] })
      qc.invalidateQueries({ queryKey: ['debts', workspaceId, debtId, 'schedule'] })
    },
  })
}
