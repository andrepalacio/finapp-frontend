import { apiClient }              from '@/lib/api/client'
import type { Budget }           from '@/types/domain'
import type { UpsertBudgetInput } from '@/domains/budget/schemas'

export const budget = {
  get(wsId: string, year: number, month: number) {
    return apiClient.get<Budget>(`/workspaces/${wsId}/budgets/${year}/${month}`)
  },
  upsert(wsId: string, data: UpsertBudgetInput) {
    return apiClient.put<Budget>(`/workspaces/${wsId}/budgets/${data.year}/${data.month}`, data)
  },
  delete(wsId: string, year: number, month: number) {
    return apiClient.delete<void>(`/workspaces/${wsId}/budgets/${year}/${month}`)
  },
}
