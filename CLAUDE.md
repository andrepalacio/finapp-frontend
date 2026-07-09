# finapp-frontend — Contexto Claude Code (Frontend Next.js)

> Claude Code lee este archivo automáticamente cuando se ejecuta dentro de `finapp-frontend/`.
> Este es un repositorio independiente. El backend vive en github.com/[user]/finapp-backend.

---

## Propósito de este servicio

UI de FinApp construida con Next.js 15 (App Router). Consume la API REST del backend Go a través de un proxy same-origin (`/api/proxy/*`). No tiene lógica de negocio propia — toda la lógica vive en el backend.

**Puerto:** 3000 (desarrollo) → 80/443 (producción via Railway, Dockerfile multi-stage con `output: 'standalone'`)
**Framework:** Next.js 15.5.18 con App Router (no Pages Router)
**React:** 18.3.1 (Next 15.5 soporta React 18.3 sin forzar React 19)

---

## Stack de UI

| Herramienta | Uso |
|---|---|
| shadcn/ui + Radix | Componentes base (Dialog, Select, Dropdown, etc.) |
| Tailwind CSS v3 | Utilidades + design tokens via CSS vars |
| TanStack Query v5 | Server state, cache, mutations |
| react-hook-form + zod | Formularios y validación |
| Recharts | Gráficas financieras |
| Inter + Instrument Serif | Tipografía (Google Fonts) |
| Vitest + Testing Library | Tests unitarios (`lib/format`, `domains/*/schemas.ts`, `lib/api/client.ts`) |
| Playwright | Tests e2e (`e2e/`) |

---

## Design tokens — Sistema visual FinApp

Crema cálido + tinta verde billete + acentos terracota / salvia.
Definidos en `globals.css`, consumidos como CSS custom properties.

```css
:root {
  /* Fondos */
  --bg:        #FBF7F4;   /* crema principal */
  --surface:   #FFFFFF;
  --surface-2: #F1ECE3;
  --line:      #E5DFD2;

  /* Tinta (texto) */
  --ink:       #1F4D3A;   /* verde billete profundo */
  --ink-2:     #2F6650;
  --ink-3:     #6E8B7E;
  --ink-4:     #A8BBB1;

  /* Acentos */
  --terra:     #C9603F;   /* gastos / negativo */
  --emerald:   #2E8B57;   /* ingresos / positivo */
  --gold:      #C9A24B;   /* advertencias / presupuesto */
  --salvia:    #7A8B6C;   /* secundario */

  /* Semánticos */
  --pos:       #2E8B57;
  --neg:       #C9603F;
  --warn:      #C9A24B;

  /* Radios */
  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 20px;
  --r-xl: 28px;

  /* Tipografía */
  --font-sans:  'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Instrument Serif', Georgia, serif;
  --font-mono:  'JetBrains Mono', ui-monospace, monospace;
}
```

**Regla tipográfica:** page titles y amounts destacados usan `font-serif`. UI chrome, labels y datos tabulares usan `font-sans`.

---

## Estructura de carpetas — Domain-driven (refleja el árbol real)

```
src/
├── middleware.ts                      # Protege rutas /w/* — redirige a /login sin access_token
│
├── app/
│   ├── (auth)/                        # Rutas públicas: login, register
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Shell: sidebar + topbar, fetch de workspaces + user
│   │   ├── page.tsx                   # Redirect a workspace activo
│   │   └── w/[workspaceId]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── transactions/page.tsx
│   │       ├── budget/page.tsx
│   │       ├── debts/{page.tsx,[debtId]/page.tsx}
│   │       └── savings/{page.tsx,[goalId]/page.tsx}
│   ├── invitations/accept/page.tsx
│   ├── settings/page.tsx
│   ├── api/
│   │   ├── proxy/[...path]/route.ts   # Único boundary hacia el backend real — inyecta
│   │   │                              # Authorization desde la cookie, pasa binarios (xlsx) sin
│   │   │                              # forzar JSON, único punto donde el browser puede llamar
│   │   └── auth/refresh/route.ts      # Rota access+refresh token, single-use en backend
│   ├── layout.tsx
│   └── globals.css
│
├── domains/                           # Módulos por dominio — estructura real
│   ├── auth/          {components: LoginForm, RegisterForm, LogoutButton; hooks: useAuth; schemas.ts}
│   ├── workspaces/     {components: WorkspaceCard, WorkspaceForm, WorkspaceSwitcher, InviteForm, MemberList, ProfileForm; hooks: useWorkspaces; schemas.ts}
│   ├── transactions/   {components: TxList, TxCard, TxModal, TxFilters, TxPageClient, SummaryStrip, XlsxImport; hooks: useTransactions; schemas.ts}
│   ├── categories/     {hooks: useCategories; schemas.ts — sin components propios, se reusa en otros domains}
│   ├── budget/         {components: BudgetCard, BudgetForm, CategoryProgress; hooks: useBudget; schemas.ts}
│   ├── debts/          {components: DebtList, DebtCard, DebtForm, ScheduleTable, PaymentModal; hooks: useDebts; schemas.ts}
│   └── savings/        {components: GoalList, GoalCard, GoalForm, ContributionList, ContributionForm, ProgressRing; hooks: useSavings; schemas.ts}
│
├── components/
│   ├── ui/                            # shadcn/ui (no editar manualmente)
│   ├── shell/                         # Sidebar, Topbar, MobileNav
│   └── shared/                        # AmountDisplay, DatePicker, Select, Providers
│
├── lib/
│   ├── api/
│   │   ├── client.ts                  # apiClient.{get,post,put,delete,postForm} + class ApiError
│   │   │                              # Cliente → /api/proxy (same-origin). Servidor → backend directo.
│   │   │                              # Dedup de refresh concurrente (mutex) en 401.
│   │   ├── endpoints/                 # Uno por dominio: transactions.ts, workspaces.ts, etc.
│   │   └── index.ts                   # Re-exporta todos los endpoints
│   ├── auth/
│   │   ├── session.ts                 # 'use server' — setSession/clearSession/getAccessToken/
│   │   │                              # getRefreshToken/requireAuth, cookies httpOnly
│   │   └── constants.ts               # Nombre/opciones de cookie compartidos (session.ts,
│   │                                  # refresh/route.ts, middleware.ts)
│   ├── format/
│   │   ├── currency.ts                # formatCurrency, formatAmount — multi-currency
│   │   └── date.ts                    # formatDate, formatDateShort, formatMonthYear, toISODate
│   ├── query-client.ts                # QueryClient: nuevo por request en servidor, singleton en cliente
│   └── utils.ts                       # cn() — clsx + tailwind-merge
│
└── types/
    ├── api.ts                         # PaginatedResponse, CursorResponse
    └── domain.ts                      # User, Workspace, Transaction, Debt, SavingsGoal, etc.
```

---

## URL structure

```
/login                              # Pública
/register                           # Pública
/invitations/accept                 # Pública (acepta invitación por token)
/w/[workspaceId]                    # Dashboard workspace
/w/[workspaceId]/transactions       # Transacciones
/w/[workspaceId]/budget             # Presupuesto mes actual
/w/[workspaceId]/debts              # Lista deudas
/w/[workspaceId]/debts/[debtId]     # Detalle + tabla amortización
/w/[workspaceId]/savings            # Metas de ahorro
/w/[workspaceId]/savings/[goalId]   # Detalle meta + abonos
/settings                           # Perfil de usuario
```

---

## Convenciones TypeScript / Next.js

### TanStack Query — patrón estándar

```typescript
// domains/transactions/hooks/useTransactions.ts
export function useTransactions(workspaceId: string, params?: ListParams) {
  return useQuery({
    queryKey: ['transactions', workspaceId, params],
    queryFn: () => transactions.list(workspaceId, params),
  })
}

export function useCreateTransaction(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionInput) =>
      transactions.create(workspaceId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions', workspaceId] }),
  })
}
```

### Cliente API

```typescript
// lib/api/client.ts — SIEMPRE usar este cliente, nunca fetch() directo
// (única excepción: los route handlers en app/api/proxy y app/api/auth/refresh,
// que SON el boundary autorizado hacia el backend real)
export const apiClient = {
  get:      <T>(path: string, query?: Record<string, unknown>) => Promise<T>,
  post:     <T>(path: string, body: unknown) => Promise<T>,
  put:      <T>(path: string, body: unknown) => Promise<T>,
  delete:   <T = void>(path: string) => Promise<T>,
  postForm: <T>(path: string, form: FormData) => Promise<T>,  // uploads multipart
}
export class ApiError extends Error { code: string; status: number }

// lib/api/endpoints/transactions.ts
export const transactions = {
  list: (wsId: string, p?: ListParams) =>
    apiClient.get<CursorResponse<Transaction>>(`/workspaces/${wsId}/transactions`, p),
  create: (wsId: string, data: CreateTransactionInput) =>
    apiClient.post<Transaction>(`/workspaces/${wsId}/transactions`, data),
  // ...
}
```

Desde el browser, `apiClient` siempre pasa por `/api/proxy/*` (same-origin, sin CORS) — el route handler ahí lee la cookie `access_token` e inyecta el header `Authorization` antes de reenviar al backend real. Desde un Server Component, pega directo a `NEXT_PUBLIC_API_URL`.

### Auth — httpOnly cookies

```typescript
// lib/auth/session.ts ('use server')
// Tokens se guardan ÚNICAMENTE en httpOnly cookies — nunca localStorage
export async function setSession(tokens: { access_token: string; refresh_token: string }): Promise<void>
export async function clearSession(): Promise<void>
export async function getAccessToken(): Promise<string | null>
export async function getRefreshToken(): Promise<string | null>
export async function requireAuth(): Promise<string>  // redirect('/login') si no hay token

// lib/auth/constants.ts — nombre/opciones de cookie compartidos entre
// session.ts, app/api/auth/refresh/route.ts y middleware.ts

// src/middleware.ts (raíz de src/, runtime Edge) — protege todas las rutas bajo /w/*
```

### Formularios

```typescript
// SIEMPRE react-hook-form + zod, nunca estado manual con useState para forms
const form = useForm<CreateTransactionInput>({
  resolver: zodResolver(createTransactionSchema),
})
```

### Server vs Client Components

```typescript
// Server Component por defecto — sin 'use client'
// Agregar 'use client' SOLO para: useState/useEffect, event handlers, browser APIs, TanStack Query hooks

// ✅ Página como Server Component — fetch en servidor, pasa props al Client Component
export default async function DebtsPage({ params }: Props) {
  const { workspaceId } = await params
  let currency = 'COP'
  try {
    const list = await workspacesApi.list()   // memoizado por Next dentro del mismo request
    currency = list.find((w) => w.id === workspaceId)?.currency ?? currency
  } catch { /* fallback */ }
  return <DebtList workspaceId={workspaceId} currency={currency} />
}

// ✅ Componente interactivo como Client Component — usa useQuery
'use client'
export function DebtList({ workspaceId, currency }: Props) {
  const { data: debts } = useDebts(workspaceId)
  // ...
}
```

No hay Context de workspace ni patrón `HydrationBoundary`/prefetch — los datos de workspace se resuelven en cada Server Component page vía `workspacesApi.list()`, que Next.js dedupea automáticamente dentro del mismo request (mismo URL+opciones de `fetch`).

### Formateo de moneda (multi-currency)

```typescript
// lib/format/currency.ts
// El workspace define la moneda (COP, USD, EUR, etc.)
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
// Uso: formatCurrency(50000, workspace.currency) → "$ 50.000"
```

---

## Reglas — Claude Code debe respetar siempre

1. **Sin lógica de negocio** — solo presentación y llamadas a API
2. **Sin fetch() directo** — siempre `lib/api/client.ts` (excepción: los 2 route handlers en `app/api/proxy` y `app/api/auth/refresh`, que son el boundary)
3. **Sin tokens en localStorage** — httpOnly cookies via Server Actions
4. **Sin `any` sin narrowing** — tipar todas las respuestas de API
5. **Formularios: react-hook-form + zod** — nunca useState para form state
6. **Server Components por defecto** — `'use client'` solo cuando sea necesario
7. **Design tokens via CSS vars** — no hardcodear colores hex en componentes
8. **No editar `components/ui/`** — generado por shadcn/ui CLI
9. **Código nuevo va en `domains/[dominio]/`** — no en `components/` genérico

---

## Variables de entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

**Importante:** `NEXT_PUBLIC_*` se hornea en build time en TODO código compilado por webpack (no solo el bundle de cliente — también los route handlers server-side como `/api/proxy`). Un `docker run -e NEXT_PUBLIC_API_URL=...` en runtime no tiene efecto si no se pasó como build-arg. Railway inyecta las variables del dashboard como build-args automáticamente para builds con Dockerfile; fuera de Railway (build local, otro CI) hay que pasarlo explícito: `docker build --build-arg NEXT_PUBLIC_API_URL=...`.

---

## Comandos de desarrollo

```bash
npm run dev          # Dev server con hot reload
npm run build        # Build de producción
npm run lint         # ESLint (next lint — deprecado en Next 16, migrar a ESLint CLI cuando se actualice)
npm run type-check   # tsc --noEmit
npm run test          # Vitest (unit) — lib/format, domains/*/schemas.ts, lib/api/client.ts
npm run test:watch    # Vitest en modo watch
npm run e2e           # Playwright (requiere backend real corriendo + usuario semilla test@finapp.dev)
```
