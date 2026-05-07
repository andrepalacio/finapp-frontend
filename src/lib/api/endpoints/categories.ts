import { apiClient }              from '@/lib/api/client'
import type { Category }         from '@/types/domain'
import type { CreateCategoryInput } from '@/domains/categories/schemas'

export const categories = {
  list(wsId: string) {
    return apiClient.get<Category[]>(`/workspaces/${wsId}/categories`)
  },
  create(wsId: string, data: CreateCategoryInput) {
    return apiClient.post<Category>(`/workspaces/${wsId}/categories`, data)
  },
  update(wsId: string, id: string, data: Partial<CreateCategoryInput>) {
    return apiClient.put<Category>(`/workspaces/${wsId}/categories/${id}`, data)
  },
  delete(wsId: string, id: string) {
    return apiClient.delete<void>(`/workspaces/${wsId}/categories/${id}`)
  },
}
