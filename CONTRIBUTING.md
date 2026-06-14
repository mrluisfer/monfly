# Contributing to Monfly 🦋

Thanks for your interest in contributing! Monfly is a full-stack personal
finance dashboard, and we welcome bug reports, feature ideas, documentation
fixes, and code contributions.

Please read this guide before opening your first pull request. By participating,
you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

> ⚠️ **Found a security issue?** Do **not** open a public issue or PR. Follow the
> private reporting process in [SECURITY.md](./SECURITY.md).

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Database & Migrations](#database--migrations)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Useful Resources](#useful-resources)

---

## Ways to Contribute

- 🐛 **Report a bug** — use the [Bug Report](https://github.com/mrluisfer/monfly/issues/new?template=bug_report.yml) issue template.
- ✨ **Request a feature** — use the [Feature Request](https://github.com/mrluisfer/monfly/issues/new?template=feature_request.yml) template.
- 💬 **Ask a question / discuss** — open a [Discussion](https://github.com/mrluisfer/monfly/discussions) instead of an issue.
- 📚 **Improve docs** — typos and clarifications are welcome and a great first PR.
- 🛠️ **Write code** — pick up an open issue (look for `good first issue` / `help wanted`) and comment that you're working on it.

Before starting non-trivial work, please open or comment on an issue so we can
align on the approach and avoid duplicated effort.

---

## Tech Stack

| Area              | Technology                                                  |
| ----------------- | ----------------------------------------------------------- |
| Framework         | TanStack Start (React 19), file-based routing               |
| Language          | TypeScript (strict)                                         |
| Build tooling     | Vite (`vite.config.mjs`) + Nitro                            |
| Server / RPC      | TanStack Start server functions (`createServerFn`)          |
| Database / ORM    | Prisma — PostgreSQL (prod) / SQLite (dev)                   |
| Server state      | TanStack Query                                              |
| UI state          | Jotai                                                       |
| Styling           | Tailwind CSS 4 + shadcn/ui (Radix)                          |
| Forms             | React Hook Form + Zod                                       |
| Testing           | Jest + React Testing Library                                |
| Package manager   | **pnpm**                                                    |

For a deeper architecture overview, see [CLAUDE.md](./CLAUDE.md).

---

## Local Setup

**Prerequisites:** Node.js ≥ 20 and [pnpm](https://pnpm.io/) installed.

1. **Fork** the repo, then clone your fork:

   ```bash
   git clone https://github.com/<your-username>/monfly.git
   cd monfly
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables.** Copy the example and fill in the values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — your Postgres connection string, or a local SQLite path
     (e.g. `file:./prisma/dev.db`) for development.
   - `SESSION_PASSWORD` — a random secret of **at least 32 characters**.
   - Optional: `SESSION_COOKIE_SECURE`, `BUILD_SOURCEMAP` (see `.env.example`).

4. **Apply migrations and generate the Prisma client:**

   ```bash
   pnpm prisma-migrate     # prisma migrate dev
   pnpm prisma-generate    # prisma generate
   ```

5. **Start the dev server** (http://localhost:3000):

   ```bash
   pnpm dev
   ```

Optional: `pnpm prisma-studio` opens a database GUI.

---

## Project Structure

```text
src/
├─ components/      # UI: ui/ (shadcn), shared/, and feature folders
├─ hooks/          # Custom hooks (barrel-exported per subfolder)
├─ lib/api/        # Type-safe server functions (RPC) by domain
├─ server/         # Server-only code: db/, auth/, security/, prisma.ts
├─ routes/         # File-based routing; _authed/ = protected routes
├─ queries/        # Query-key dictionary
├─ state/          # Jotai atoms
├─ zod-schemas/    # Zod validation schemas
├─ constants/      # Form defaults and other constants
├─ types/          # Shared types (e.g. StandardApiResponse)
└─ utils/          # Pure, client-safe utilities
prisma/
└─ schema.prisma   # Models + migrations
```

> Never edit `src/routeTree.gen.ts` (auto-generated) or files in
> `src/components/ui/` (managed by the shadcn CLI) by hand.

---

## Development Workflow

1. Create a branch off `main`:

   ```bash
   git checkout -b feat/short-description    # or fix/, docs/, refactor/, chore/
   ```

2. Make your change in small, focused commits.

3. Before pushing, run the full local check:

   ```bash
   pnpm lint        # ESLint
   pnpm format      # Prettier
   pnpm test        # Jest
   pnpm build       # Production build
   ```

4. Push to your fork and open a Pull Request against `main`.

---

## Coding Standards

- **TypeScript strict** — no `any`. Type everything; let inference help where it can.
- **Naming:** `kebab-case` for files and folders, `PascalCase` for components and types, `camelCase` for variables and functions.
- **No unused** imports, variables, or dead code (enforced by ESLint).
- **Server vs. client:** all server-only logic lives under `src/server/`; `src/utils/` must stay client-safe and side-effect free.
- **Imports:** use the `@/*` (or `~/*`) path alias instead of long relative paths.
- **State & data:** use the `queryKeys` factory for query keys; never hand-assemble key arrays. Use existing cache-invalidation helpers.
- **Charts:** aggregate in the database (UTC), never by loading all rows into JS.
- **Money:** don't introduce new `Float` accumulation logic (migration to integer cents / `Decimal` is planned).
- **Animations:** import from `motion/react` — never from `framer-motion`.

When in doubt, match the surrounding code's conventions.

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>
```

Common types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `perf`, `style`.

Examples:

```bash
feat(category): add category deletion endpoint
fix(transaction): reset form after successful submit
docs(contributing): document local env setup
```

---

## Database & Migrations

Schema lives in `prisma/schema.prisma`. For any schema change:

```bash
pnpm prisma-migrate --name <short-description>   # create & apply migration
pnpm prisma-generate                             # regenerate the client
```

- **Always commit the generated migration** alongside the schema change.
- To reset your local dev database:

  ```bash
  pnpm prisma migrate reset
  ```

- Loan mutations and balance updates must happen inside a single `$transaction`.

---

## Testing

- Tests use **Jest** + **React Testing Library** in a jsdom environment.
- Colocate test files with the code they cover (`Button.test.tsx`).
- Run the suite, watch mode, or a single file:

  ```bash
  pnpm test
  pnpm test:watch
  pnpm test -- --testPathPattern=path/to/test
  ```

- Add or update tests for business logic and reusable components. PRs that change
  behavior should include test coverage where it makes sense.

---

## Pull Requests

- Fill out the [PR template](./.github/PULL_REQUEST_TEMPLATE.md) completely.
- Keep PRs **focused** — one logical change per PR is easier to review.
- Link the related issue (`Closes #123`).
- Ensure `lint`, `test`, and `build` all pass.
- Include before/after **screenshots or a clip** for UI changes.
- If you touch the schema, include the migration and update any affected docs.
- **Never commit secrets**, `.env` values, or credentials.

A maintainer will review your PR, may request changes, and will merge it once
it's ready. Thanks for your patience — and for contributing! 🦋

---

## Useful Resources

- [TanStack Start](https://tanstack.com/start/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Prisma](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
