# Popper Animation Evidence
Date: 2026-02-22

## Sources
### Primary references
- User-provided design reference video:
  - https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlk1jwz-GM3_Menus_Guidelines%2001_IA_v01.mp4?alt=media&token=2e7dfcc9-2447-4808-8234-83c313d82df8
- Material 3 motion pages:
  - https://m3.material.io/styles/motion/overview
  - https://m3.material.io/foundations/motion/applying-easing-and-duration
  - https://m3.material.io/styles/motion/easing-and-duration/tokens-specs

### Token/easing references used as practical source of truth
- Flutter generated motion tokens:
  - https://flutter.googlesource.com/mirrors/packages/+/refs/tags/google_maps_flutter-v2.7.0/packages/flutter/lib/src/material/motion.dart
- Flutter API docs for durations and easing:
  - https://api.flutter.dev/flutter/material/Durations-class.html
  - https://api.flutter.dev/flutter/material/Easing/standard-constant.html
  - https://api.flutter.dev/flutter/material/Easing/standardAccelerate-constant.html
  - https://api.flutter.dev/flutter/material/Easing/standardDecelerate-constant.html
  - https://api.flutter.dev/flutter/material/Easing/emphasizedAccelerate-constant.html
  - https://api.flutter.dev/flutter/material/Easing/emphasizedDecelerate-constant.html

### Internal empirical source
- Implementation and local validation log in `draft.txt`:
  - wrapper split (`.m3-popper-positioner` + `.m3-popper`)
  - updated E2E assertions
  - local check commands and outcomes

## Extracted Facts
### Direct facts
1. Positioning and animation transforms conflict if both are applied to the same element.
2. Splitting responsibilities into two elements is technically viable:
   - outer element handles geometry (`absolute/top/left/transform` from floating-ui),
   - inner element handles visual animation (`transform/opacity/visibility`).
3. Show ordering matters: first position (`await adjust`), then reveal content.
4. Animation direction must use the effective side after flip (actual placement), not requested placement.
5. Headless access to `m3.material.io` pages may be limited (JS-required shell), so token tables were taken from official generated/tokenized sources.
6. Local verification was reported as green after stabilization:
   - `tsc` for foundation/react/vue,
   - `eslint`,
   - unit and e2e checks for popper,
   - combined coverage run (`80.11%`).

### Motion token facts (from token references)
1. Duration token scale:
   - short: 50/100/150/200 ms,
   - medium: 250/300/350/400 ms,
   - long: 450/500/550/600 ms,
   - extra long: 700/800/900/1000 ms.
2. Easing token curves:
   - standard: `cubic-bezier(0.2, 0.0, 0.0, 1.0)`,
   - standardAccelerate: `cubic-bezier(0.3, 0.0, 1.0, 1.0)`,
   - standardDecelerate: `cubic-bezier(0.0, 0.0, 0.0, 1.0)`,
   - emphasizedAccelerate: `cubic-bezier(0.3, 0.0, 0.8, 0.15)`,
   - emphasizedDecelerate: `cubic-bezier(0.05, 0.7, 0.1, 1.0)`,
   - linear: `cubic-bezier(0.0, 0.0, 1.0, 1.0)`.

### Inferences used for implementation tuning
1. Enter animation should prefer decelerate-family easing, exit should prefer accelerate-family easing.
2. Perceived "menu unfolding from anchor point" depends on:
   - side-aware `transform-origin`,
   - axis-dominant scale (uncollapse) with small translation offset.
3. Candidate presets for iterative tuning:
   - `short3/short1` or `short4/short2`,
   - decelerate for enter + accelerate for exit.

## Notes for future work
- Keep parity of popper behavior checks in React and Vue E2E.
- Freeze chosen duration/easing pair in tests via computed-style assertions to prevent regressions.
