# m3-web

[![codecov](https://codecov.io/gh/modulify/m3-web/graph/badge.svg?branch=main)](https://codecov.io/gh/modulify/m3-web)

`m3-web` is a monorepo for a Material Design 3 component library for web.
The project builds a shared UI foundation for two platforms (`React` and `Vue`) with a focus on:
- consistent public API across platforms,
- verifiable quality (lint, tests, Storybook),
- practical engineering readiness for reuse and publishing.

## Repository Contents

- `m3-foundation`: shared styles, tokens, and base utilities.
- `m3-react`: React component implementation.
- `m3-vue`: Vue component implementation.

## Participating

Contribution docs: `docs/en/index.md`
Acknowledgements: `ACKNOWLEDGEMENTS.md`

## Releasing

Run the `Release` GitHub Actions workflow from a branch. Stable releases are
restricted to `main` and publish with the npm `latest` dist-tag; `alpha`,
`beta`, and `rc` releases use the matching dist-tag.

The workflow uses `NPM_TOKEN` when it is configured, falls back to the legacy
`NPM_PUBLISH_TOKEN` secret, and otherwise publishes through npm trusted
publishing (OIDC). Trusted publishing must be configured separately for all
three npm packages with this repository and `.github/workflows/release.yml`.
Because npm requires an existing package before a trusted publisher can be
configured, the first publication of a new package must use a token.

Before creating a release commit and tag, the workflow runs type checks,
linting, unit and browser tests, package builds, Storybook builds, and a packed
consumer check. Publication is resumable: versions already present in npm are
skipped, while unpublished workspaces continue in dependency order.
