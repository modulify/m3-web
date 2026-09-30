# m3-web

<p align="center"><img src="./m3-foundation/assets/logo.png" alt="Modulify M3 logo" width="128" /></p>

[![codecov](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.codecov.io%2Fapi%2Fv2%2Fgithub%2Fmodulify%2Frepos%2Fm3-web%2F&query=%24.totals.coverage&suffix=%25&label=codecov&logo=codecov&color=F01F7A)](https://codecov.io/gh/modulify/m3-web)
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?logo=storybook&logoColor=white)](https://modulify.github.io/m3-web/)

`m3-web` is a monorepo for a Material Design 3 component library for web.
The project builds a shared UI foundation for two platforms (`React` and `Vue`) with a focus on:
- consistent public API across platforms,
- verifiable quality (lint, tests, Storybook),
- practical engineering readiness for reuse and publishing.

## Repository Contents

| Workspace | Logo | Contents |
| --- | --- | --- |
| `m3-foundation` | <img src="./m3-foundation/assets/logo.png" alt="M3 foundation logo" width="48" /> | Shared styles, tokens, and base utilities. |
| `m3-react` | <img src="./m3-react/assets/logo.png" alt="M3 React logo" width="48" /> | React component implementation. |
| `m3-vue` | <img src="./m3-vue/assets/logo.png" alt="M3 Vue logo" width="48" /> | Vue component implementation. |

Each workspace includes its logo as an SVG and a PNG in `assets/`.

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
