'use client'

import { useMutation } from '@tanstack/react-query'
import { auth }        from '@/lib/api'
import { setSession, clearSession } from '@/lib/auth/session'
import type { LoginInput, RegisterInput } from '@/domains/auth/schemas'

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const tokens = await auth.login(data)
      await setSession({ access_token: tokens.access_token, refresh_token: tokens.refresh_token })
      return tokens
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const tokens = await auth.register(data)
      await setSession({ access_token: tokens.access_token, refresh_token: tokens.refresh_token })
      return tokens
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await clearSession()
    },
  })
}
