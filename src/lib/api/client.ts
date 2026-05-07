const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

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
  // Server-side: read httpOnly cookie via next/headers
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const token = cookies().get('access_token')?.value
      if (token) return { Authorization: `Bearer ${token}` }
    } catch {
      // Not in a request context (e.g. build time)
    }
  }
  return {}
}

async function fetchApi<T>(
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, unknown>,
): Promise<T> {
  const authHeader = await getAuthHeader()

  let url = `${BASE_URL}${path}`
  if (query && Object.keys(query).length > 0) {
    const qs = new URLSearchParams(
      Object.entries(query)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    )
    url = `${url}?${qs}`
  }

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

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

export const apiClient = {
  get:    <T>(path: string, query?: Record<string, unknown>) => fetchApi<T>('GET', path, undefined, query),
  post:   <T>(path: string, body: unknown) => fetchApi<T>('POST', path, body),
  put:    <T>(path: string, body: unknown) => fetchApi<T>('PUT', path, body),
  delete: <T = void>(path: string) => fetchApi<T>('DELETE', path),
}
