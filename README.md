<div align="center">

# 💰 FinApp — Frontend

**Finanzas personales y familiares por *workspaces***

*Next.js 15 · React 18 · TanStack Query · Tailwind CSS*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](#)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind-v3-38BDF8?logo=tailwindcss&logoColor=white)](#)
[![Vitest](https://img.shields.io/badge/Vitest-unit_tests-6E9F18?logo=vitest&logoColor=white)](#)
[![Playwright](https://img.shields.io/badge/Playwright-e2e-2EAD33?logo=playwright&logoColor=white)](#)

</div>

<br>

Registra **transacciones**, define **presupuestos**, controla **deudas** con tabla de amortización
y sigue **metas de ahorro** — todo por workspace, cada uno con su propia moneda.

> Este repositorio es **solo el frontend**. Ninguna regla de negocio vive aquí: es una capa de presentación que consume la API REST del backend en Go (`finapp-backend`, repo aparte). El frontend pide datos, los muestra, y envía lo que el usuario ingresa.

## 📑 Índice

[Stack](#-stack-tecnológico) ·
[Arquitectura](#-arquitectura-general) ·
[Carpetas](#-estructura-de-carpetas) ·
[Piezas clave](#-cómo-funciona-cada-pieza) ·
[Flujo](#-flujo-completo-de-una-feature-ejemplo-transacciones) ·
[Auth](#-autenticación) ·
[Dominios](#-dominios-de-negocio) ·
[Entorno](#-variables-de-entorno) ·
[Comandos](#-comandos)

---

## 🧱 Stack tecnológico

| Capa | Herramienta | Para qué |
|---|---|---|
| Framework | **Next.js 15**<br>App Router | Rutas, renderizado servidor/cliente, build de producción |
| UI | **React 18.3.1** | Componentes de interfaz |
| Componentes base | **shadcn/ui** | Dialog, Select, Dropdown — copiados al repo, no es paquete cerrado |
| Comportamiento/A11y | **Radix UI** | Motor debajo de shadcn/ui: foco, teclado, ARIA |
| Estilos | **Tailwind CSS v3** | Utilidades + design tokens vía variables CSS |
| Estado de servidor | **TanStack Query v5** | Cache, loading, refetch, mutaciones |
| Formularios | **react-hook-form** | Estado y envío de forms sin `useState` manual |
| Validación | **zod** | Esquemas — fuente única para validación y tipos |
| Gráficas | **Recharts** | Visualización financiera *(instalada, sin uso activo aún)* |
| Tipografía | **Inter** / **Instrument Serif** | UI y datos / títulos y montos destacados |
| Tests unitarios | **Vitest** + **Testing Library** | Funciones puras y lógica aislada |
| Tests e2e | **Playwright** | Flujos completos en navegador real |

---

## 🏗️ Arquitectura general

```
┌──────────────┐   cookie httpOnly (access_token)   ┌───────────────────────┐
│  Navegador   │ ─────────────────────────────────▶ │   Next.js (este repo) │
│  Client      │                                      │  Server Components   │
│  Components  │ ◀──────────── HTML / JSON ────────  │  + Route Handlers    │
└──────┬───────┘                                      └───────────┬───────────┘
       │                                                            │
       │  fetch a /api/proxy/*                                     │  fetch directo a
       │  (same-origin, sin CORS,                                  │  NEXT_PUBLIC_API_URL
       │  inyecta header Authorization)                            │
       ▼                                                            ▼
┌─────────────────────────────────────────────┐                    │
│   app/api/proxy/[...path]/route.ts           │ ◀──────────────────┘
│   único punto donde el browser toca el       │
│   backend real                               │
└───────────────────┬───────────────────────────┘
                     ▼
          ┌───────────────────────┐
          │   finapp-backend (Go)  │
          │   API REST /api/v1     │
          └───────────────────────┘
```

Dos caminos posibles según **dónde corre el código**:

| Dónde | Cómo pide datos | Por qué |
|---|---|---|
| **Server Component** (`async function Page()`) | Directo a `NEXT_PUBLIC_API_URL` | Corre en el servidor de Next — sin CORS, sin exponer tokens |
| **Client Component** (`'use client'` + `useQuery`) | Vía `/api/proxy/*` | El route handler lee la cookie httpOnly e inyecta `Authorization`; el browser nunca ve el token |

*Ninguna de las dos rutas contiene lógica de negocio — solo arman, envían y muestran.*

---

## 📂 Estructura de carpetas

```
src/
├── middleware.ts                 # Edge — protege /w/* sin cookie válida → redirect a /login
│
├── app/                          # Rutas (cada carpeta = una URL)
│   ├── (auth)/                   # login, register — públicas
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Shell: sidebar + topbar
│   │   ├── page.tsx              # Redirige al workspace activo
│   │   └── w/[workspaceId]/      # Todo lo que depende de un workspace
│   │       ├── transactions/
│   │       ├── budget/
│   │       ├── debts/[debtId]/
│   │       └── savings/[goalId]/
│   ├── invitations/accept/
│   ├── settings/
│   └── api/
│       ├── proxy/[...path]/      # Boundary hacia el backend real
│       └── auth/refresh/         # Rota access + refresh token
│
├── domains/                      # Un módulo por área de negocio
│   └── <dominio>/
│       ├── components/           # UI específica
│       ├── hooks/                # useQuery / useMutation
│       └── schemas.ts            # Validación zod + tipos derivados
│
├── components/
│   ├── ui/                       # shadcn/ui — generado, no se edita a mano
│   ├── shell/                    # Sidebar, Topbar, navegación
│   └── shared/                   # Reusables entre dominios (Select, DatePicker...)
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # apiClient.{get,post,put,delete,postForm} + ApiError
│   │   └── endpoints/            # Una función por recurso
│   ├── auth/
│   │   ├── session.ts            # 'use server' — lee/escribe cookie httpOnly
│   │   └── constants.ts          # Config de cookie compartida
│   ├── format/                   # formatCurrency, formatDate...
│   └── query-client.ts           # Config de TanStack Query
│
└── types/                        # Interfaces TS de los datos del backend
```

**¿Por qué domain-driven?** Todo lo de "deudas" vive junto en `domains/debts/` — no repartido en carpetas genéricas. Encontrar o borrar una feature completa no toca las demás.

---

## ⚙️ Cómo funciona cada pieza

### `lib/api/client.ts` — el único cliente HTTP permitido

```ts
export const apiClient = {
  get:      <T>(path, query?)  => Promise<T>,
  post:     <T>(path, body)    => Promise<T>,
  put:      <T>(path, body)    => Promise<T>,
  delete:   <T = void>(path)   => Promise<T>,
  postForm: <T>(path, form)    => Promise<T>,   // uploads (ej. importar Excel)
}
```

- Nadie llama `fetch()` directo salvo los 2 route handlers boundary.
- `401` → refresh automático de token (mutex evita refresh en paralelo) → reintenta.
- Lanza `ApiError` (`code` + `status`) en vez de `Error` genérico → mensajes específicos en UI.

### `lib/api/endpoints/*.ts` — una función por recurso

```ts
export const transactions = {
  list:   (wsId, params) => apiClient.get<CursorResponse<Transaction>>(`/workspaces/${wsId}/transactions`, params),
  create: (wsId, data)   => apiClient.post<Transaction>(`/workspaces/${wsId}/transactions`, data),
}
```

Capa fina: arma URL, tipa respuesta. No transforma, no decide.

### `domains/<x>/hooks/*.ts` — TanStack Query envolviendo endpoints

```ts
export function useTransactions(workspaceId, params) {
  return useQuery({
    queryKey: ['transactions', workspaceId, params],
    queryFn:  () => transactions.list(workspaceId, params),
    enabled:  !!workspaceId,
  })
}
```

`queryKey` identifica la entrada en cache. `enabled` evita pedir con datos incompletos. Las mutaciones invalidan cache relacionada en `onSuccess` → UI se refresca sola.

### `domains/<x>/schemas.ts` — zod

```ts
export const createTransactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
})
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
```

El tipo TS se **infiere** del esquema — una sola fuente de verdad.

### `domains/<x>/components/*Modal.tsx` — react-hook-form + Radix + Tailwind

```tsx
const { register, handleSubmit, control, formState: { errors } } = useForm({
  resolver: zodResolver(createTransactionSchema),
})
```

- `register('amount')` — conecta input sin re-render por tecla.
- `Controller` — para inputs no nativos (`Select` custom); `register` solo sirve con HTML real.
- El `Dialog` es Radix por debajo: foco, `Escape`, click-afuera, ARIA. shadcn/ui solo estiliza.

### `lib/auth/session.ts` — sesión

```ts
export async function setSession(tokens): Promise<void>
export async function getAccessToken(): Promise<string | null>
export async function requireAuth(): Promise<string>  // redirect('/login') si no hay token
```

`'use server'` — corre solo en servidor. Tokens en cookies **httpOnly**, nunca en `localStorage`.

---

## 🔄 Flujo completo de una feature (ejemplo: transacciones)

| # | Paso |
|---|---|
| 1 | Usuario entra a `/w/[workspaceId]/transactions` |
| 2 | `middleware.ts` valida cookie `access_token` — si no existe, redirect a `/login` |
| 3 | Página **Server Component** pide datos base directo al backend (ej. moneda del workspace) |
| 4 | Client Component `TxPageClient` usa `useTransactions()` → pide a `/api/proxy/workspaces/{id}/transactions` |
| 5 | Route handler proxy lee cookie, inyecta `Authorization: Bearer <token>`, reenvía al backend Go |
| 6 | Backend responde JSON → proxy lo pasa tal cual → TanStack Query cachea por `queryKey` |
| 7 | Usuario click "Nueva" → abre `TxModal` (Radix Dialog) |
| 8 | react-hook-form + zod validan (`amount` positivo, fecha `YYYY-MM-DD`) |
| 9 | `useCreateTransaction().mutateAsync()` → `apiClient.post` → mismo camino de proxy |
| 10 | `onSuccess` invalida cache → lista se refresca sola, sin `setState` manual |
| 11 | Si backend responde `401` en cualquier paso → refresh de token (mutex) y reintento |

---

## 🔐 Autenticación

- Login/registro: rutas públicas bajo `app/(auth)/`.
- `setSession()` guarda `access_token` y `refresh_token` en cookies **httpOnly**.
- `middleware.ts` protege `/w/*` — sin token válido, redirect a `/login`.
- `app/api/auth/refresh/route.ts` rota ambos tokens; backend invalida el refresh anterior (single-use).
- El browser **nunca** ve el token: ni en JS, ni en `localStorage`, ni en el HTML.

---

## 🗂️ Dominios de negocio

| Dominio | Qué resuelve |
|---|---|
| `auth` | Login, registro, cierre de sesión |
| `workspaces` | Crear/cambiar workspace, invitar miembros, roles, perfil |
| `transactions` | Gastos, ingresos, transferencias |
| `categories` | Clasificación — sin UI propia, se reusa vía `Select` |
| `budget` | Límite mensual por categoría, progreso gastado/restante |
| `debts` | Préstamos, tasa (efectiva/nominal/mensual), amortización, pagos |
| `savings` | Metas de ahorro, abonos individuales |

*Cada workspace tiene su propia moneda (`Workspace.currency`) — todos los montos se formatean con `formatCurrency(amount, workspace.currency)`.*

---

## 🌎 Variables de entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

> `NEXT_PUBLIC_*` se hornea en **build time**, no en runtime. `docker run -e ...` no tiene efecto si no se pasó como build-arg en `docker build`.

---

## 🚀 Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Dev server con hot reload (`localhost:3000`) |
| `npm run build` | Build de producción (standalone, para Docker) |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Vitest (unit) |
| `npm run test:watch` | Vitest en modo watch |
| `npm run e2e` | Playwright (requiere backend real corriendo) |

---

*Frontend de FinApp — la lógica de negocio vive en `finapp-backend`.*
