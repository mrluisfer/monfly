# Linting: Biome + Ultracite

How this repo lints and formats, which rules were deliberately turned off, and how to work through the tech debt the Ultracite adoption surfaced.

The config is **`biome.jsonc`** at the repo root. It must stay `.jsonc`: it carries explanatory comments, and `biome.json` rejects them — Biome then reports *"The configuration file has errors. Biome will report only parsing errors until the configuration is fixed"* and silently falls back to its defaults.

## Commands

```bash
pnpm lint          # biome lint — exits 0; debt is "warn", so only real errors fail
pnpm lint:fix      # biome lint --write — safe lint fixes only
pnpm check         # biome check --write — lint + format + organize imports, writes fixes
pnpm format        # biome format --write
pnpm lint:debt     # ranked table of what tech debt is left
pnpm lint:strict   # biome lint --error-on-warnings — fails while any debt remains
pnpm typecheck     # tsc --noEmit — always run after a mass fix
```

`pnpm lint:strict` takes a path: `pnpm lint:strict src/server` scopes the check to one area.

## Presets

```jsonc
"extends": [
  "ultracite/biome/core",
  "ultracite/biome/react",
  "ultracite/biome/tanstack",
  "ultracite/biome/vitest"
]
```

**There is no `next` preset here.** This project is TanStack Start, not Next.js. Ultracite's `tanstack` preset is the one that matters: it disables `useSortedKeys` and `useFilenamingConvention` inside `**/routes/**`, because route option order is semantic — `head`/`component` infer `loaderData` from properties declared before them, so alphabetical sorting breaks type inference.

Ultracite requires Biome 2.x (`extends` with a package name doesn't exist in 1.x). Pinned at `@biomejs/biome@^2.5.11`.

## Two landmines

**1. `assist.source.useSortedAttributes` must stay `off`.**

Biome 2.5.6 and 2.5.11 corrupt JSX when sorting attributes: if a multi-line expression attribute sorts ahead of a simple one, the expression attribute is **duplicated** and its siblings are **dropped**. Reproduced across 39 files; minimal case in `src/components/auth/SharedHeader.tsx`:

```diff
 <Button
-  variant="outline"           ← silently deleted
   render={ <Link …>…</Link> }
+  render={ <Link …>…</Link> } ← duplicated
 />
```

Re-enable only after verifying against a Biome release that fixes it.

**2. Never run `biome check --write --unsafe`.**

`useAtIndex` rewrites `arr[i]` to `arr.at(i)`, which returns `T | undefined` and breaks `tsc` (`Object is possibly 'undefined'`). The safe `pnpm check` was verified to keep the typecheck green; `--unsafe` was verified to break it.

## Rules that are permanently off

These encode project decisions, not debt. **Don't re-enable them without discussion**, and don't "fix" code to satisfy them.

| Rule | Why |
| --- | --- |
| `performance/noBarrelFile` | `index.ts` barrels under `src/hooks/`, `src/server/db/`, `src/state/` are a documented pattern (22 files) |
| `style/noEnum` | `src/queries/dictionary.ts` and `src/constants/*` use enums by design |
| `correctness/useHookAtTopLevel` (scoped to `src/server/**`) | TanStack Start server functions call `useSession()` outside a component |
| `complexity/noImportantStyles` | predates Ultracite |
| The a11y set: `noLabelWithoutControl`, `noNoninteractiveTabindex`, `noRedundantRoles`, `noSvgWithoutTitle`, `useAriaPropsSupportedByRole`, `useSemanticElements` | already disabled before Ultracite; preserved rather than silently reversed |

`style/useFilenamingConvention` stays **on**, widened to `camelCase`, `kebab-case` and `PascalCase` — components are PascalCase, utils and server code are kebab-case. Enforcing Ultracite's kebab-case-only default would have meant renaming 213 files.

`files.includes` intentionally has **no leading `"**"`**: the `core` preset already provides the catch-all plus its hard `!!` negations, which survive the merge. Adding a second one trips `lint/suspicious/noBiomeFirstException`.

## The tech debt block

The last entry in `overrides` demotes to `"warn"` every rule that pre-existing code violates. Each line carries its violation count as of 2026-09-02.

**These are not preferences.** They mark code written before Ultracite. Do not write new code that trips them — new violations are as wrong as errors, they just don't fail the build yet.

### How to work through it

1. `pnpm lint:debt` — pick a rule from the ranking.
2. Fix the violations. Scope your check with `pnpm lint:strict <path>` as you go.
3. When the rule reaches zero, **delete its line from the override** so it reverts to the `"error"` inherited from Ultracite.
4. Confirm with `pnpm lint:strict` and `pnpm typecheck`.

Deleting the line is the point of the exercise — a rule left at `"warn"` after its violations are gone lets the debt come back.

### One `pnpm check` clears most of it

A single safe fix pass (~324 files) resolves roughly 950 violations and fully clears these rules:

`useSortedClasses` (608) · `useBlockStatements` (168) · `useConsistentArrowReturn` (35) · `useSimplifiedLogicExpression` (23) · `useNumericSeparators` (7) · `noInferrableTypes` (6) · `useSelfClosingElements` (5) · `useNumberNamespace` (5) · `noNegationElse` (5) · `noUselessUndefined` (3) · `noUnusedTemplateLiteral` (2) · `noConstantBinaryExpressions` (1) · `useCollapsedElseIf` (1) · nearly all of `useAwait` (14 → 1)

Do that in **its own commit**, separate from feature work — it touches hundreds of files. Verify with `pnpm typecheck` and `pnpm test` after.

### What stays manual

`noJsxPropsBind` (201) · `useConsistentTypeDefinitions` (119) · `noLeakedRender` (83) · `noUnnecessaryConditions` (48) · `noNestedTernary` (20) · `noExcessiveCognitiveComplexity` (12), then a long tail under 10.

`useConsistentTypeDefinitions` looks automatic but isn't: its only fix is unsafe (`type` → `interface`), so it goes by hand.

## Editor setup

Both editor configs in the repo are already wired to Biome — `.vscode/settings.json` and `.zed/settings.json` (format on save, `source.fixAll.biome`, `source.organizeImports.biome`). Since `useSortedClasses` fixes are safe, Tailwind classes get sorted incrementally on every save, which chips away at the largest debt item for free.

If the editor reports config errors that `pnpm lint` doesn't, the language server is holding a stale config: reload the window, and confirm the extension is using the workspace binary (Biome 2.x) rather than a bundled 1.x.
