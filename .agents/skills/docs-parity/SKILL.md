---
name: docs-parity
description: Use this skill when creating or editing documentation files under docs/. It enforces English-first changes, locale translation parity, adding missing translations, and index.md updates per locale with short summaries.
---

# Docs Parity

## When To Use
Use this skill when the task creates or edits documents under `docs/`.

## When Not To Use
- Changes outside `docs/`.

## Required Rules
- English under `docs/en/` is the source of truth.
- For edits: update the English version first, then update localized versions.
- For new docs: create English first, then create localized versions.
- Canonical source path is under `docs/en/`.
- Existing locale directories under `docs/` are discovered first, then translations are created for each locale.
- If a document is found without translation for an existing locale, add the missing translation.
- Each locale keeps the same relative document path.
- Each locale `index.md` must include a link to the local document with a short one-line summary.
- `docs/en/index.md` keeps the `Translations` section with links to locale indexes.

## Workflow
1. Discover locale directories under `docs/`:
```bash
find docs -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort
```
2. Determine relative doc path (for example `guides/component-parity.md`).
If task starts from non-English locale, map to canonical path: `docs/en/<relative-path>`.
3. Apply content changes to English source first:
`docs/en/<relative-path>`.
4. For each discovered locale `L`:
   - ensure file exists at `docs/L/<relative-path>`;
   - if `L` is not `en`, update translation from English source;
   - if missing, create translation.
5. Update `docs/L/index.md` for each locale:
   - add document under `Contents` / `Содержание`;
   - link format:
     `./<relative-path>`;
   - add a short summary on the same line.
6. Ensure `docs/en/index.md` `Translations` section links to available locale indexes.
7. Validate links and parity:
   - every locale has the document file;
   - every locale index links to its local file;
   - no duplicated bullets in indexes.

## Index Entry Format
- English:
`- [Title](./relative/path.md) - Short summary.`
- Russian:
`- [Заголовок](./relative/path.md) - Краткая сводка.`

## Practical Notes
- Keep summaries concise and content-focused.
- Keep document structure aligned across locales (sections, order, intent).
