import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, ApiError } from './client'

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('apiClient refresh dedup', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shares a single /api/auth/refresh call across concurrent 401s', async () => {
    let refreshCalls = 0
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url === '/api/auth/refresh') {
        refreshCalls++
        return jsonResponse(200, { ok: true })
      }
      if (url.startsWith('/api/proxy/protected')) {
        // First pass (before refresh) → 401. After refresh → 200.
        return refreshCalls > 0
          ? jsonResponse(200, { data: 'ok' })
          : jsonResponse(401, { error: 'expired', code: 'UNAUTHORIZED' })
      }
      throw new Error(`unexpected fetch to ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const [a, b, c] = await Promise.all([
      apiClient.get('/protected'),
      apiClient.get('/protected'),
      apiClient.get('/protected'),
    ])

    expect(a).toEqual({ data: 'ok' })
    expect(b).toEqual({ data: 'ok' })
    expect(c).toEqual({ data: 'ok' })
    expect(refreshCalls).toBe(1)
  })

  it('throws ApiError and does not retry when refresh fails', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url === '/api/auth/refresh') return jsonResponse(401, { error: 'expired' })
      if (url.startsWith('/api/proxy/protected')) {
        return jsonResponse(401, { error: 'expired', code: 'UNAUTHORIZED' })
      }
      throw new Error(`unexpected fetch to ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)
    // jsdom throws on real navigation assignment — stub it out.
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    await expect(apiClient.get('/protected')).rejects.toBeInstanceOf(ApiError)
  })
})
