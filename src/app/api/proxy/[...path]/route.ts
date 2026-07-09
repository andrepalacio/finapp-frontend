import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/constants'

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://host.docker.internal:8080/api/v1'

async function handler(req: Request) {
  const path = req.url.split('/api/proxy')[1] ?? ''
  if (!path) return Response.json({ error: 'Missing path' }, { status: 400 })

  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  // Preserve the caller's Content-Type (incl. multipart boundary for file
  // uploads) instead of forcing JSON — arrayBuffer keeps binary bodies intact.
  if (hasBody) headers['Content-Type'] = req.headers.get('content-type') ?? 'application/json'
  const body = hasBody ? await req.arrayBuffer() : undefined

  const res = await fetch(`${BACKEND}${path}`, {
    method: req.method,
    headers,
    body,
    cache: 'no-store',
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!isJson) {
    // File downloads (e.g. xlsx template/export) — stream through as-is.
    if (!res.ok) return Response.json({ error: 'Request failed', code: 'UNKNOWN' }, { status: res.status })
    const passthroughHeaders: Record<string, string> = { 'Content-Type': contentType }
    const disposition = res.headers.get('content-disposition')
    if (disposition) passthroughHeaders['Content-Disposition'] = disposition
    return new Response(res.body, { status: res.status, headers: passthroughHeaders })
  }

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
