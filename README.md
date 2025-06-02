
# 💰 Personal Finance Tracker

## ⚙️ Prisma Workflow

1. **Edit the `schema.prisma` file**

2. **Create and apply a migration**

   ```bash
   pnpm prisma migrate dev --name add-pots
   ```

3. **Ensure updated types**

   ```bash
   pnpm prisma generate
   ```

4. **Open Prisma Studio**

   ```bash
   pnpm prisma studio
   ```

---

## 📡 API Routes with TanStack Start

### 📁 File Route Conventions

**API routes in TanStack Start** follow the same file-based routing conventions as `TanStack Router`.
Any file in your `routes` directory that is **prefixed with `api`** (this is configurable) will be treated as an **API route handler**.

---

### 📌 File-to-Route Mapping Examples

| File Path                       | Generated Route Path   |
| ------------------------------- | ---------------------- |
| `routes/api.users.ts`           | `/api/users`           |
| `routes/api/users.ts`           | `/api/users`           |
| `routes/api/users.index.ts`     | `/api/users`           |
| `routes/api/users/$id.ts`       | `/api/users/$id`       |
| `routes/api/users/$id/posts.ts` | `/api/users/$id/posts` |
| `routes/api.users.$id.posts.ts` | `/api/users/$id/posts` |
| `routes/api/file/$.ts`          | `/api/file/$`          |

---

### 🧠 Note

Files prefixed with `api` act as **handlers for the respective API route path**.

> For example:
> `routes/api/users/$id.ts` will handle requests like `GET /api/users/123`, `POST`, etc., depending on the exported HTTP method handlers.

### 🧪 Test Organization Guideline

We recommend placing your test files next to the files they test.
This makes it easier to maintain, refactor, and find tests related to specific components, hooks, or utilities.

Structure Example

```css
📁 src/
├── 📁 components/
│   ├── 📃 Button.tsx
│   ├── 🧪 Button.test.tsx
│   ├── 📃 TransactionForm.tsx
│   ├── 🧪 TransactionForm.test.tsx
├── 📁 hooks/
│   ├── 📃 useDarkMode.ts
│   ├── 🧪 useDarkMode.test.ts
├── 📁 utils/
│   ├── 📃 formatCurrency.ts
│   ├── 🧪 formatCurrency.test.ts
```

Unit/component tests: Place the test file with the same name, next to the source file, using .test.ts or .test.tsx extension.

Integration/E2E tests: (Optional) Place in a dedicated tests/ folder if needed.

Why this pattern?
Easier to maintain and refactor (move the file, move the test).

Modern tooling (VSCode, Jest, Vitest) supports this layout natively.

Used by popular projects like TanStack Query and React Testing Library.

#### References

- [React Testing Library - FAQ](https://testing-library.com/docs/intro/#structure)

- [TanStack Query Source](https://tanstack.com/query/latest/docs/framework/react/guides/testing)

- [Kent C. Dodds – Where should I put my tests?](https://kentcdodds.com/blog/where-should-i-put-my-tests)

## About me

Hey! 👋 I’m **Luis Alvarez** ([@mrLuisFer](https://github.com/mrLuisFer))

- 👨‍💻 Full Stack Developer passionate about building beautiful and scalable digital products.
- 📝 I share tech ideas and articles on [dev.to/mrluisfer](https://dev.to/mrluisfer)
- 🌐 Explore more about me on [bento.me/mrluisfer](https://bento.me/mrluisfer)
- 📦 Check out my open source projects on [GitHub](https://github.com/mrLuisFer)

<div align="center">
  <a href="https://github.com/mrLuisFer" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/GitHub-mrLuisFer-black?style=flat-square&logo=github" alt="GitHub" />
  </a>
  <a href="https://dev.to/mrluisfer" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Dev.to-@mrluisfer-black?style=flat-square&logo=dev.to" alt="Dev.to" />
  </a>
  <a href="https://bento.me/mrluisfer" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Bento.me-mrluisfer-fuchsia?style=flat-square" alt="Bento" />
  </a>
</div>

> _This project is for personal and educational use only. Not intended for commercial purposes._

