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
- Run `make eslint` before handoff or commit preparation only when changed
  files include code covered by eslint rules (for example `*.js`, `*.ts`,
  and similar source files). Do not run `make eslint` for markdown-only
  changes (for example `*.md`).
- Getter/helper functions must be side-effect free. Side effects are allowed
  only by prior agreement and only when there are strong, explicit reasons.

## Reporting
- Keep handoff reports natural and outcome-focused: describe what was done.
- Do not proactively list skipped optional steps/checks (for example, not
  running eslint for markdown-only changes) unless the user explicitly asks.
- Always mention blockers, failed required checks, or other omissions that can
  affect correctness, safety, or reproducibility.

## Purpose
This file defines practical instructions for working in the
`modulify/m3-web` repository, with a focus on test execution and commit
workflow.

## Repository Structure
- This project is a Yarn Workspaces monorepo.
- Root workspace: `@modulify/m3-web`.
- Workspace folders: `m3-foundation`, `m3-react`, `m3-vue`.
- Root-level test command is `yarn test` (`vitest run`).
- Vitest workspace targets are declared in `vitest.workspace.ts`:
  `m3-react`, `m3-vue`.

## Local Environment Prerequisites
- Yarn version is `4.6.0` (see `packageManager` in `package.json`).
- Local `.yarnrc.yml` is generated from `.yarnrc.yml.dist` using:
```bash
make .yarnrc.yml
```
- Install dependencies with:
```bash
make node_modules
# or
yarn install
```

## Running Tests

### Local Path
- Generate local Yarn config:
```bash
make .yarnrc.yml
```
- Install dependencies:
```bash
make node_modules
# or
yarn install
```
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
- Commit messages follow Conventional Commits.
- Commitlint configuration is in `.commitlintrc.json` with:
  `header-max-length=200`, `body-max-line-length=200`,
  `footer-max-line-length=200`, `subject-case=never`.
- Getter/helper functions must be side-effect free. Side effects are allowed
  only by prior agreement and only when there are strong, explicit reasons.

## Commit Workflow
- Default commit message language is English (unless explicitly requested
  otherwise).
- Commit style is Conventional Commits.
- Write commit subjects as historical facts (not intentions).
- Start commit subject description with an uppercase letter.
- Keep commit subject description concise.
- Move long details to commit body; lists in body are allowed for enumerations.
- Use past/perfective wording; prefer passive voice for changelog-friendly phrasing.
Examples: `Added ...`, `Removed ...`, `Refactored ...`, `Fixed ...`.
- Respect commitlint limits from `.commitlintrc.json`:
  `header-max-length=200`, `body-max-line-length=200`,
  `footer-max-line-length=200`.
- For workspace commits, use scope equal to the workspace directory name:
  `m3-foundation`, `m3-react`, `m3-vue`.
- Split commits by logical change. Workspace-local changes should stay in
  their workspace scope.
- Changes in `yarn.lock` must always be committed separately from all other files.
- Commit message for `yarn.lock`-only commit must be exactly:
`chore: Updated yarn.lock`.
- Exception for intentional dependency updates:
if commit purpose is dependency update (`yarn up`, `yarn add`, `yarn remove`, etc.),
after rebase conflict resolution rerun the original dependency command and recreate separate
`chore: Updated yarn.lock` commit.
- Exception: global workspace-level changes can be combined in one commit.
Global examples: eslint rule updates, shared dependency updates, repository-level infra/config changes.
- For commit tasks, use the local skill:
`skills/commit-workflow/SKILL.md`.
- For `yarn.lock` merge/rebase conflict resolution, use the local skill:
`skills/yarn-lock-conflict-resolution/SKILL.md`.
- For coverage deficit analysis and recovery strategy, use the local skill:
`skills/coverage-recovery/SKILL.md`.
