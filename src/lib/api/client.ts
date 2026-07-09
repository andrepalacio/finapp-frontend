// Server inside Docker → host.docker.internal. Client in browser → /api/proxy.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function getAuthHeader(): Promise<HeadersInit> {
  // Server-side only — client routes through /api/proxy which handles auth
  try {
    const { cookies } = await import('next/headers')
    const token = (await cookies()).get('access_token')?.value
    if (token) return { Authorization: `Bearer ${token}` }
  } catch {
    // Outside request context (build time, edge runtime without cookies)
  }
  return {}
}

// Concurrent 401s after token expiry must share one refresh call — the
// backend rotates the refresh token single-use, so parallel refreshes race
// and the losers get logged out spuriously.
let refreshPromise: Promise<boolean> | null = null

function refreshToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function fetchApi<T>(
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, unknown>,
  _retried = false,
): Promise<T> {
  const isClient = typeof window !== 'undefined'

  // Client → proxy (same-origin, no CORS, auth handled server-side).
  // Server → backend directly (Docker DNS resolves host.docker.internal).
  const urlBase = isClient ? '/api/proxy' : BACKEND_URL

  let url = `${urlBase}${path}`
  if (query && Object.keys(query).length > 0) {
    const qs = new URLSearchParams(
      Object.entries(query)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    )
    url = `${url}?${qs}`
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!isClient) {
    const authHeader = await getAuthHeader()
    Object.assign(headers, authHeader)
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    cache: method === 'GET' ? 'no-store' : undefined,
  })

  // Client-side 401: attempt silent token refresh once
  if (res.status === 401 && !_retried && isClient) {
    const refreshed = await refreshToken()
    if (refreshed) {
      return fetchApi<T>(method, path, body, query, true)
    }
    window.location.href = '/login'
    throw new ApiError('UNAUTHORIZED', 'Sesion expirada', 401)
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: 'Request failed', code: 'UNKNOWN' }))
    throw new ApiError(
      payload.code ?? 'UNKNOWN',
      payload.error ?? 'Request failed',
      res.status,
    )
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// Browser-only (FormData/File), always routes through /api/proxy same-origin.
async function postForm<T>(path: string, form: FormData, _retried = false): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    method:      'POST',
    body:        form,
    credentials: 'include',
  })

  if (res.status === 401 && !_retried) {
    const refreshed = await refreshToken()
    if (refreshed) {
      return postForm<T>(path, form, true)
    }
    window.location.href = '/login'
    throw new ApiError('UNAUTHORIZED', 'Sesion expirada', 401)
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: 'Request failed', code: 'UNKNOWN' }))
    throw new ApiError(payload.code ?? 'UNKNOWN', payload.error ?? 'Request failed', res.status)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get:      <T>(path: string, query?: Record<string, unknown>) => fetchApi<T>('GET', path, undefined, query),
  post:     <T>(path: string, body: unknown) => fetchApi<T>('POST', path, body),
  put:      <T>(path: string, body: unknown) => fetchApi<T>('PUT', path, body),
  delete:   <T = void>(path: string) => fetchApi<T>('DELETE', path),
  postForm: <T>(path: string, form: FormData) => postForm<T>(path, form),
}
