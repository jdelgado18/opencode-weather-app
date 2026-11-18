# AGENTS.md

## What this repo is
Bun CLI scaffolded with `bun init`. `README.md` is the **spec**, not current behavior: `index.ts` is still the one-line "Hello via Bun!" stub. Goal is an interactive weather CLI whose final deliverable is a standalone executable binary.

## Toolchain: Bun only
- Use `bun` everywhere: `bun <file>`, `bun run <script>`, `bun install`, `bunx`, `bun test`, `bun check`. Do not substitute node/npm/npx/tsc.
- `bun-instructions.md` in the repo root is the Bun API playbook (Bun.serve, bun:sqlite, Bun.$, Bun.file, no express/better-sqlite3/dotenv, etc.) — follow it; don't duplicate its advice here.
- Bun auto-loads `.env`; never add dotenv.

## Commands
- Typecheck: `bun run typecheck` → runs `bun check` (NOT `tsc --noEmit`). Single file: `bun check index.ts`. `bun --check`, `bun test --check`, `bun build --check` gate on types first.
- Tests: `bun test` with `bun:test` imports (none exist yet).
- Build: goal is a single executable via `bun build --compile ...` (per README + Bun docs); confirm exact flags before relying on them.

## Weather API flow (OpenMeteo, no API key)
- Two calls, in order: geocoding `GET https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`, then forecast `GET https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`.
- Forecast needs lat/lon from geocoding — never query it by city name.
- Menu/UI strings are Spanish (see README's menu example).

## tsconfig gotchas (`bun check` enforces)
- `noUncheckedIndexedAccess`: indexed access yields `T | undefined`.
- `verbatimModuleSyntax`: use `import type` for type-only imports.
- `module: Preserve` + `moduleResolution: bundler` + `allowImportingTsExtensions` + `noEmit`: TS extension imports are expected; nothing is emitted.
