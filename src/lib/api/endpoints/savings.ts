import { apiClient }           from '@/lib/api/client'
import type { SavingsGoalProgress, SavingsContribution } from '@/types/domain'
import type { CreateSavingsGoalInput, CreateContributionInput } from '@/domains/savings/schemas'

export const savings = {
  list(wsId: string) {
    return apiClient.get<SavingsGoalProgress[]>(`/workspaces/${wsId}/savings`)
  },
  get(wsId: string, id: string) {
    return apiClient.get<SavingsGoalProgress>(`/workspaces/${wsId}/savings/${id}`)
  },
  create(wsId: string, data: CreateSavingsGoalInput) {
    return apiClient.post<SavingsGoalProgress>(`/workspaces/${wsId}/savings`, data)
  },
  update(wsId: string, id: string, data: Partial<CreateSavingsGoalInput>) {
    return apiClient.put<SavingsGoalProgress>(`/workspaces/${wsId}/savings/${id}`, data)
  },
  delete(wsId: string, id: string) {
    return apiClient.delete<void>(`/workspaces/${wsId}/savings/${id}`)
  },
  contributions: {
    list(wsId: string, goalId: string) {
      return apiClient.get<SavingsContribution[]>(`/workspaces/${wsId}/savings/${goalId}/contributions`)
    },
    create(wsId: string, goalId: string, data: CreateContributionInput) {
      return apiClient.post<SavingsContribution>(`/workspaces/${wsId}/savings/${goalId}/contributions`, data)
    },
    delete(wsId: string, goalId: string, id: string) {
      return apiClient.delete<void>(`/workspaces/${wsId}/savings/${goalId}/contributions/${id}`)
    },
  },
}
