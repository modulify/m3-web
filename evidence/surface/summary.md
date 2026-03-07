# Surface

Date: 2026-02-23  
Status: working draft, promoted to canonical evidence

## Outcome

This package captures the design model for a generalized M3 `surface`.
That model later informed the `M3Surface` components in `m3-vue` and `m3-react`.

## Context and goal

We defined `surface` as a central container primitive that can represent or transform into:
- dialog,
- bottom sheet,
- side sheet,
- navigation drawer,
- menu,
- card, when it grows into a larger container or page-like state.

The goal was to establish the boundaries and requirements for one adaptive container model rather than a disconnected set of special-purpose implementations.

## Working definition

`Surface` is a rectangular container whose visual hierarchy is driven by M3 surface roles and elevation, while its geometry is controlled by tokens and layout rules and may change dynamically.

## Default behavior

- Shape: rectangle, with no forced rounding by default.
- Size: fills the available space inside its own layout context.
- Spacing: does not impose its own `margin` or `padding`.
- Positioning: does not force placement relative to neighboring elements.
- Visual baseline: uses M3 surface and elevation hierarchy for fill and emphasis.

## Required geometry capabilities

- Width must be able to move through constrained ranges, including `narrow -> full-width`.
- Height must be able to move through constrained ranges, including `content-height -> full-height`.
- Corner treatment must support both uniform and side-specific changes.
- Geometry must support `bottom`, `start`, `end`, `center`, and anchor-driven placement.

## Required transformations

- `card -> page_like_container`
- `side_sheet <-> modal_dialog`
- `menu -> modal_dialog` or `menu -> modal_bottom_sheet` on compact viewports
- `standard_sheet_or_drawer -> modal_sheet_or_drawer`
- `standard_side_sheet -> modal_side_sheet`

The focus is on container behavior: geometry, modality, motion, focus, and scrim.
Business logic and inner content composition stay outside the `surface` contract.

## Entity boundaries

Included:
- container geometry,
- surface, elevation, and shape profile,
- modality and scrim behavior,
- dismiss and focus rules at container level,
- motion profiles for container transitions.

Excluded:
- business logic of inner content,
- domain semantics of specific widgets,
- full route-level page composition.

## Key requirements

Functional:
- A surface container must be content-agnostic.
- A surface container must support morphing between key surface archetypes.
- A surface container must support modality switching with corresponding scrim and focus behavior.
- A surface container must support layout-aware constraints by viewport and window class.

Non-functional:
- Geometry decisions must be deterministic.
- Key geometry and visual parameters must be tokenizable.
- Adaptation should be rule-driven rather than a pile of unrelated special cases.
- Morph transitions should be reversible unless a one-way UX rule explicitly overrides that.

## Main hypothesis

A unified `surface` family can support dialog, sheet, drawer, menu, and card transitions without collapsing into an unusable abstraction.

The main unresolved area is side-sheet geometry: the available runtime M3 payload does not expose direct numeric redlines, so side-sheet numbers remain either `guidance` or `inference`.

## Strengths and risks

Strengths:
- reduces duplication between dialog, sheet, drawer, menu, and card behavior,
- gives adaptive transitions one shared conceptual model,
- matches the M3 emphasis on tokens, surface roles, and layered hierarchy.

Risks:
- over-generalization can erase useful constraints from specific component families,
- Compose, MDC, and Web may diverge enough to require explicit branching,
- missing direct side-sheet redlines lowers confidence in a final unified numeric baseline.

## Evidence package

Human-readable:
- `summary.md`
- `panel/side-sheet-guidance.md`

Machine-readable:
- `model/requirements.yaml`
- `model/layers.yaml`
- `model/transitions.yaml`
- `model/spec-findings.yaml`
- `panel/boundaries.yaml`
- `panel/decisions.yaml`
- `panel/tokens.yaml`
- `panel/side-sheet-modal.yaml`
- `fetch/manifest.yaml`

Raw evidence:
- `fetch/*.json`

## Layer orchestration model

The layer model assumes the following active strata:
- `base_content`
- `docked_surfaces`
- `floating_non_modal`
- `modal_scrim`
- `modal_surfaces`
- `top_overlays`

Core rules:
- every surface instance belongs to exactly one active layer at a time,
- entering modal mode requires both modal layer binding and scrim policy,
- `docked -> modal` is not just geometry change; it is explicit layer rebinding,
- background-attached transient overlays should close or rebind when modal state begins.

## Transition model

The initial transition matrix covers:
- `card -> page_like_container`
- `menu -> modal_bottom_sheet`
- `standard_side_sheet -> modal_dialog`
- `standard_navigation_drawer -> modal_navigation_drawer`
- `modal_navigation_drawer -> standard_navigation_drawer`
- `modal_bottom_sheet -> menu`
- `standard_side_sheet -> modal_side_sheet`

For each transition we capture:
- triggers and preconditions,
- layer actions,
- focus and scrim behavior,
- motion profile.

See `model/transitions.yaml` for the machine-readable matrix.

## Key source-backed findings

High-confidence findings from `page-data` and accessible platform markdown:
- menus are temporary surfaces,
- standard bottom sheets coexist with primary content,
- modal bottom sheets block background interaction,
- modal bottom sheets can replace inline menus or simple dialogs on mobile,
- standard navigation drawers allow parallel interaction with drawer and content,
- modal navigation drawers use scrim and block background interaction,
- side sheets have explicit standard and modal semantics.

Medium-confidence guidance and snippet findings:
- compact windows may adapt menus into bottom sheets,
- side sheets tend to use fixed width and usually full height,
- side-sheet sizing depends on layout region structure,
- the preferred side-sheet edge is usually `end/right`,
- a `16dp` inset may be allowed as an optional mode,
- similar content may move between bottom-sheet and side-sheet presentations,
- coplanar side sheets appear to have a dedicated transition pattern.

See `model/spec-findings.yaml` for the structured source list.

## Current baseline judgment

Ready for baseline promotion:
- dialog shape and width,
- menu shape and elevation,
- bottom-sheet max width,
- card elevation and outlined stroke width.

Keep platform-specific:
- bottom-sheet elevation,
- navigation-drawer width.

Keep out of final baseline for now:
- numeric side-sheet geometry.

## Implementation note

This evidence package describes the intended `surface` model.
The implementation question is not whether every detail already exists in `M3Surface`, but how closely the current `M3Surface` components in `m3-vue` and `m3-react` match this contract.
