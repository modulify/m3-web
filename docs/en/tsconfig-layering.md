# TSConfig Layering

This repository uses separate TypeScript configs for editor-time DX and package-level CI type checks.

## Layers

1. `tsconfig.json` (root)
- Shared baseline compiler options for all workspaces.

2. `m3-react/tsconfig.json` and `m3-vue/tsconfig.json`
- Editor-oriented workspace configs.
- Include `src`, `storybook`, and `tests`.
- Keep test globals (`vitest/globals`) where needed for IDE autocomplete in test files.

3. `m3-react/tsconfig.tsc.json` and `m3-vue/tsconfig.tsc.json`
- CI/package typecheck configs.
- Include only publishable source (`src`, `types`, shims).
- Exclude `storybook` and `tests`.
- Reset `types` to `[]` to avoid pulling test-only globals into package checks.

## Which Commands Use Which Config

- `yarn workspace @modulify/m3-react tsc` -> `m3-react/tsconfig.tsc.json`
- `yarn workspace @modulify/m3-vue tsc` -> `m3-vue/tsconfig.tsc.json`
- `yarn tsc` (root) -> runs workspace `tsc` scripts above.

## Rules of Thumb

- If the goal is package correctness in CI/release, change `tsconfig.tsc.json`.
- If the goal is local editor/test/storybook experience, change workspace `tsconfig.json`.
- Keep root `tsconfig.json` as shared baseline only.
