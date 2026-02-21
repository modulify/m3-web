---
name: yarn-lock-conflict-resolution
description: Use this skill when resolving merge/rebase conflicts in yarn.lock. It standardizes taking yarn.lock from the rebase target branch as source of truth, then running yarn install, and reusing the previous successful resolution as the base for repeated conflict rounds.
---

# Yarn.lock Conflict Resolution

## When To Use
Use this skill when:
- `yarn.lock` has merge/rebase conflicts;
- conflict resolution must follow repository policy;
- the same conflict has to be resolved multiple times during one rebase chain.

## Source Of Truth Policy
- During rebase, always take `yarn.lock` from the target branch (the branch you rebase onto).
- During merge, always take `yarn.lock` from the current target branch (`HEAD`).
- After taking that baseline, run dependency install to reconcile lock metadata:
  `make node_modules` (preferred) or `yarn install`.

## Required Rules
- Do not manually edit conflict markers in `yarn.lock`.
- Resolve by replacing the whole `yarn.lock` file from the selected baseline.
- For repeated conflict rounds, use previous successful `yarn.lock` resolution as the new base.
- Exception for intentional dependency updates (`yarn up`, `yarn add`, `yarn remove`, etc.):
after conflict resolution, rerun the original dependency command and create a fresh
`chore: Updated yarn.lock` commit.

## Workflow
1. Ensure conflict exists and only then start resolution:
```bash
git status --short
```
2. Resolve first conflict round (rebase):
```bash
ONTO=$(cat .git/rebase-merge/onto 2>/dev/null || cat .git/rebase-apply/onto)
git show "$ONTO:yarn.lock" > yarn.lock
make node_modules
# or
yarn install
git add yarn.lock
cp yarn.lock .git/yarn-lock-resolution-base
```
3. Resolve first conflict round (merge, non-rebase):
```bash
git show "HEAD:yarn.lock" > yarn.lock
make node_modules
# or
yarn install
git add yarn.lock
cp yarn.lock .git/yarn-lock-resolution-base
```
4. Resolve repeated conflict rounds in the same rebase/merge sequence:
```bash
cp .git/yarn-lock-resolution-base yarn.lock
make node_modules
# or
yarn install
git add yarn.lock
cp yarn.lock .git/yarn-lock-resolution-base
```
5. Continue rebase/merge:
```bash
git rebase --continue
# or
git merge --continue
```
6. Cleanup after operation is finished:
```bash
rm -f .git/yarn-lock-resolution-base
```
7. If current rebased change intentionally updated dependencies, replay that intent:
```bash
# example
yarn up <packages>
git add yarn.lock
git commit -m "chore: Updated yarn.lock"
```

## Validation
- `git status --short` must not show conflict markers for `yarn.lock`.
- `yarn.lock` must be staged before `--continue`.
- The resolution must follow the source-of-truth policy above.
