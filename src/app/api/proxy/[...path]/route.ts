import { cookies } from 'next/headers'

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://host.docker.internal:8080/api/v1'

async function handler(req: Request) {
  const path = req.url.split('/api/proxy')[1] ?? ''
  if (!path) return Response.json({ error: 'Missing path' }, { status: 400 })

  const token = cookies().get('access_token')?.value
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined

  const res = await fetch(`${BACKEND}${path}`, {
    method: req.method,
    headers,
    body,
    cache: 'no-store',
  })

  const data = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    return Response.json(
      { error: (data as { error?: string })?.error ?? 'Request failed', code: (data as { code?: string })?.code ?? 'UNKNOWN' },
      { status: res.status },
    )
  }

  if (res.status === 204) return new Response(null, { status: 204 })
  return Response.json(data)
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }
