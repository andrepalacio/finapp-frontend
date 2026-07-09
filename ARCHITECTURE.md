# Arquitectura — finapp-frontend

> Snapshot generado 2026-07-09. Actualizar cuando cambie el boundary de red, el flujo de auth, o el builder de deploy.

## Visión general

Next.js 15 (App Router), UI pura — sin lógica de negocio, sin acceso directo a datos. Todo pasa por la API REST de `finapp-backend` (Go). Deploy en Railway vía Dockerfile multi-stage, `output: 'standalone'`.

## Capas

```
app/            -> rutas (Server Components por defecto), fetch de datos server-side
domains/        -> componentes de dominio (Client Components), hooks TanStack Query, schemas zod
lib/api/        -> apiClient (fetch tipado) + un endpoint file por dominio
app/api/proxy/  -> único punto por donde el browser llega al backend real
```

Regla de dependencia: `domains/*/components` nunca hacen `fetch()` directo — siempre `lib/api/endpoints/*` → `lib/api/client.ts`.

## El boundary de red: por qué existe `/api/proxy`

El browser **nunca** habla directo con el backend Go. Todo pasa por `app/api/proxy/[...path]/route.ts`, que:
1. Lee la cookie httpOnly `access_token` e inyecta `Authorization: Bearer` antes de reenviar.
2. Es same-origin desde el browser — sin CORS que configurar en el backend.
3. Pasa bodies y responses binarios sin forzar JSON (uploads multipart, descarga de xlsx) — passthrough por content-type, no siempre `res.json()`.

Desde un **Server Component**, `lib/api/client.ts` sí pega directo a `NEXT_PUBLIC_API_URL` (el proxy sería un salto de red innecesario dentro del mismo proceso Node). La rama cliente/servidor vive en `fetchApi()`: `isClient ? '/api/proxy' : BACKEND_URL`.

## Auth: cookies + refresh con mutex

Tokens en cookies httpOnly (`access_token`, `refresh_token`), nunca localStorage. El backend rota el refresh token en cada uso (single-use) — si dos requests concurrentes disparan refresh en paralelo, el segundo pisa al primero y el que pierde la carrera queda deslogueado sin razón aparente.

`lib/api/client.ts` resuelve esto con una promesa compartida a nivel de módulo (`refreshPromise`): el primer 401 dispara el refresh, cualquier 401 concurrente espera la misma promesa en vez de disparar el suyo. Nombres/opciones de cookie centralizados en `lib/auth/constants.ts` — antes vivían hardcodeados en 3 archivos (`middleware.ts`, `session.ts`, `refresh/route.ts`) sin type-safety entre ellos.

## Fetch de datos: sin Context, dedup automático de Next

No hay `WorkspaceContext` ni patrón `HydrationBoundary`/prefetch. Cada Server Component page (`w/[workspaceId]/*`) llama `workspacesApi.list()` para resolver la currency del workspace activo — el mismo call que ya hace `layout.tsx`. Next.js memoiza automáticamente los `fetch()` con URL+opciones idénticas dentro de un mismo request (independiente del `cache` option), así que el layout + la page terminan compartiendo **una sola** llamada de red, no dos. Esto es intencional: es más simple que introducir un Context client-side, y React 18.3 (la versión en uso) no tiene `React.cache()` — esa API es de React 19.

Client Components (`domains/*/components`) reciben los datos como props desde su Server Component page — no leen contexto global. TanStack Query se usa para estado que sí necesita refetch/mutación reactiva del lado cliente (listas, formularios).

## Manejo de errores

Una sola `class ApiError extends Error` en `lib/api/client.ts` (código + status + message), lanzada desde `fetchApi`/`postForm`. Componentes la consumen vía `err instanceof ApiError`. Existió una `interface ApiError` distinta y sin uso en `types/api.ts` (mismo nombre, forma del wire payload, no la excepción real) — se eliminó por ser dead code confuso.

## Variables de entorno y build

`NEXT_PUBLIC_API_URL` se hornea en **build time** — Next.js reemplaza `process.env.NEXT_PUBLIC_*` en todo el código que pasa por webpack, incluyendo route handlers server-side (`/api/proxy`, `/api/auth/refresh`), no solo el bundle de cliente. Un `docker run -e NEXT_PUBLIC_API_URL=...` en runtime no tiene efecto si el valor no estaba disponible durante `docker build`.

Railway inyecta las variables del dashboard como build-args automáticamente para servicios con builder Dockerfile — por eso funciona en prod sin declarar `ARG` explícito en el Dockerfile. Fuera de Railway (build local, otro CI) hay que pasarlo a mano: `docker build --build-arg NEXT_PUBLIC_API_URL=... .`. Se evaluó agregar el `ARG` al Dockerfile para hacerlo portable; se revirtió a pedido — deuda conocida, ver `.claude/proposals/tech-debt-2026-07-09.md`.

`railway.json` fuerza `"builder": "DOCKERFILE"` — sin esto Railway cae a autodetect (Nixpacks), que corre `next start` directo por `sh` en vez de nuestro `server.js` standalone, y falla con `next: not found`. Un `Procfile` en la raíz también pisaría el `CMD` del Dockerfile aunque el builder sea Docker — no debe reintroducirse.

## Testing

- **Unit** (Vitest + jsdom): `lib/format/*`, `domains/*/schemas.ts` (zod), `lib/api/client.ts` (mutex de refresh mockeando `fetch`). `npm run test`.
- **E2E** (Playwright): `e2e/*.spec.ts`, requiere backend real corriendo y usuario semilla `test@finapp.dev` / `Test1234!` con al menos un workspace. `auth.setup.ts` corre primero y persiste la sesión en `e2e/.auth/session.json`. `npm run e2e`.
- CI (`​.github/workflows/test.yml`) corre e2e con `continue-on-error: true` — no bloquea el pipeline todavía, ver reporte de deuda técnica.
