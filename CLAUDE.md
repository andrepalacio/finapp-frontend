# finapp-frontend — Contexto Claude Code (Frontend Next.js)

> Claude Code lee este archivo automáticamente cuando se ejecuta dentro de `finapp-frontend/`.
> Este es un repositorio independiente. El backend vive en github.com/[user]/finapp-backend.

---

## Propósito de este servicio

UI de FinApp construida con Next.js 14 (App Router). Consume la API REST del backend Go. No tiene lógica de negocio propia — toda la lógica vive en el backend.

**Puerto:** 3000 (desarrollo) → 80/443 (producción via Nginx)
**Framework:** Next.js 14 con App Router (no Pages Router)

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

## Estructura de carpetas — Domain-driven

```
src/
├── app/
│   ├── (auth)/                        # Rutas públicas
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/                   # Rutas protegidas — requieren auth
│   │   ├── layout.tsx                 # Shell: sidebar + topbar
│   │   ├── page.tsx                   # Redirect a workspace activo
│   │   └── w/
│   │       └── [workspaceId]/         # Contexto de workspace
│   │           ├── layout.tsx         # Workspace provider
│   │           ├── page.tsx           # Dashboard / Inicio
│   │           ├── transactions/
│   │           │   └── page.tsx
│   │           ├── budget/
│   │           │   └── page.tsx
│   │           ├── debts/
│   │           │   ├── page.tsx
│   │           │   └── [debtId]/page.tsx
│   │           └── savings/
│   │               ├── page.tsx
│   │               └── [goalId]/page.tsx
│   ├── settings/page.tsx              # Settings de usuario (fuera de workspace)
│   ├── layout.tsx                     # Root layout (providers)
│   └── globals.css                    # Tokens + base styles
│
├── domains/                           # Módulos por dominio
│   ├── auth/
│   │   ├── components/                # LoginForm, RegisterForm
│   │   ├── hooks/                     # useLogin, useRegister, useLogout
│   │   └── schemas.ts                 # Zod: loginSchema, registerSchema
│   ├── transactions/
│   │   ├── components/                # TxList, TxCard, TxModal, TxDetail, TxFilters
│   │   ├── hooks/                     # useTransactions, useCreateTx, useDeleteTx
│   │   └── schemas.ts
│   ├── categories/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── schemas.ts
│   ├── budget/
│   │   ├── components/                # BudgetCard, CategoryProgress, BudgetForm
│   │   ├── hooks/
│   │   └── schemas.ts
│   ├── debts/
│   │   ├── components/                # DebtList, DebtCard, ScheduleTable, PaymentModal
│   │   ├── hooks/
│   │   └── schemas.ts
│   ├── savings/
│   │   ├── components/                # GoalCard, ProgressRing, ContributionForm
│   │   ├── hooks/
│   │   └── schemas.ts
│   └── workspaces/
│       ├── components/                # WorkspaceSwitcher, WorkspaceForm
│       ├── hooks/                     # useWorkspaces, useCurrentWorkspace
│       └── schemas.ts
│
├── components/
│   ├── ui/                            # shadcn/ui (no editar manualmente)
│   ├── shell/                         # Sidebar, Topbar, MobileNav
│   └── shared/                        # AmountDisplay, DateLabel, EmptyState, etc.
│
├── lib/
│   ├── api/
│   │   ├── client.ts                  # fetchWithAuth — cliente base
│   │   └── endpoints/                 # Por dominio: transactions.ts, debts.ts, etc.
│   ├── auth/
│   │   ├── session.ts                 # Read/write httpOnly cookies (server actions)
│   │   └── middleware.ts              # Next.js middleware — rutas protegidas
│   ├── format/
│   │   ├── currency.ts                # formatCurrency(amount, currency) — multi-currency
│   │   └── date.ts                    # formatDate, formatRelative
│   └── query-client.ts                # TanStack Query client singleton
│
└── types/
    ├── api.ts                         # ApiError, PaginatedResponse
    └── domain.ts                      # Debt, Transaction, Budget, SavingsGoal, etc.
```

---

## URL structure

```
/login                              # Pública
/register                           # Pública
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
    queryFn: () => api.transactions.list(workspaceId, params),
  })
}

export function useCreateTransaction(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionInput) =>
      api.transactions.create(workspaceId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions', workspaceId] }),
  })
}
```

### Cliente API

```typescript
// lib/api/client.ts — SIEMPRE usar este cliente, nunca fetch() directo
async function fetchWithAuth<T>(method: string, path: string, body?: unknown): Promise<T>

// lib/api/endpoints/transactions.ts
export const transactions = {
  list: (wsId: string, p?: ListParams) =>
    apiClient.get<PaginatedResponse<Transaction>>(`/workspaces/${wsId}/transactions`, p),
  create: (wsId: string, data: CreateTransactionInput) =>
    apiClient.post<Transaction>(`/workspaces/${wsId}/transactions`, data),
  // ...
}
```

### Auth — httpOnly cookies

```typescript
// lib/auth/session.ts (Server Actions)
// Tokens se guardan ÚNICAMENTE en httpOnly cookies — nunca localStorage
export async function setSession(tokens: { access: string; refresh: string }): Promise<void>
export async function getSession(): Promise<Session | null>
export async function clearSession(): Promise<void>

// lib/auth/middleware.ts — protege todas las rutas bajo /w/* y /settings
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

// ✅ Página como Server Component — prefetch en servidor
export default async function TransactionsPage({ params }) {
  return (
    <HydrationBoundary state={await prefetchTransactions(params.workspaceId)}>
      <TransactionList />
    </HydrationBoundary>
  )
}

// ✅ List como Client Component — usa useQuery
'use client'
export function TransactionList() {
  const { data } = useTransactions(useWorkspaceId())
  // ...
}
```

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
2. **Sin fetch() directo** — siempre `lib/api/client.ts`
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
SESSION_SECRET=...   # mínimo 32 chars — para firmar cookies
```

---

## Comandos de desarrollo

```bash
npm run dev          # Dev server con hot reload
npm run build        # Build de producción
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```
