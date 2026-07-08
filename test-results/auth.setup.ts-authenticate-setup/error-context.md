# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> authenticate
- Location: e2e/auth.setup.ts:6:6

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e8]:
        - text: finapp
        - paragraph [ref=e9]: Tu dinero, en orden.
      - generic [ref=e10]:
        - blockquote [ref=e11]:
          - text: “Cada peso que registras
          - text: es un peso que entiendes.”
        - generic [ref=e12]:
          - generic [ref=e13]: Privado por diseno
          - generic [ref=e14]: ·
          - generic [ref=e15]: Open source
          - generic [ref=e16]: ·
          - generic [ref=e17]: Hecho en Colombia
    - generic [ref=e19]:
      - paragraph [ref=e20]: Bienvenido de vuelta
      - heading "Entra a tu cuenta" [level=1] [ref=e21]
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: Correo
          - textbox "Correo" [ref=e25]: test@finapp.dev
        - generic [ref=e26]:
          - generic [ref=e28]: Contrasena
          - generic [ref=e29]:
            - textbox "Contrasena" [ref=e30]: Test1234!
            - button "Ver" [ref=e31] [cursor=pointer]
        - paragraph [ref=e32]: Request failed
        - button "Entrar" [ref=e33] [cursor=pointer]
        - generic [ref=e34]: o
        - paragraph [ref=e37]:
          - text: Primera vez por aqui?
          - link "Crea una cuenta" [ref=e38] [cursor=pointer]:
            - /url: /register
  - region "Notifications alt+T"
  - generic [ref=e39]:
    - img [ref=e41]
    - button "Open Tanstack query devtools" [ref=e89] [cursor=pointer]:
      - img [ref=e90]
  - alert [ref=e138]
```

# Test source

```ts
  1  | import { test as setup, expect } from '@playwright/test'
  2  | import path from 'path'
  3  | 
  4  | const authFile = path.join(__dirname, '.auth/session.json')
  5  | 
  6  | setup('authenticate', async ({ page }) => {
  7  |   await page.context().clearCookies()
  8  |   await page.goto('/login')
  9  | 
  10 |   await page.getByLabel(/correo|email/i).fill(process.env.E2E_EMAIL ?? 'test@finapp.dev')
  11 |   await page.getByLabel(/contrasena|password/i).fill(process.env.E2E_PASSWORD ?? 'Test1234!')
  12 |   await page.getByRole('button', { name: /iniciar sesion|entrar|login/i }).click()
  13 | 
  14 |   // If user has multiple workspaces, the picker is shown — click the first one
> 15 |   await page.waitForURL(/\/($|\?|w\/)/, { timeout: 10_000 })
     |              ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
  16 |   if (!page.url().includes('/w/')) {
  17 |     await page.locator('a[href^="/w/"]').first().click()
  18 |     await page.waitForURL(/\/w\/[a-f0-9-]+/, { timeout: 10_000 })
  19 |   }
  20 |   await expect(page).toHaveURL(/\/w\//)
  21 | 
  22 |   await page.context().storageState({ path: authFile })
  23 | })
  24 | 
```