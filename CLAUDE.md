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
- Public routes: `/`, `/login`, `/signup`, `/logout`
- Protected routes live under `/_authed/` — the `_authed.tsx` layout checks session via `getUserSession()` and redirects unauthenticated users to `/login`

### Server Functions (`src/lib/api/`)
- Type-safe RPC using `createServerFn()` from TanStack Start
- Input validation via Zod schemas (defined in `src/zod-schemas/`)
- Rate limiting enforced through `resolveSessionEmail()` in `src/utils/security/`
- Organized by domain: `user/`, `transaction/`, `category/`, `chart/`, `monthly-summary/`

### Database (`prisma/schema.prisma`)
- **Prisma ORM** with PostgreSQL (prod) and SQLite (dev via `prisma/dev.db`)
- Core models: User, Transaction, Category, Budget, Pot, RecurringBill, Card, MonthlySummary
- Prisma client singleton in `src/utils/prisma.ts`

### Auth (`src/utils/auth/`)
- Session-based auth using TanStack Start `useSession()` with encrypted cookies
- Password hashing with bcrypt
- `SESSION_PASSWORD` env var required (≥32 chars)

### State Management
- **Jotai** atoms in `src/state/atoms/` for UI state (device type, preferences, menu)
- **TanStack Query** for server state with centralized query keys in `src/queries/dictionary.ts`
- Cache invalidation helpers in `src/utils/query-invalidation.ts`

### UI Components
- **shadcn/ui** primitives in `src/components/ui/` (managed by shadcn CLI, don't edit directly)
- Feature components organized by domain: `auth/`, `transactions/`, `categories/`, `charts/`, `home/`
- Styling with Tailwind CSS 4; `cn()` utility in `src/lib/utils.ts`

### Custom Hooks (`src/hooks/`)
- `useMutation` — wraps TanStack Query mutations with idempotency (4s dedup window) and haptic feedback
- `useRouteUser` — gets current user from route context
- Domain hooks: `useAddTransaction`, `useEditTransaction`, `useCategoriesList`, `useChart`, etc.

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
