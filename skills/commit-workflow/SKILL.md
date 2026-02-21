---
name: commit-workflow
description: Use this skill when creating git commits in this repository. It standardizes commit splitting, Conventional Commit type selection, workspace scopes (`m3-foundation`, `m3-react`, `m3-vue`), and commitlint constraints.
---

# Commit Workflow

## When To Use
Use this skill when the user asks to:
- create one or more commits;
- split changes into separate commits;
- choose commit messages/scopes/types;
- validate commit formatting before committing.

## Source Of Truth
- `AGENTS.md`
- `.commitlintrc.json`

## Required Rules
- Commit format: Conventional Commits.
- Message language: English by default.
- Subject style: describe completed historical change, not intention.
- Start commit subject description with an uppercase letter.
- Keep commit subject description concise.
- Put long details into commit body; lists in body are allowed for enumerations.
- Use past/perfective wording; prefer passive voice to fit changelog style.
Examples: `Added ...`, `Removed ...`, `Refactored ...`, `Fixed ...`.
- Allowed types: `feat`, `fix`, `build`, `ci`, `perf`, `docs`, `refactor`, `style`, `test`, `chore`.
- For workspace-level changes, scope is mandatory.
- Scope must equal workspace directory name:
  `m3-foundation`, `m3-react`, `m3-vue`.
- For root/global manual commits, prefer no scope.
- Avoid generator-specific scope patterns (for example `release`) in manual commits
  unless the change is explicitly tied to release automation semantics.
- Never infer scope from memory when workspace directory can be read from paths.
- Breaking changes: use `!` in header or `BREAKING CHANGE` footer.
- Do not mix unrelated changes in one commit.
- Always commit `yarn.lock` changes in a dedicated commit with no other files.
- For a `yarn.lock`-only commit, use exact header: `chore: Updated yarn.lock`.
- Exception for intentional dependency updates (`yarn up`, `yarn add`, `yarn remove`, etc.):
after rebase conflict resolution rerun the original dependency command and recreate separate
`chore: Updated yarn.lock` commit.
- Exception: global workspace-wide changes may be combined.
Global examples: eslint rule updates, shared dependency upgrades, root-level infra/config updates.
- Do not amend/rewrite history unless explicitly requested.
- Historical commits/changelog can contain incorrect scopes; treat them as mistakes, not as templates.

## Commitlint Constraints
- Header max length: `200`
- Body line max length: `200`
- Footer line max length: `200`
- `subject-case: never` (avoid case-constrained templates; use natural English wording)

## Workflow
1. Inspect pending changes:
```bash
git status --short
git diff
```
2. Detect touched workspace roots from paths under `m3-foundation`, `m3-react`, `m3-vue`.
3. Group files by logical intent and, when applicable, by workspace boundary.
If `yarn.lock` is changed, split it into a separate commit and keep other files out of that commit.
4. Choose commit type and scope.
Scope rule:
for workspace commits use workspace directory name; for global changes scope should be omitted.
Do not use synthetic scopes that imitate version generator outputs.
5. Compose English commit header:
```text
<type>(<scope>): <Short description>
```
Style rule for `<Short description>`:
start with an uppercase letter and use completed historical phrasing in past/perfective form, preferably passive voice.
Length rule:
keep `<Short description>` concise; move extended details to body.
Body formatting rule:
use plain text or bullet lists when enumerating multiple items.
6. Stage only target files:
```bash
git add <files>
```
7. Create commit (non-interactive):
```bash
git commit -m "<type>(<scope>): <Description>"
```
8. Verify result:
```bash
git show --name-status --oneline -n 1
```

## Practical Patterns
- Documentation update:
`docs: README was updated`
- Yarn lockfile refresh:
`chore: Updated yarn.lock`
- Build/config change:
`build: Build pipeline was updated for Yarn 4`
- CI change:
`ci: Test workflow was updated`
- Workspace fix with scope:
`fix(m3-react): Switch drag click conflict was fixed`
