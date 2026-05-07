import { apiClient }           from '@/lib/api/client'
import type { Debt, DebtPayment, DebtScheduleInstallment } from '@/types/domain'
import type { CreateDebtInput } from '@/domains/debts/schemas'

export interface CreatePaymentInput {
  period:  number
  amount:  number
  paid_at: string
  notes?:  string | null
}

export const debts = {
  list(wsId: string) {
    return apiClient.get<Debt[]>(`/workspaces/${wsId}/debts`)
  },
  get(wsId: string, id: string) {
    return apiClient.get<Debt>(`/workspaces/${wsId}/debts/${id}`)
  },
  create(wsId: string, data: CreateDebtInput) {
    return apiClient.post<Debt>(`/workspaces/${wsId}/debts`, data)
  },
  update(wsId: string, id: string, data: Partial<CreateDebtInput>) {
    return apiClient.put<Debt>(`/workspaces/${wsId}/debts/${id}`, data)
  },
  delete(wsId: string, id: string) {
    return apiClient.delete<void>(`/workspaces/${wsId}/debts/${id}`)
  },
  schedule(wsId: string, id: string) {
    return apiClient.get<DebtScheduleInstallment[]>(`/workspaces/${wsId}/debts/${id}/schedule`)
  },
  payments: {
    list(wsId: string, debtId: string) {
      return apiClient.get<DebtPayment[]>(`/workspaces/${wsId}/debts/${debtId}/payments`)
    },
    create(wsId: string, debtId: string, data: CreatePaymentInput) {
      return apiClient.post<DebtPayment>(`/workspaces/${wsId}/debts/${debtId}/payments`, data)
    },
    delete(wsId: string, debtId: string, id: string) {
      return apiClient.delete<void>(`/workspaces/${wsId}/debts/${debtId}/payments/${id}`)
    },
  },
}
