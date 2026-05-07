import { apiClient }              from '@/lib/api/client'
import type { AuthTokens, User } from '@/types/domain'
import type { LoginInput, RegisterInput } from '@/domains/auth/schemas'

export const auth = {
  login(data: LoginInput) {
    return apiClient.post<AuthTokens>('/auth/login', data)
  },
  register(data: RegisterInput) {
    return apiClient.post<AuthTokens>('/auth/register', data)
  },
  refresh(refreshToken: string) {
    return apiClient.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken })
  },
  me() {
    return apiClient.get<User>('/user/me')
  },
}
