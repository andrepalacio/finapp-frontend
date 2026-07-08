import { apiClient }                from '@/lib/api/client'
import type { Workspace, WorkspaceMember, WorkspaceInvitation, AlertsResponse, WorkspaceSummary } from '@/types/domain'
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

  members: {
    list(wsId: string) {
      return apiClient.get<WorkspaceMember[]>(`/workspaces/${wsId}/members`)
    },
    updateRole(wsId: string, userId: string, role: string) {
      return apiClient.put<void>(`/workspaces/${wsId}/members/${userId}/role`, { role })
    },
    remove(wsId: string, userId: string) {
      return apiClient.delete<void>(`/workspaces/${wsId}/members/${userId}`)
    },
  },

  invitations: {
    list(wsId: string) {
      return apiClient.get<WorkspaceInvitation[]>(`/workspaces/${wsId}/invitations`)
    },
    send(wsId: string, email: string, role: string) {
      return apiClient.post<WorkspaceInvitation>(`/workspaces/${wsId}/invitations`, { email, role })
    },
    cancel(wsId: string, invId: string) {
      return apiClient.delete<void>(`/workspaces/${wsId}/invitations/${invId}`)
    },
    accept(token: string) {
      return apiClient.get<WorkspaceInvitation>(`/invitations/accept?token=${token}`)
    },
  },

  summary(wsId: string, params?: { date_from?: string; date_to?: string }) {
    return apiClient.get<WorkspaceSummary>(`/workspaces/${wsId}/summary`, params)
  },

  alerts(wsId: string) {
    return apiClient.get<AlertsResponse>(`/workspaces/${wsId}/alerts`)
  },
}
