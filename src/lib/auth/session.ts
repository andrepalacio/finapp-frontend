'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  cookieOptions,
} from './constants'

export async function setSession(tokens: {
  access_token: string
  refresh_token: string
}): Promise<void> {
  const jar = await cookies()
  jar.set(ACCESS_TOKEN_COOKIE, tokens.access_token, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  jar.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, cookieOptions(REFRESH_TOKEN_MAX_AGE))
}

export async function clearSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(ACCESS_TOKEN_COOKIE)
  jar.delete(REFRESH_TOKEN_COOKIE)
}

export async function getAccessToken(): Promise<string | null> {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value ?? null
}

export async function getRefreshToken(): Promise<string | null> {
  return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value ?? null
}

export async function requireAuth(): Promise<string> {
  const token = await getAccessToken()
  if (!token) redirect('/login')
  return token
}
