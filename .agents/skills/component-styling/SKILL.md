---
name: component-styling
description: Create, refactor, or review m3-web component styles and Vue/React class bindings using verified foundation styles, BEM, and readable conditional classes. Use for component SCSS, visual states, layout, or class binding changes in m3-foundation, m3-vue, and m3-react.
---

# Component Styling

## Sources of truth

- Read `AGENTS.md` and inspect the component, its consumers, and neighboring components in the current checkout. Use `make help` to find the relevant checks.
- Shared component styles, tokens, typography, layout, and motion belong in `m3-foundation/assets/stylesheets/`. Verify each variable, mixin, and import path there before using it. A plausible name is not evidence that a token exists.
- Keep React and Vue implementations aligned with the same foundation classes and visual states. Framework-specific code owns class assignment and interaction, not duplicate design values.
- Use `m3-foundation/assets/stylesheets/storybook/utils.scss` for small, generic Storybook layout and spacing. Check that a utility exists and is loaded before using it. Component semantics belong in the component stylesheet.

## Classes and structure

- Use the established global `m3-` BEM names: `block__element` and `block_modifier`. Keep each selector tied to the component that owns it. Use shallow SCSS nesting and inspect the selector produced by `&` when moving rules.
- In Vue, use plain `class` when all classes are static. If a node has a conditional class, put its base class and modifiers in one object-valued `:class`; avoid arrays, conditional strings, and simultaneous `class` plus `:class` on that node.
- In React, use a string `className` for static classes. For conditional classes, pass an object with an explicit base class to `toClassName`. If a public `className` must also be forwarded, append it outside that object with `toClassName([baseAndModifiers, className])`.
- Prefer readable multiline class objects when the condition or class name is substantial. Do not compress JSX, templates, callbacks, or objects merely to reduce line count.
- Add a DOM node only when it has a structural, semantic, accessibility, or interaction role. Check existing elements, flex/grid, and pseudo-elements before adding one solely for styling.
- Treat root classes and documented CSS variables as potential public styling hooks. Search their selectors and consumers before removing or renaming them.

```vue
<button :class="{
    'm3-example__item': true,
    'm3-example__item_selected': selected,
}" />
```

```tsx
<button className={toClassName({
  'm3-example__item': true,
  'm3-example__item_selected': selected,
})} />
```

## Geometry and states

- Prefer foundation tokens and mixins for design-system values. Retain a local literal when it expresses component-specific geometry or a documented measurement; do not invent a shared token for a one-off value.
- Prefer logical CSS properties for direction-aware layout. Place a local media or container query inside the element or modifier whose rule it changes when this keeps related declarations together.
- Keep hover, focus-visible, active, disabled, selected, and loading states explicit. Check state and ripple surfaces against their intended geometry, not just the outer hit target.
- Identify the real owner of size, overflow, and scrolling before changing a leaf component. Do not hide overflow merely to cover a layout defect.

## Verification

- For class-only refactors, run focused ESLint and type checks; run behavior tests when the class change affects an interaction or public state.
- For SCSS changes, run the relevant build. For geometry, overflow, theme, or animation changes, read `docs/en/runtime-analysis-recipes.md` and verify the affected Storybook state in a browser with the repository's Playwright recipes.
- Finish with `git diff --check` and inspect the changed files for accidental generated artifacts.
