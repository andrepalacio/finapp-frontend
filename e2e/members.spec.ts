import { test, expect } from '@playwright/test'

test.describe('Members & Invitations', () => {
  test('settings shows member list', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: /ajustes/i })).toBeVisible()
    await expect(page.getByText(/miembros/i).first()).toBeVisible()
  })

  test('invite form visible for owner', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByPlaceholder(/email@/i).first()).toBeVisible()
  })

  test('send invitation', async ({ page }) => {
    await page.goto('/settings')
    await page.getByPlaceholder(/email@/i).first().fill('nuevo@finapp.dev')
    await page.getByRole('button', { name: /invitar/i }).first().click()
    await expect(page.getByText('nuevo@finapp.dev').first()).toBeVisible({ timeout: 5_000 })
  })
})
