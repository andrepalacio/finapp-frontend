'use client'

import { useRouter } from 'next/navigation'
import { clearSession } from '@/lib/auth/session'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await clearSession()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2.5 text-sm font-medium text-terra border border-terra-bg rounded-[var(--r-sm)] hover:bg-terra-bg/40 transition-colors"
    >
      Cerrar sesion
    </button>
  )
}
