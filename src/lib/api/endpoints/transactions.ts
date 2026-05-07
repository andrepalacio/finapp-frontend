import { apiClient }                     from '@/lib/api/client'
import type { Transaction, DailySummary } from '@/types/domain'
import type { CursorResponse }            from '@/types/api'
import type { CreateTransactionInput }    from '@/domains/transactions/schemas'

export interface ListTransactionsParams {
  limit?:       number
  cursor?:      string
  type?:        string
  category_id?: string
  date_from?:   string
  date_to?:     string
}

export const transactions = {
  list(wsId: string, params?: ListTransactionsParams) {
    return apiClient.get<CursorResponse<Transaction>>(`/workspaces/${wsId}/transactions`, params as Record<string, unknown>)
  },
  get(wsId: string, id: string) {
    return apiClient.get<Transaction>(`/workspaces/${wsId}/transactions/${id}`)
  },
  create(wsId: string, data: CreateTransactionInput) {
    return apiClient.post<Transaction>(`/workspaces/${wsId}/transactions`, data)
  },
  update(wsId: string, id: string, data: Partial<CreateTransactionInput>) {
    return apiClient.put<Transaction>(`/workspaces/${wsId}/transactions/${id}`, data)
  },
  delete(wsId: string, id: string) {
    return apiClient.delete<void>(`/workspaces/${wsId}/transactions/${id}`)
  },
  summary(wsId: string, params: { date_from: string; date_to: string }) {
    return apiClient.get<DailySummary[]>(`/workspaces/${wsId}/transactions/summary`, params as Record<string, unknown>)
  },
}
