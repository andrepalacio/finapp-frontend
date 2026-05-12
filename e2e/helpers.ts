import { Page } from '@playwright/test'

/**
 * Navigates to / and resolves to a workspace URL.
 * If workspace picker is shown (multiple workspaces), clicks the first one.
 * Returns the workspace ID.
 */
export async function gotoWorkspace(page: Page): Promise<string> {
  await page.goto('/')
  await page.waitForURL(/\/($|\?|w\/)/, { timeout: 10_000 })

  if (!page.url().includes('/w/')) {
    await page.locator('a[href^="/w/"]').first().click()
    await page.waitForURL(/\/w\/[a-f0-9-]+/, { timeout: 10_000 })
  }

  const wsId = page.url().match(/\/w\/([a-f0-9-]+)/)?.[1]
  if (!wsId) throw new Error(`Could not extract workspace ID from URL: ${page.url()}`)
  return wsId
}
