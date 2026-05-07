import { QueryClient } from '@tanstack/react-query'

let client: QueryClient | undefined

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: new client per request
    return new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000 } },
    })
  }
  // Client: singleton
  if (!client) {
    client = new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000 } },
    })
  }
  return client
}
