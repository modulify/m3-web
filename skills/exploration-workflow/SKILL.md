---
name: exploration-workflow
description: Use this skill only when the user explicitly asks for exploration mode: autonomous hypothesis-driven work on uncertain functionality, with timeboxing, milestone logging, and tightly controlled escalation windows.
---

# Exploration Workflow

[reread] Reread this skill immediately before starting any explicit exploration-mode run in this repository.

## When To Use
Use this skill only when the user explicitly switches the task into exploration mode.

Typical signals:
- the user wants autonomous long-running work with periodic checkpoints;
- the target is a new or uncertain functional layer;
- the goal is to validate or reject hypotheses, not just implement a known change;
- the user expects structured evidence, logs, and bounded escalation behavior.

Do not trigger this skill for ordinary implementation, refactoring, bugfixing, or short investigative questions.

## Entry Handshake
If the user gives a signal that exploration mode may be desired, do not silently start it.
Instead, explicitly ask whether they want to start exploration mode now.

That confirmation message must:
- mention that this repository has an `exploration-workflow` skill;
- say that exploration starts only after explicit confirmation;
- say that the confirmation reply must include a concrete time budget.

Accepted confirmation examples:
- `Да, стартуем exploration на 30 минут`
- `Да, запускай, бюджет 60 минут`
- `Start exploration, 120 minutes`

Once the user gives an affirmative answer with an explicit time budget, take this skill into use immediately and follow it from that point onward.

## Source Of Truth
- `AGENTS.md`
- `Makefile`
- `recipes/research.mk`
- `recipes/research/fetch.sh`
- `recipes/research/capture.sh`
- `drafts/current.yml`

## Core Intent
- Reduce uncertainty around a proposed solution or functional layer.
- Let the agent work autonomously for a bounded period without drifting into open-ended activity.
- Keep all risky actions explicit, logged, and reviewable.
- Produce artifacts that make it easy for the user to resume control at any checkpoint.

## Drafts Layout
- Exploration state in `drafts/` is owned by this skill.
- If `drafts/current.yml` does not exist when exploration starts, create it.
- Every exploration run gets its own dedicated activity directory inside `drafts/`.
- Use a distinct directory name that is easy to differentiate from other runs.
Recommended pattern:
  `drafts/explorations/YYYYMMDD-HHMM-<short-slug>/`
- `drafts/current.yml` must point to the current activity directory and contain a short run summary.
- Inside the activity directory, `index.md` is mandatory and acts as the main entry point.
- `index.md` must describe the task in Russian and link to other files relevant to this exploration.
- Other files inside the activity directory are fully at the agent's disposal.
Use them freely for:
  notes, plans, milestones, facts, decisions, open questions, artifact inventories, external links, and recovery context.
- Except for `index.md`, there is no fixed file set inside the activity directory.
Choose the structure that best supports efficient autonomous work.
- If screenshots, fetched JSON, or other generated artifacts live outside the activity directory, add links to them from `index.md` or another linked file.

## `drafts/current.yml`
Maintain `drafts/current.yml` as a short machine-readable pointer to the active exploration.
Minimum fields:
- `mode`: `exploration`
- `slug`: short run identifier
- `path`: relative path to the current activity directory inside `drafts/`
- `goal`: short current goal
- `status`: current state such as `planned`, `running`, `blocked`, `done`
- `started_at`: run start timestamp
- `timeout_minutes`: agreed timeout
- `summary`: short human-readable summary

Example:
```yaml
mode: exploration
slug: 20260307-2015-surface-layer
path: drafts/explorations/20260307-2015-surface-layer
goal: Проверить новый слой surface/dialog parity и собрать артефакты по расхождениям
status: running
started_at: 2026-03-07T20:15:00+04:00
timeout_minutes: 60
summary: Исследуется новый слой surface parity; подготовлен план, открыт escalation budget, собираются локальные факты и артефакты.
```

## `index.md`
`index.md` is the human entry point for the current exploration directory.
It must be in Russian and should at least contain:
- short task statement;
- current hypothesis or focus;
- timeout and current status;
- links to notes, logs, plans, and generated artifacts.

Minimal example:
```md
# Exploration: surface-layer parity

## Задача
Проверить, можно ли собрать новый слой surface/dialog parity без правок production-компонентов.

## Статус
- Старт: 2026-03-07 20:15 +04:00
- Бюджет: 60 минут
- Состояние: running

## Ссылки
- [План](./plan.md)
- [Лог наблюдений](./notes.md)
- [Решения](./decisions.md)
- [Артефакты](./artifacts.md)
```

## Required Rules
- Before execution, prepare a concrete exploration plan with phases, checkpoints, and expected outputs.
- Before execution, estimate which actions require escalation and which can stay local-only.
- Do not begin autonomous exploration until the initial plan and escalation budget are defined.
- Before any non-trivial exploration, ask for a concrete time budget or timeout.
- Record exploration start immediately in the current activity directory and update `drafts/current.yml`.
- Keep a running log of milestones, missing inputs, blocked steps, and unavailable artifacts inside the current activity directory.
- Escalations are forbidden by default.
- Escalations are allowed only after explicit user sanction for the current scope.
- Before any sanctioned escalation phase, define an escalation window:
  exact command set, start marker, and freeze condition.
- Log `escalation-needed` before requesting escalation.
- Log `escalation-result` after the sanctioned command set finishes.
- After escalation freeze, do not issue new escalation requests.
- Never request a new escalation in the middle of an autonomous run unless the user explicitly re-opens planning.
- If a needed command was not included in the pre-agreed escalation window, do not request it ad hoc.
- Instead, log `escalation-blocked` and `missing`, continue with local-only work, and report the gap at the next checkpoint or final handoff.
- Periodically check elapsed time against the agreed timeout and record time checks.
- If timeout is reached or likely to be exceeded, stop and ask whether to extend, narrow scope, or finish with current findings.

## Repository Conventions
- Prefer repository exploration helpers where they exist.
  At the moment, this includes `exploration-init`, `exploration-preflight-*`,
  `exploration-prepare-batch`, `exploration-bootstrap`, and
  `exploration-summarize`.
- Use `make exploration-init slug=<short-slug>` as the quickest way to prepare
  the initial activity directory skeleton under `drafts/explorations/`.
  This helper only creates directories and draft files; it does not start
  exploration mode and must not replace the explicit start sequence from this skill.
- Direct `research-*` commands are allowed only when they are listed in the current escalation window.
- Prefer one-shot privileged bootstrap:
  `make exploration-bootstrap activity_dir=drafts/explorations/<id>`
- After the escalation window is closed, prefer local synthesis via:
  `make exploration-summarize activity_dir=drafts/explorations/<id>`
- Treat `exploration-*` target names as the current repository command interface for exploration support flows.
- During exploration-driven component development, do not modify current production
  components in `src/components` unless explicitly requested.
- For agent-driven exploratory components, create and use `src/experimental`
  directories at the same level as `src/components` inside each workspace.
- Exploratory implementation order is mandatory: implement in
  `m3-vue/src/experimental` first; port to `m3-react/src/experimental` only after
  the exploration outcome is explicitly confirmed as successful.

## Workflow
1. Confirm exploration mode was explicitly requested.
If it was not, do not use this skill.

2. If the user only hinted at exploration mode, run the entry handshake first.
Do not start exploration until the user explicitly confirms it and gives a time budget.

3. Build the initial exploration plan before starting execution.
The plan must include:
- goal and current uncertainty;
- ordered phases;
- checkpoints between phases;
- expected artifacts;
- safe local steps;
- steps that probably require escalation.

4. Build an escalation budget.
List every command or command family that may need escalation during this run.
For each item, record:
- exact command or bounded command set;
- reason;
- expected output or artifact;
- freeze condition after which no more escalation is allowed.

5. Ask for a timeout.
Examples:
- `30 minutes`
- `60 minutes`
- `120 minutes`

6. Create or select the activity directory under `drafts/`.
Use a clear distinct name, for example:
- `drafts/explorations/20260307-2015-surface-layer/`
- `drafts/explorations/20260307-2015-dialog-parity/`
To scaffold this quickly before filling in the run state, you may use:
- `make exploration-init slug=surface-layer`

7. Initialize `drafts/current.yml`.
Write at least:
- active path;
- short goal;
- current status;
- start timestamp;
- timeout;
- short summary.

8. Create `index.md` inside the activity directory.
`index.md` must be in Russian and should link to the other files used during the run.

9. If escalation is likely, ask for sanction on the whole planned escalation window before the run starts.
Prefer one bounded approval phase over incremental requests.
Do not defer obvious escalation planning to later checkpoints.

10. Create the first run notes inside the activity directory.
At minimum record:
- start timestamp;
- agreed timeout;
- current goal;
- planned checkpoints;
- escalation budget summary;
- the main hypothesis;
- sub-hypotheses if already known;
- known missing inputs.

11. Choose the lowest-risk path first.
Order of preference:
- local inspection;
- safe local recipes;
- analysis of existing artifacts;
- sanctioned escalation window only if needed.

12. When escalation is needed, define the window before requesting it.
The window must include:
- exact commands;
- why they are needed;
- what condition ends the window.

13. During execution, keep the activity directory current.
Log:
- hypothesis start;
- hypothesis completion;
- missing data;
- escalation-needed;
- escalation-result;
- escalation-blocked;
- timeout checks.
Update `drafts/current.yml` whenever run status changes materially.

14. If unplanned escalation becomes necessary during the run, do not request it immediately.
Instead:
- log the block;
- continue with safe/local analysis;
- collect all remaining non-privileged findings;
- stop at the next checkpoint or end-of-run synthesis.

15. When sufficient evidence exists, stop exploring and synthesize.
Summarize:
- what was validated;
- what was disproved;
- what remains unknown;
- which next move is safest.

## Expected Outputs
- Updated `drafts/current.yml`
- A dedicated activity directory under `drafts/`
- `index.md` in Russian inside that activity directory
- Any notes, facts, plans, logs, or inventories that help resume context later
- Links to generated local artifacts such as screenshots, fetched JSON, and derived analysis
- A concise user-facing summary with findings, blockers, and recommended next step

## Stop Conditions
Stop exploration and hand back control when:
- the agreed timeout is reached;
- the next required action is outside the current escalation window;
- the remaining uncertainty is mostly product or design uncertainty rather than technical uncertainty;
- enough evidence exists to recommend a clear next step.

Before handoff:
- update `drafts/current.yml` to reflect the latest status;
- ensure `index.md` links to the most important notes and artifacts;
- leave enough written context for the next session to resume without reconstructing the whole run from memory.
