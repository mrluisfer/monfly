# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monfly is a full-stack personal finance dashboard built with **TanStack Start** (React 19), **Prisma** (PostgreSQL/SQLite), and **Vite**. It uses file-based routing, server functions for type-safe RPC, and deploys to Vercel.

## Commands

```bash
pnpm dev                    # Start dev server (port 3000)
pnpm build                  # Production build
pnpm lint                   # ESLint check
pnpm lint:fix               # Auto-fix lint issues
pnpm format                 # Prettier format
pnpm test                   # Run Jest tests
pnpm test -- --testPathPattern=path/to/test  # Run a single test
pnpm prisma migrate dev     # Run database migrations
pnpm prisma-generate        # Regenerate Prisma client
pnpm prisma studio          # Open Prisma database GUI
```

## Architecture

### Routing (`src/routes/`)

- **TanStack Router** file-based routing with auto-generated `routeTree.gen.ts` (never edit manually)
- Router created in `src/router.tsx` (`getRouter()`); it instantiates a **per-request `QueryClient`** and passes it through router context (`createRootRouteWithContext`) — never create a module-scope QueryClient (it would share cache across SSR requests)
- Public routes: `/`, `/login`, `/signup`, `/logout`
- Protected routes live under `/_authed/` — the `_authed.tsx` layout checks session via `getUserSession()` and redirects unauthenticated users to `/login`
- Active build config is `vite.config.mjs` (Vite + `tanstackStart()` + nitro plugins); `app.config.ts` is a legacy vinxi leftover

### Server Functions (`src/lib/api/`)

- Type-safe RPC using `createServerFn()` from TanStack Start
- Input validation via Zod schemas (defined in `src/zod-schemas/`)
- Rate limiting enforced through `resolveSessionEmail()` in `src/server/security/`
- Organized by domain: `user/`, `transaction/`, `category/`, `chart/`, `loan/`, `monthly-summary/`

### Server Layer (`src/server/`)

- **`server/db/<domain>/`** — raw Prisma queries (transactions, categories, users, charts, loans, monthly-summary)
- **Chart queries aggregate in the database** (`$queryRaw` with `date_trunc` or Prisma `aggregate`/`groupBy`), never by loading all transaction rows into JS. Buckets are computed in **UTC** end-to-end; month labels use a fixed `en-US` locale with `timeZone: "UTC"`. Bucket transactions by their `date` field, not `createdAt`
- **`server/auth/`** — auth server functions: loginFn, logoutFn, signupFn, session
- **`server/security/`** — request protection: resolveSessionEmail, enforceRateLimit
- **`server/prisma.ts`** — PrismaClient singleton + bcrypt helpers
- All server-only code lives here; `src/utils/` contains only pure client-safe utilities

### Database (`prisma/schema.prisma`)

- **Prisma ORM** with PostgreSQL (prod) and SQLite (dev via `prisma/dev.db`)
- Core models: User, Transaction, Category, Budget, Pot, RecurringBill, Card, MonthlySummary, Loan
- Loans link to transactions: an origin transaction can create a Loan, and payment transactions reference `appliedToLoanId`; loan mutations and balance updates happen inside a single `$transaction`
- Prisma client singleton in `src/server/prisma.ts`
- Money fields are currently `Float` (known tech debt — migrating to `Decimal`/integer cents is planned; avoid introducing new float accumulation logic)

### Auth (`src/server/auth/`)

- Session-based auth using TanStack Start `useSession()` with encrypted cookies
- Password hashing with bcrypt
- `SESSION_PASSWORD` env var required (≥32 chars)

### State Management

- **Jotai** atoms in `src/state/atoms/` for UI state (device type, preferences, menu)
- **TanStack Query** for server state. Query keys come from the `queryKeys` factory in `src/utils/query-keys.ts` (enum values in `src/queries/dictionary.ts`) — use the factory, don't hand-assemble key arrays
- **All chart queries share the `[charts, userEmail, ...]` prefix**, so a single `invalidateQueries({ queryKey: queryKeys.charts.all(email) })` refreshes every chart; new chart queries must register under `queryKeys.charts`
- Cache invalidation helpers in `src/utils/query-invalidation.ts`

### UI Components

- **shadcn/ui** primitives in `src/components/ui/` (managed by shadcn CLI, don't edit directly)
- **Shared components** in `src/components/shared/` — cross-feature reusable components (UserAvatar, Layout, Card, ClientOnly, etc.)
- Feature components organized by domain: `auth/`, `transactions/`, `categories/`, `charts/`, `home/`, `balance/`, `loans/`
- Chart components (recharts-based and `SpendingHeatmap`) are **lazy-loaded** with `React.lazy` + `Suspense` to keep them out of the initial bundle
- Animations use **`motion/react`** (the `motion` package); `framer-motion` was removed — never import from it
- Responsive split components (e.g. `transactions/list`): CSS classes (`hidden md:block` / `md:hidden`) keep SSR consistent, and after hydration only the active variant stays mounted (`useIsMobile` + `useIsMounted`)
- Styling with Tailwind CSS 4; `cn()` utility in `src/lib/utils.ts`

### Custom Hooks (`src/hooks/`)

- **Core hooks** (root level): `useMutation`, `useRouteUser`, `use-mobile`, `use-copy-to-clipboard`
- **`hooks/ui/`** — UI/preference hooks: `useDarkMode`, `useFontDisplay`, `useSonnerPosition`, `useThemeConfig`, `useIsMac`, `useInView`, `useMobile`
- **`hooks/haptics/`** — Haptic feedback: `useAppHaptics`, `useGlobalHapticFeedback`
- **`hooks/transactions/`** — `useAddTransaction`, `useEditTransaction`, `useTransactionHoverContext`
- **`hooks/categories/`** — `useCategoriesList`, `useGetCategoriesByEmail`
- **`hooks/charts/`** — `useChart`
- Each subdirectory has an `index.ts` barrel export; the root `hooks/index.ts` re-exports everything

### Forms

- React Hook Form + Zod resolver pattern
- Schemas in `src/zod-schemas/`, form defaults in `src/constants/forms/`

## Key Patterns

- **Path aliases:** `@/*` and `~/*` both resolve to `src/*`
- **API response shape:** `StandardApiResponse` type in `src/types/ApiResponse.ts`
- **Error classes:** `SecurityError` and `RateLimitError` for structured error handling
- **Email normalization:** All emails lowercased before lookup/storage
- **Conventional commits:** Use `feat:`, `fix:`, `refactor:`, etc. prefixes

## Environment Variables

Required in `.env`:

- `DATABASE_URL` — PostgreSQL connection string (or SQLite path for dev)
- `SESSION_PASSWORD` — Session encryption key (≥32 chars)

## Testing

- Jest with ts-jest and jsdom environment
- Test files colocated with components (`*.test.tsx`)
- TanStack Query and `window.matchMedia` are mocked in `src/setupTests.ts`
