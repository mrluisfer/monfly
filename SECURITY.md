# Security Policy

The Monfly team and community take the security of this project seriously.
Because Monfly handles **personal financial data** (transactions, balances,
budgets, and authentication credentials), we ask that any vulnerability be
reported responsibly so it can be fixed before it is disclosed publicly.

## Supported Versions

Security fixes are applied to the latest released version on the `main` branch.
Older snapshots are not maintained.

| Version        | Supported          |
| -------------- | ------------------ |
| `main` (latest)| :white_check_mark: |
| Older tags     | :x:                |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately through one of the following channels:

1. **GitHub Security Advisories (preferred)** — Go to the
   [Security tab](https://github.com/mrluisfer/monfly/security/advisories/new)
   and click **"Report a vulnerability"**. This keeps the report private until a
   fix is released.
2. **Direct contact** — Reach out to the maintainer
   ([@mrluisfer](https://github.com/mrluisfer)) privately.

When reporting, please include as much of the following as possible:

- A clear description of the vulnerability and its impact.
- Steps to reproduce (proof of concept, affected route/endpoint, or payload).
- The affected version, commit hash, or branch.
- Any suggested remediation, if you have one.

### What to expect

| Stage                     | Target time frame              |
| ------------------------- | ------------------------------ |
| Initial acknowledgement   | Within **72 hours**            |
| Triage & severity rating  | Within **7 days**              |
| Fix or mitigation plan    | Depends on severity & scope    |
| Public disclosure         | Coordinated, **after** a fix   |

We will keep you informed throughout the process and credit you in the release
notes / advisory unless you prefer to remain anonymous.

## Disclosure Policy

We follow a **coordinated disclosure** model:

1. You report the issue privately.
2. We confirm, triage, and develop a fix.
3. We release the fix and publish an advisory.
4. Public details are shared only after users have had a chance to update.

Please give us a reasonable window to address the issue before any public
disclosure. We will not pursue legal action against researchers who follow this
policy in good faith.

## Scope

In scope:

- The Monfly application code (`src/`), server functions, and API routes.
- Authentication, session handling, and authorization logic.
- Input validation, rate limiting, and data exposure issues.
- Dependency vulnerabilities that are exploitable through Monfly.

Out of scope:

- Vulnerabilities in third-party services (report those to the respective vendor).
- Issues that require physical access to a user's device.
- Self-XSS, missing best-practice headers without a demonstrable impact, or
  automated-scanner output without a working proof of concept.
- Denial-of-service via resource exhaustion (rate limiting is a known mitigation,
  not a hardening guarantee).

## Security Best Practices for Self-Hosting

If you deploy your own instance of Monfly, you are responsible for its security.
At a minimum:

- **`SESSION_PASSWORD`** must be a strong, random secret of **at least 32
  characters**. Never reuse it across environments and never commit it.
- **`DATABASE_URL`** must point to a database that is not publicly reachable, and
  credentials must be kept out of version control.
- Keep `.env` files out of git — they are already covered by `.gitignore`.
- Always run the latest version and keep dependencies updated (`pnpm update`,
  watch for Dependabot / advisory alerts).
- Serve the application **over HTTPS** so session cookies are protected in transit.
- Rotate secrets if you suspect they have been exposed.

## Built-in Protections

Monfly ships with several baseline protections (see `src/server/`):

- Passwords are hashed with **bcrypt** — plaintext passwords are never stored.
- Sessions use **encrypted cookies** via TanStack Start `useSession()`.
- Server functions enforce **rate limiting** and session resolution through
  `src/server/security/` (`resolveSessionEmail`, `enforceRateLimit`).
- All input is validated with **Zod** schemas before reaching the database.
- Emails are normalized (lowercased) before lookup/storage to avoid duplication
  and enumeration ambiguity.

Thank you for helping keep Monfly and its users safe. :butterfly:
