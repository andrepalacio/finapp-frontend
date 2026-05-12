import { test, expect } from '@playwright/test'
import { gotoWorkspace } from './helpers'

test.describe('Transactions', () => {
  test('create expense transaction', async ({ page }) => {
    const wsId = await gotoWorkspace(page)
    expect(wsId).toBeTruthy()

    await page.goto(`/w/${wsId}/transactions`)
    await expect(page.getByRole('main').getByRole('heading', { name: /transacciones/i })).toBeVisible()

    await page.getByRole('button', { name: /nueva/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Select expense type
    await page.getByRole('radio', { name: /gasto|expense/i }).click({ force: true })

    // Fill amount
    await page.getByPlaceholder('50000').fill('25000')

    // Fill description
    await page.getByPlaceholder(/mercado semanal/i).fill('Almuerzo E2E')

    await page.getByRole('button', { name: /agregar|guardar|crear|save/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 })

    await expect(page.getByText('Almuerzo E2E')).toBeVisible({ timeout: 5_000 })
  })

  test('edit and delete transaction', async ({ page }) => {
    const wsId = await gotoWorkspace(page)

    await page.goto(`/w/${wsId}/transactions`)

    // Find the transaction created above and click edit
    const card = page.getByText('Almuerzo E2E').first()
    await card.click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: /eliminar|delete/i }).click()

    await expect(page.getByText('Almuerzo E2E')).not.toBeVisible({ timeout: 5_000 })
  })
})
