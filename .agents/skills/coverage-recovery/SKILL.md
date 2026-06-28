---
name: coverage-recovery
description: Use this skill when coverage is below target or when uncovered code must be analyzed and resolved with minimal artificial tests.
---

# Coverage Recovery

## When To Use
Use this skill when the user asks to:
- increase test coverage;
- analyze uncovered lines/branches;
- enforce strict thresholds;
- explain why specific uncovered paths remain.

## Source Of Truth
- `AGENTS.md`
- `vitest.config.ts`
- `vitest.workspace.ts`
- workspace `vitest.config.ts` files

## Principles
- Coverage is a quality signal, not a vanity metric.
- Start from real public API behavior.
- Prefer fixing architecture/redundancy over adding synthetic tests for dead code.
- Defensive branches should be tested with controlled failure scenarios.
- Do not loop endlessly on non-resolvable cases: escalate with concrete options.

## Workflow
1. Collect facts.
```bash
make test-coverage
```
2. Read uncovered details, not only percentages.
Use:
- `coverage/index.html`
- workspace HTML reports under `coverage/**/index.html`
3. Classify uncovered paths:
- `real usage gap` (missed product scenario),
- `defensive path` (degraded input/runtime failure),
- `dead/redundant path` (likely removable),
- `architecture smell` (hard-to-test design).
4. Resolve in this order:
- add/adjust tests for real public API scenarios,
- add controlled break/failure tests for defensive branches,
- simplify/remove dead branches,
- propose architecture refactor for smell cases.
5. Re-run checks.
```bash
make eslint
make test-coverage
```

## Controlled Failure Patterns
- Invalid parser output shape from custom hooks.
- Missing/null metadata from malformed commit messages.
- I/O failures (stream write, file path edge).
- Partial external data (missing hash, missing remote URL parts).

## Stop Condition (No Cognitive Loop)
If progress stalls after reasonable attempts:
1. Stop brute-force test additions.
2. Report exact uncovered locations and why they are hard/non-natural.
3. Offer user options:
- keep defensive branch as-is and accept uncovered path,
- refactor architecture to make behavior testable,
- remove redundant branch if behavior is impossible by construction.

The final decision on controversial refactors belongs to the user.
