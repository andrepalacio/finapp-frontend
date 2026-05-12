import { test, expect } from '@playwright/test'
import path from 'path'
import * as fs from 'fs'
import { gotoWorkspace } from './helpers'

test.describe('XLSX Import', () => {
  test('download template link exists', async ({ page }) => {
    const wsId = await gotoWorkspace(page)

    await page.goto(`/w/${wsId}/transactions`)
    await page.getByRole('button', { name: /importar/i }).click()
    await expect(page.getByText(/descargar plantilla/i)).toBeVisible()
  })

  test('upload invalid file shows error', async ({ page }) => {
    const wsId = await gotoWorkspace(page)

    await page.goto(`/w/${wsId}/transactions`)
    await page.getByRole('button', { name: /importar/i }).click()

    // Create a temp txt file (not xlsx)
    const tmpFile = path.join('/tmp', 'test_import.txt')
    fs.writeFileSync(tmpFile, 'not an xlsx')

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('input[type=file]').dispatchEvent('click'),
    ])
    await fileChooser.setFiles(tmpFile)

    await expect(page.getByText(/solo se aceptan archivos .xlsx/i)).toBeVisible({ timeout: 3_000 })

    fs.unlinkSync(tmpFile)
  })
})
