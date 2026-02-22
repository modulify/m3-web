# Contributing Guide

This document describes the practical contribution flow for `m3-web`.

## Project Goal

`m3-web` develops a Material Design 3 component library for web as a monorepo:
- shared foundation (`m3-foundation`),
- two platform implementations (`m3-react` and `m3-vue`),
- focus on predictable quality and API parity.

## Quick Start

```bash
make .yarnrc.yml
make node_modules
make test
```

## Core Commands

- `make build`: build all workspaces.
- `make eslint`: run lint checks.
- `make test`: run unit/integration tests.
- `make storybook-build-test`: build Storybook in `--test` mode for React and Vue.
- `make test-smoke`: run smoke tests.
- `yarn tsc`: run package-level type checks for all workspaces.

## Quality Gates (CI)

CI runs:
- `eslint`,
- `tests`,
- `storybook-tests`:
  `storybook:build --test` for React and Vue + accessibility smoke tests.

Locally, it is recommended to run the same checks before pushing changes.

## Repository Structure

- `m3-foundation`: styles, tokens, and shared helpers.
- `m3-react`: React components, tests, and Storybook.
- `m3-vue`: Vue components, tests, and Storybook.

## TSConfig Layering

This project separates configs for editor DX and package-level type checks.
Details: `./tsconfig-layering.md`.

In short:
- workspace `tsconfig.json`: for IDE, tests, and Storybook,
- workspace `tsconfig.tsc.json`: for CI/typecheck and publishable source.
