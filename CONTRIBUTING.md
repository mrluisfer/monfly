Absolutely! Here’s a tailored **CONTRIBUTING.md** for your project, in English, following your stack and best open-source practices:

---

# Contributing

Thank you for your interest in contributing! We welcome your help to make this financial management system more robust and useful.

Please review this guide before submitting your first pull request. Check existing issues and PRs to avoid duplicating work.

## Repository Structure

```
📁 Root Directory
├── 📁 src/
│   ├── 📁 components/
│   ├── 📁 hooks/
│   ├── 📁 context/
│   ├── 📁 utils/
│   ├── 📁 lib/
│   ├── 📁 constants/
│   ├── 📁 routes/
│   ├── 📁 types/
│   └── ...
├── 📁 prisma/
├── 📁 public/
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
├── 📄 jest.config.cjs
├── 📄 README.md
└── ...
```

- **Backend:** Uses **Prisma** (ORM) and **SQLite** (you can swap providers).
- **Frontend:** Built with **React**, **TanStack Router/Start**, and **Tailwind CSS**.
- **Testing:** Uses **Jest** and **@testing-library**.
- **Package manager:** Uses **pnpm**.

## Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

5. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

## Testing

- Run all tests with:

  ```bash
  pnpm test
  ```

- Test files should be placed alongside components (e.g. `Button.test.tsx`) or in a nearby `__tests__` folder.

## Code Style

- Uses **ESLint** for linting and formatting.
- Organize imports automatically.
- Keep code clean: remove unused variables, imports, and files.
- Use strict typing with TypeScript – avoid `any`!
- Follow the established project structure and naming conventions.
- Use _kebab-case_ for files and folders, _PascalCase_ for types.

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactor
- `docs`: Documentation
- `test`: Adding or updating tests
- `ci`, `build`, `chore`: CI, build, or chore changes

Example:

```
feat(category): add category deletion endpoint
fix(transaction): fix form reset issue after submit
```

## Pull Requests

- Clearly describe **what** problem you solve or feature you add.
- Make sure all tests pass before submitting.
- Include screenshots or examples if your changes affect the UI.
- If your change modifies the database schema, include the corresponding migration and update documentation.

## Migrations & Database

- Use Prisma for schema changes:

  ```bash
  npx prisma migrate dev --name <description>
  ```

- To reset the database in local dev:

  ```bash
  npx prisma db push --force-reset
  ```

## Code Review & Best Practices

- Keep components and hooks decoupled and reusable.
- Prefer splitting large files into smaller modules.
- Use React context for global state (e.g., theme, auth).
- Document any public function, hook, or utility.
- Write unit tests for business logic and reusable components.

## Useful Resources

- [TanStack Start](https://tanstack.com/start/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Prisma](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

Have questions or suggestions? Open an _issue_ or ask in the project chat!

---

**For inspiration, see:**

- [Next.js CONTRIBUTING.md](https://github.com/vercel/next.js/blob/canary/contributing.md)
- [TanStack Query contributing](https://github.com/TanStack/query/blob/main/CONTRIBUTING.md)
- [shadcn/ui contributing](https://github.com/shadcn/ui/blob/main/CONTRIBUTING.md)

---
