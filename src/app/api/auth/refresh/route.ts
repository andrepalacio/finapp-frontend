import { NextResponse } from 'next/server'
import { cookies }      from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'
const IS_PROD  = process.env.NODE_ENV === 'production'

export async function POST() {
  const jar          = cookies()
  const refreshToken = jar.get('refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!res.ok) {
    jar.delete('access_token')
    jar.delete('refresh_token')
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
  }

  const tokens = await res.json() as { access_token: string; refresh_token: string }

  const cookieOpts = (maxAge: number) => ({
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'lax' as const,
    path:     '/',
    maxAge,
  })

  jar.set('access_token',  tokens.access_token,  cookieOpts(60 * 15))
  jar.set('refresh_token', tokens.refresh_token, cookieOpts(60 * 60 * 24 * 7))

  return NextResponse.json({ ok: true })
}
