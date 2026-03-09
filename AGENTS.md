# AGENTS.md

## Goals
- Avoid clarification loops by proposing a concrete interpretation when details
  are missing.
- Default to the language of the user's initial message unless they explicitly
  request a different language.
- Match the tone and formality of the user's initial message unless they
  explicitly ask for a change.
- Treat a language switch in the user's message as an explicit request to
  respond in that language.
- If a message is mixed-language, reply in the dominant language unless the
  user specifies otherwise.

## Reporting
- Keep handoff reports natural and outcome-focused: describe what was done.
- Do not proactively list skipped optional steps/checks (for example, not
  running eslint for markdown-only changes) unless the user explicitly asks.
- Always mention blockers, failed required checks, or other omissions that can
  affect correctness, safety, or reproducibility.

## Purpose
This file defines practical instructions for day-to-day work in the
`modulify/m3-web` repository, with a focus on repository conventions,
test execution, and standard local commands.

## Repository Structure
- This project is a Yarn Workspaces monorepo.
- Root workspace: `@modulify/m3-web`.
- Workspace folders: `m3-foundation`, `m3-react`, `m3-vue`.
- Root-level test command is `yarn test` (`vitest run`).
- Vitest workspace targets are declared in `vitest.workspace.ts`:
  `m3-react`, `m3-vue`.

## Architecture Rules
- Getter/helper functions must be side-effect free. Side effects are allowed
  only by prior agreement and only when there are strong, explicit reasons.
- Tests inside a workspace must cover only code owned by that workspace. In
  `m3-foundation`, `m3-react`, `m3-vue`, and any future workspace, do not add
  tests for implementation that belongs to another workspace.
- Cross-workspace imports must go through the target workspace package name as
  declared in `package.json`. Relative or absolute filesystem imports into
  another workspace are forbidden. For example,
  `import type { Appearance } from '@modulify/m3-foundation/types/components/button'`
  is allowed, but
  `import type { Appearance } from '../../../m3-foundation/types/components/button'`
  is not.

## Local setup
- Yarn version is `4.6.0` (see `packageManager` in `package.json`).
- Generate local `.yarnrc.yml` from `.yarnrc.yml.dist`:
```bash
make .yarnrc.yml
```
- Install dependencies:
```bash
make node_modules
# or
yarn install
```

## Running Tests

### Local Path
- Run all tests:
```bash
make test
# or
yarn test
```

### Passing Vitest CLI Arguments via Makefile
- Run tests by name pattern:
```bash
make test cli="-t M3Button"
```
- Run tests only for a specific workspace path:
```bash
make test cli="m3-react"
```

### Coverage
- Run tests with coverage:
```bash
make test-coverage
# or
yarn test --coverage
```

## Related Commands
- Build all workspaces:
```bash
make build
```
- Run eslint:
```bash
make eslint
```
- Show available recipes:
```bash
make help
```

## Important Project Rules
- Before performing actions, analyze whether there is a suitable local skill
  for the task and consult it for detailed instructions.
- Before performing repeated or operational actions, inspect `make help` and
  its output to see whether an existing recipe already covers the task.
- If a suitable recipe exists, prefer it over ad hoc commands to reduce extra
  work, keep workflows standardized, and avoid unnecessary escalations.
- The project includes a Playwright container and make recipes for screenshot
  capture; use them when visual analysis of Storybook pages, component states,
  or other UI behavior is helpful.
- The project also includes runtime-analysis research recipes for DOM, styles,
  layout metrics, a11y snapshots, traces, network/performance logs, token
  diffs, and screenshot matrices; use them to reduce uncertainty and to
  understand what is going wrong before guessing at visual or runtime issues.
  Read `docs/en/runtime-analysis-recipes.md` first when the task involves
  visual regressions, layout ambiguity, token/theme uncertainty, unclear
  animation behavior, or other runtime issues where these recipes may help.
- Run eslint before handoff or commit preparation only when changed files
  include code covered by eslint rules (for example `*.js`, `*.ts`, and
  similar source files). Do not run eslint for markdown-only changes.
- Prefer running eslint with `--fix` when available so autofixable issues are
  resolved automatically before manual follow-up.

## Skills
The skills listed below are stored locally in this repository under `skills/`.

If the context was compacted and you see `Context compacted`, reread any skill
whose description below starts with `[reread]` after the colon before
continuing.

- `commit-workflow`: [reread] Use when creating or splitting git commits in
  this repository. Reread it before every commit creation; it standardizes
  commit grouping, Conventional Commits, workspace scopes, and commitlint
  limits.
- `coverage-recovery`: Use when coverage is below target or uncovered code must
  be analyzed and closed without adding artificial tests.
- `docs-parity`: Use when creating or editing files under `docs/`. Keeps
  English-first edits, locale parity, and locale index updates aligned.
- `exploration-workflow`: [reread] Use only when the user explicitly switches
  the task into exploration mode: autonomous hypothesis-driven work on
  uncertain functionality, with timeboxing, milestone logging, and tightly
  controlled pre-agreed escalation windows, plus `drafts/current.yml` and a
  dedicated `drafts/` activity directory for logs, facts, and artifact links.
- `yarn-lock-conflict-resolution`: Use when resolving merge or rebase conflicts
  in `yarn.lock` according to repository policy.
