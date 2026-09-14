const KEY = 'finapp:lastWorkspaceId'

export function getLastWorkspaceId(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setLastWorkspaceId(id: string): void {
  try {
    localStorage.setItem(KEY, id)
  } catch {
    // ignore — private mode / storage disabled
  }
}
