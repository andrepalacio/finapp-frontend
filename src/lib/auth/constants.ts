export const ACCESS_TOKEN_COOKIE = 'access_token'
export const REFRESH_TOKEN_COOKIE = 'refresh_token'

const IS_PROD = process.env.NODE_ENV === 'production'

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export const ACCESS_TOKEN_MAX_AGE = 60 * 15 // 15 min
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
