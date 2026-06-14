<!--
  Thanks for contributing to Monfly! 🦋
  Please fill out this template so reviewers can understand your change quickly.
  PRs with a clear description and passing checks get merged faster.
-->

## Description

<!-- What does this PR do? Describe the change and the motivation behind it. -->

## Related Issue

<!-- Link the issue this PR closes, e.g. "Closes #123". Use "Refs #123" if it only relates. -->

Closes #

## Type of Change

<!-- Check all that apply. -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] ♻️ Refactor (no functional change)
- [ ] 💥 Breaking change (fix or feature that would change existing behavior)
- [ ] 📚 Documentation
- [ ] 🧪 Tests
- [ ] 🔧 Chore / CI / build

## How Has This Been Tested?

<!-- Describe how you verified your change. Include commands, steps, or test names. -->

- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Manually verified in the browser (`pnpm dev`)

## Database Changes

<!-- Delete this section if your change does not touch the schema. -->

- [ ] This PR modifies `prisma/schema.prisma`
- [ ] A migration is included (`pnpm prisma migrate dev --name <description>`)
- [ ] Money fields use existing patterns (no new `Float` accumulation logic)

## Screenshots / Recordings

<!-- For UI changes, add before/after screenshots or a short clip. Otherwise delete this section. -->

## Checklist

- [ ] My commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] I followed the code style (kebab-case files, PascalCase types, no `any`)
- [ ] I have self-reviewed my code and removed unused imports/variables
- [ ] I added/updated tests where it makes sense
- [ ] I updated documentation (README / CONTRIBUTING / CLAUDE.md) where relevant
- [ ] No secrets, credentials, or `.env` values are committed
