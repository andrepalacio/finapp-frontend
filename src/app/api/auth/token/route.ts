import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('access_token')?.value
  if (!token) {
    return Response.json({ token: null }, { status: 401 })
  }
  return Response.json({ token })
}
