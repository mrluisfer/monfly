
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
