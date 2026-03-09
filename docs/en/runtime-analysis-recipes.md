# Runtime Analysis Recipes

This document describes the Playwright-based research recipes available in
`m3-web` for reducing uncertainty when visual or runtime behavior is unclear.

## When To Use

Use these recipes when:
- a Storybook page looks wrong and screenshots are not enough;
- a layout shifts, overlaps, or animates unexpectedly;
- local theming or CSS tokens appear to be ignored;
- React and Vue parity is unclear;
- visual regressions need before/after or matrix comparison;
- runtime errors may be hidden in console, network, or accessibility state.

## Core Principle

Prefer these recipes before guessing. They are intended to turn “something is
off” into concrete evidence: screenshots, computed styles, layout metrics,
accessibility trees, traces, and diffs.

## Most Useful Recipes

- `make research-capture url='...'` - Single screenshot with metadata.
- `make research-capture-batch in=urls.txt out_dir=drafts/screenshots/...` -
  Batch screenshot capture from a URL list.
- `make research-style-dump url='...' selector='...'` - Computed styles and CSS
  custom properties for one element.
- `make research-layout-metrics url='...' selectors='.a||.b||.c'` - Bounding
  boxes, scroll metrics, offsets, and layout details for multiple elements.
- `make research-token-diff url='...' selector='.left' compare_selector='.right'`
  - CSS variable diff between two scopes.
- `make research-console-capture url='...'` - Console messages, page errors,
  and failed requests.
- `make research-a11y-snapshot url='...' selector='...'` - Accessibility tree
  for the page or a subtree.
- `make research-trace url='...' action_selector='...' interaction=click` -
  Playwright trace for a page and optional interaction.
- `make research-motion-sample url='...' action_selector='...' interaction=click`
  - Timed frame sequence for motion and transitions.
- `make research-capture-diff left=before.png right=after.png out=diff.png` -
  Pixel diff for two images or directories.
- `make research-capture-matrix ...` - Capture one URL across multiple themes,
  globals, args, and viewports.
- `make research-story-props story_id='...' themes='light,dark' args_sets='...'`
  - Storybook-oriented matrix capture for story args and globals.

## Typical Workflows

## Investigate A Broken Layout

1. Capture the current page:
   `make research-capture url='...'`
2. Dump layout metrics:
   `make research-layout-metrics url='...' selectors='.host||.panel||.scrim'`
3. Dump computed styles for the suspicious node:
   `make research-style-dump url='...' selector='.panel'`

## Investigate A Theme Or Token Problem

1. Capture the page in both themes:
   `make research-capture-matrix story_id='...' themes='light,dark'`
2. Compare token scopes:
   `make research-token-diff url='...' selector='.default-scope' compare_selector='.local-scope'`
3. Inspect computed variables:
   `make research-style-dump url='...' selector='.local-scope' var_prefixes='--m3-sys-,--m3-state-layers-'`

## Investigate Animation Or Motion

1. Capture a motion sequence:
   `make research-motion-sample url='...' action_selector='...' interaction=click`
2. If behavior is still unclear, capture a trace:
   `make research-trace url='...' action_selector='...' interaction=click`

## Compare Two Runtime States

1. Capture both states into separate directories.
2. Run:
   `make research-capture-diff left=dir-a right=dir-b out_dir=drafts/research/diff`

## Storybook Notes

- Storybook pages can be opened directly with:
  `http://m3-vue.modulify.test/?path=/story/...&globals=theme:dark`
- For systematic capture across states, prefer `research-story-props` and
  `research-capture-matrix` over manually building many URLs.

## Output Conventions

- Screenshots are written under `drafts/screenshots/...` unless overridden.
- Runtime inspection outputs default to `drafts/research/...`.
- Most recipes emit machine-readable JSON so results can be inspected or
  compared later.

## Recommendation

When a bug report is vague, start with:
1. `research-capture`
2. `research-style-dump`
3. `research-layout-metrics`

That combination usually clarifies whether the problem is geometry, styling,
token inheritance, or runtime state.
