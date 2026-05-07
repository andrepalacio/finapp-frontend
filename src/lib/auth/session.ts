'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ACCESS_TOKEN  = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const IS_PROD = process.env.NODE_ENV === 'production'

export async function setSession(tokens: {
  access_token: string
  refresh_token: string
}): Promise<void> {
  const jar = cookies()
  jar.set(ACCESS_TOKEN, tokens.access_token, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'lax',
    maxAge:   60 * 15,        // 15 min
    path:     '/',
  })
  jar.set(REFRESH_TOKEN, tokens.refresh_token, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  })
}

export async function clearSession(): Promise<void> {
  const jar = cookies()
  jar.delete(ACCESS_TOKEN)
  jar.delete(REFRESH_TOKEN)
}

export async function getAccessToken(): Promise<string | null> {
  return cookies().get(ACCESS_TOKEN)?.value ?? null
}

export async function getRefreshToken(): Promise<string | null> {
  return cookies().get(REFRESH_TOKEN)?.value ?? null
}

export async function requireAuth(): Promise<string> {
  const token = await getAccessToken()
  if (!token) redirect('/login')
  return token
}
