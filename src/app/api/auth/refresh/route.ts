import { NextResponse } from 'next/server'
import { cookies }      from 'next/headers'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  cookieOptions,
} from '@/lib/auth/constants'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export async function POST() {
  const jar          = await cookies()
  const refreshToken = jar.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!res.ok) {
    jar.delete(ACCESS_TOKEN_COOKIE)
    jar.delete(REFRESH_TOKEN_COOKIE)
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
  }

  const tokens = await res.json() as { access_token: string; refresh_token: string }

  jar.set(ACCESS_TOKEN_COOKIE, tokens.access_token, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  jar.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, cookieOptions(REFRESH_TOKEN_MAX_AGE))

  return NextResponse.json({ ok: true })
}
