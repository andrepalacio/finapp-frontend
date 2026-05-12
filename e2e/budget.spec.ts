import { test, expect } from '@playwright/test'
import { gotoWorkspace } from './helpers'

test.describe('Budget', () => {
  test('shows budget page and create budget', async ({ page }) => {
    const wsId = await gotoWorkspace(page)

    await page.goto(`/w/${wsId}/budget`)
    await expect(page.getByText(/presupuesto|budget/i).first()).toBeVisible()

    // If no budget, expect create button
    const createBtn = page.getByRole('button', { name: /crear presupuesto/i })
    if (await createBtn.isVisible()) {
      await createBtn.click()
      await page.getByPlaceholder(/limite|limit/i).fill('500000')
      await page.getByRole('button', { name: /guardar|save/i }).click()
      await expect(page.getByText('500.000')).toBeVisible({ timeout: 5_000 })
    }
  })
})
