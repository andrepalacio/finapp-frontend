import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '.auth/session.json')

setup('authenticate', async ({ page }) => {
  await page.context().clearCookies()
  await page.goto('/login')

  await page.getByLabel(/correo|email/i).fill(process.env.E2E_EMAIL ?? 'test@finapp.dev')
  await page.getByLabel(/contrasena|password/i).fill(process.env.E2E_PASSWORD ?? 'Test1234!')
  await page.getByRole('button', { name: /iniciar sesion|entrar|login/i }).click()

  // If user has multiple workspaces, the picker is shown — click the first one
  await page.waitForURL(/\/($|\?|w\/)/, { timeout: 10_000 })
  if (!page.url().includes('/w/')) {
    await page.locator('a[href^="/w/"]').first().click()
    await page.waitForURL(/\/w\/[a-f0-9-]+/, { timeout: 10_000 })
  }
  await expect(page).toHaveURL(/\/w\//)

  await page.context().storageState({ path: authFile })
})
