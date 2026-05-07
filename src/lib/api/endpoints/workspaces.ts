import { apiClient }                from '@/lib/api/client'
import type { Workspace }          from '@/types/domain'
import type { CreateWorkspaceInput } from '@/domains/workspaces/schemas'

export const workspaces = {
  list() {
    return apiClient.get<Workspace[]>('/workspaces')
  },
  get(id: string) {
    return apiClient.get<Workspace>(`/workspaces/${id}`)
  },
  create(data: CreateWorkspaceInput) {
    return apiClient.post<Workspace>('/workspaces', data)
  },
  update(id: string, data: Partial<CreateWorkspaceInput>) {
    return apiClient.put<Workspace>(`/workspaces/${id}`, data)
  },
  delete(id: string) {
    return apiClient.delete<void>(`/workspaces/${id}`)
  },
}
