import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,n as i,o as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./button-Bg5IbSnS.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./LocalTheming.stories-C2oot_LV.js";function g(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(a,{of:u}),`
`,(0,v.jsx)(n.h1,{id:`theming`,children:`Theming`}),`
`,(0,v.jsxs)(n.p,{children:[`Theming is a token contract, not a component override layer. A theme provides Material sys-tokens such as `,(0,v.jsx)(n.code,{children:`--m3-sys-primary`}),`, `,(0,v.jsx)(n.code,{children:`--m3-sys-surface`}),`, and `,(0,v.jsx)(n.code,{children:`--m3-sys-on-surface`}),`; components read those tokens and keep their API unchanged.`]}),`
`,(0,v.jsx)(n.p,{children:`This guide intentionally uses a custom azure-blue baseline theme in examples. It is not the standard Material default. The baseline is changed on purpose so local scope changes are easy to see against a recognizable non-purple primary color.`}),`
`,(0,v.jsx)(n.h2,{id:`theory`,children:`Theory`}),`
`,(0,v.jsx)(n.h3,{id:`theme-layers`,children:`Theme layers`}),`
`,(0,v.jsxs)(n.p,{children:[`The Storybook toolbar still switches the document between `,(0,v.jsx)(n.code,{children:`m3-theme-light`}),` and `,(0,v.jsx)(n.code,{children:`m3-theme-dark`}),`. The examples then add a guide-local baseline scope:`]}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-scss`,children:`.m3-local-theme_showcase {
  --m3-local-primary: #2d5fb8;
  --m3-local-primary-container: #dbe5ff;
  --m3-local-on-primary: #ffffff;
  --m3-local-surface: #f8f9ff;
  --m3-local-surface-container: #edf1fb;
  --m3-local-on-surface: #181c24;
}
`})}),`
`,(0,v.jsx)(n.p,{children:`That scope is deliberately local to this guide. A nested danger, warning, success, or brand scope can then override the same token set for a smaller module.`}),`
`,(0,v.jsx)(n.h3,{id:`local-scope-contract`,children:`Local scope contract`}),`
`,(0,v.jsxs)(n.p,{children:[`A local theme remaps selected `,(0,v.jsx)(n.code,{children:`--m3-sys-*`}),` tokens for descendants only. Components keep the same props; colors, surfaces, and state layers follow the nearest token scope.`]}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-scss`,children:`.m3-local-theme {
  --m3-sys-primary: var(--m3-local-primary);
  --m3-sys-primary-container: var(--m3-local-primary-container);
  --m3-sys-on-primary: var(--m3-local-on-primary);
  --m3-sys-on-primary-container: var(--m3-local-on-primary-container);
  --m3-sys-surface: var(--m3-local-surface);
  --m3-sys-surface-container: var(--m3-local-surface-container);
  --m3-sys-on-surface: var(--m3-local-on-surface);
  --m3-state-layers-on-surface-opacity-008: color-mix(in srgb, var(--m3-local-on-surface) 8%, transparent);
}
`})}),`
`,(0,v.jsx)(n.p,{children:`Use a modifier class to provide concrete values per global theme:`}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-scss`,children:`html.m3-theme-light .m3-local-theme_danger {
  --m3-local-primary: #b42346;
  --m3-local-primary-container: #ffd9e2;
  --m3-local-on-primary: #ffffff;
  --m3-local-surface: #fdf0f4;
  --m3-local-surface-container: #fce9ef;
  --m3-local-on-surface: #34111a;
}
`})}),`
`,(0,v.jsx)(n.h3,{id:`usage-model`,children:`Usage model`}),`
`,(0,v.jsx)(n.p,{children:`Wrap the smallest module that needs the alternate token set.`}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-tsx`,children:`<section className="m3-local-theme m3-local-theme_danger">
  <div className="theme-sample__panel">
    <h3>Delete release</h3>
    <p>This action permanently removes the prepared release draft.</p>
    <M3Button appearance="filled">Delete release</M3Button>
  </div>
</section>
`})}),`
`,(0,v.jsx)(n.p,{children:`Reset a nested control only when it must return to the baseline scope inside a local module.`}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-tsx`,children:`<section className="m3-local-theme m3-local-theme_danger">
  <M3Button appearance="filled">Delete release</M3Button>

  <span className="m3-local-theme m3-local-theme_reset">
    <M3Button appearance="text">Cancel</M3Button>
  </span>
</section>
`})}),`
`,(0,v.jsx)(n.h2,{id:`abstract-examples`,children:`Abstract Examples`}),`
`,(0,v.jsxs)(n.p,{children:[`These examples use simple layout geometry and `,(0,v.jsx)(n.code,{children:`M3Button`}),` actions so token relationships stay visible while the action control still follows the component contract.`]}),`
`,(0,v.jsx)(n.h3,{id:`accent-panel`,children:`Accent panel`}),`
`,(0,v.jsxs)(n.p,{children:[`Use the local `,(0,v.jsx)(n.code,{children:`primary`}),` pair for the action and local surface roles for the surrounding geometry.`]}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-tsx`,children:`<section className="m3-local-theme m3-local-theme_danger theme-sample">
  <div className="theme-sample__panel">
    <span className="theme-sample__label">Danger scope</span>
    <h3>Delete release</h3>
    <p>Primary action tokens recolor the action while surface tokens keep the panel coherent.</p>
    <M3Button appearance="filled">Delete release</M3Button>
  </div>
</section>
`})}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-scss`,children:`.theme-sample {
  padding: 24px;
  background: var(--m3-sys-surface);
  color: var(--m3-sys-on-surface);
}

.theme-sample__panel {
  padding: 20px;
  border: 1px solid var(--m3-sys-outline-variant);
  border-radius: 16px;
  background: var(--m3-sys-surface-container-high);
}

.theme-sample__label {
  color: var(--m3-sys-on-surface-variant);
}
`})}),`
`,(0,v.jsx)(n.p,{children:`Visual result:`}),`
`,(0,v.jsx)(`div`,{className:`m3-local-theme m3-local-theme_danger`,style:{padding:`24px`,borderRadius:`16px`,background:`var(--m3-sys-surface)`,color:`var(--m3-sys-on-surface)`},children:(0,v.jsxs)(`div`,{style:{padding:`20px`,border:`1px solid var(--m3-sys-outline-variant)`,borderRadius:`16px`,background:`var(--m3-sys-surface-container-high)`},children:[(0,v.jsx)(`span`,{style:{color:`var(--m3-sys-on-surface-variant)`,fontSize:`12px`},children:(0,v.jsx)(n.p,{children:`Danger scope`})}),(0,v.jsx)(`h3`,{style:{margin:`8px 0`,color:`var(--m3-sys-on-surface)`},children:`Delete release`}),(0,v.jsx)(`p`,{style:{margin:`0 0 16px`,color:`var(--m3-sys-on-surface-variant)`},children:(0,v.jsx)(n.p,{children:`Primary action tokens recolor the action while surface tokens keep the panel coherent.`})}),(0,v.jsx)(s,{appearance:`filled`,children:`Delete release`})]})}),`
`,(0,v.jsx)(n.h3,{id:`surface-ladder`,children:`Surface ladder`}),`
`,(0,v.jsx)(n.p,{children:`Use container tokens to show hierarchy inside one local scope. The ladder should read as related container tones, not unrelated brand colors.`}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_warm-alert theme-sample">
  <div class="theme-sample__tone theme-sample__tone_low">Low container</div>
  <div class="theme-sample__tone theme-sample__tone_default">Default container</div>
  <div class="theme-sample__tone theme-sample__tone_high">High container</div>
  <div class="theme-sample__tone theme-sample__tone_highest">Highest container</div>
</section>
`})}),`
`,(0,v.jsx)(n.pre,{children:(0,v.jsx)(n.code,{className:`language-scss`,children:`.theme-sample__tone {
  padding: 16px;
  border-radius: 12px;
  color: var(--m3-sys-on-surface);
}

.theme-sample__tone_low { background: var(--m3-sys-surface-container-low); }
.theme-sample__tone_default { background: var(--m3-sys-surface-container); }
.theme-sample__tone_high { background: var(--m3-sys-surface-container-high); }
.theme-sample__tone_highest { background: var(--m3-sys-surface-container-highest); }
`})}),`
`,(0,v.jsx)(n.p,{children:`Visual result:`}),`
`,(0,v.jsxs)(`div`,{className:`m3-local-theme m3-local-theme_warm-alert`,style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(140px, 1fr))`,gap:`12px`,padding:`24px`,borderRadius:`16px`,background:`var(--m3-sys-surface)`,color:`var(--m3-sys-on-surface)`},children:[(0,v.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-low)`},children:(0,v.jsx)(n.p,{children:`Low container`})}),(0,v.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container)`},children:(0,v.jsx)(n.p,{children:`Default container`})}),(0,v.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-high)`},children:(0,v.jsx)(n.p,{children:`High container`})}),(0,v.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-highest)`},children:(0,v.jsx)(n.p,{children:`Highest container`})})]}),`
`,(0,v.jsx)(n.h2,{id:`cookbook`,children:`Cookbook`}),`
`,(0,v.jsx)(n.h3,{id:`notification-scopes`,children:`Notification scopes`}),`
`,(0,v.jsx)(n.p,{children:`Each notification draws a small token palette above the component. The left notification stays on the azure-blue guide theme; the right notification adds a local scope.`}),`
`,(0,v.jsx)(i,{of:d}),`
`,(0,v.jsx)(i,{of:f}),`
`,(0,v.jsx)(i,{of:l}),`
`,(0,v.jsx)(i,{of:h}),`
`,(0,v.jsx)(n.h3,{id:`list-menu-with-a-destructive-action`,children:`List menu with a destructive action`}),`
`,(0,v.jsxs)(n.p,{children:[`The list follows the azure-blue baseline. The release checklist item owns an icon action with a popper menu. Only the destructive menu item is wrapped in the danger scope, so `,(0,v.jsx)(n.code,{children:`Delete list`}),` uses danger `,(0,v.jsx)(n.code,{children:`primary`}),`, `,(0,v.jsx)(n.code,{children:`on-surface`}),`, and state-layer tokens while the rest of the menu remains in the main theme.`]}),`
`,(0,v.jsx)(i,{of:p}),`
`,(0,v.jsx)(n.h2,{id:`token-reference`,children:`Token Reference`}),`
`,(0,v.jsx)(n.h3,{id:`primary-action-tokens`,children:`Primary action tokens`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-primary`}),`: main accent color for filled primary controls, active marks, selected indicators, and high-emphasis affordances inside the local scope.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-on-primary`}),`: text and icon color placed on `,(0,v.jsx)(n.code,{children:`primary`}),`; it must preserve contrast for filled controls.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-primary-container`}),`: softer accent container for badges, labels, selected surfaces, and low-emphasis accent backgrounds.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-on-primary-container`}),`: text and icon color placed on `,(0,v.jsx)(n.code,{children:`primary-container`}),`.`]}),`
`]}),`
`,(0,v.jsx)(n.h3,{id:`secondary-container-tokens`,children:`Secondary container tokens`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-secondary-container`}),`: tonal button and selected container background when the component uses secondary emphasis rather than the primary filled color.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-on-secondary-container`}),`: text, icon, and state-layer source color placed on `,(0,v.jsx)(n.code,{children:`secondary-container`}),`.`]}),`
`]}),`
`,(0,v.jsx)(n.h3,{id:`surface-tokens`,children:`Surface tokens`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-surface`}),`: default background color for the local scope. Use it for the page or module base where content is not inside a distinct container.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-surface-container-low`}),`: low-emphasis container color. Use it for subtle panels or container areas that should separate from `,(0,v.jsx)(n.code,{children:`surface`}),` without becoming prominent.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-surface-container`}),`: default container color. Use it for menus, tooltips, lists, and neutral component containers that need a clear contained surface.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-surface-container-high`}),`: high-emphasis container color. Use it for dialogs, prominent panels, and surfaces that need stronger separation in the local scope.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-surface-container-highest`}),`: highest-emphasis container color. Use it for the strongest neutral container or nested surfaces that must stand apart.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-surface-variant`}),`: alternate neutral-variant surface for components that intentionally use the neutral-variant family.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-inverse-surface`}),`: opposite-luminance surface for temporary high-contrast elements such as plain tooltips.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-inverse-on-surface`}),`: text and icon color placed on `,(0,v.jsx)(n.code,{children:`inverse-surface`}),`.`]}),`
`]}),`
`,(0,v.jsxs)(n.p,{children:[`The `,(0,v.jsx)(n.code,{children:`surface-container-*`}),` tokens form a tonal ladder. Choose them by container emphasis and visual hierarchy, not by hard-coded shadows.`]}),`
`,(0,v.jsx)(n.h3,{id:`text-and-boundary-tokens`,children:`Text and boundary tokens`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-on-surface`}),`: primary text and icon color on local surfaces.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-on-surface-variant`}),`: secondary text, supporting text, subdued icons, labels, and metadata.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-outline`}),`: stronger boundary color for visible borders and focus-adjacent structure.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-sys-outline-variant`}),`: quieter divider and low-emphasis border color.`]}),`
`]}),`
`,(0,v.jsx)(n.h3,{id:`state-layer-tokens`,children:`State-layer tokens`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-state-layers-on-surface-opacity-008`}),`: hover layer for elements whose foreground is `,(0,v.jsx)(n.code,{children:`on-surface`}),`.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-state-layers-on-surface-opacity-012`}),`: focus layer for elements whose foreground is `,(0,v.jsx)(n.code,{children:`on-surface`}),`.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-state-layers-on-surface-opacity-020`}),`: pressed or stronger interaction layer for elements whose foreground is `,(0,v.jsx)(n.code,{children:`on-surface`}),`.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-state-layers-on-secondary-container-opacity-008`}),`: hover layer for elements placed on `,(0,v.jsx)(n.code,{children:`secondary-container`}),`.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-state-layers-on-secondary-container-opacity-012`}),`: focus layer for elements placed on `,(0,v.jsx)(n.code,{children:`secondary-container`}),`.`]}),`
`,(0,v.jsxs)(n.li,{children:[(0,v.jsx)(n.code,{children:`--m3-state-layers-on-secondary-container-opacity-020`}),`: pressed or stronger interaction layer for elements placed on `,(0,v.jsx)(n.code,{children:`secondary-container`}),`.`]}),`
`]}),`
`,(0,v.jsx)(n.p,{children:`State-layer tokens should be generated from the local foreground color, not copied from the global theme.`}),`
`,(0,v.jsx)(n.h2,{id:`story-guide`,children:`Story Guide`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsx)(n.li,{children:(0,v.jsx)(n.a,{href:`?path=/story/guides-theming--danger-notification`,children:`Danger Notification`})}),`
`,(0,v.jsx)(n.li,{children:(0,v.jsx)(n.a,{href:`?path=/story/guides-theming--warm-alert-notification`,children:`Warm Alert Notification`})}),`
`,(0,v.jsx)(n.li,{children:(0,v.jsx)(n.a,{href:`?path=/story/guides-theming--success-notification`,children:`Success Notification`})}),`
`,(0,v.jsx)(n.li,{children:(0,v.jsx)(n.a,{href:`?path=/story/guides-theming--brand-muted-notification`,children:`Brand Muted Notification`})}),`
`,(0,v.jsx)(n.li,{children:(0,v.jsx)(n.a,{href:`?path=/story/guides-theming--list-with-danger-menu`,children:`List With Danger Menu`})}),`
`]}),`
`,(0,v.jsx)(n.h2,{id:`do--dont`,children:`Do / don't`}),`
`,(0,v.jsx)(n.h3,{id:`do`,children:`Do`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsx)(n.li,{children:`keep local scopes small and attached to a meaningful product module`}),`
`,(0,v.jsx)(n.li,{children:`define local values for light and dark themes together`}),`
`,(0,v.jsx)(n.li,{children:`draw state-layer tokens from the local foreground colors`}),`
`,(0,v.jsx)(n.li,{children:`test default, hovered, focused, selected, and disabled states inside the scope`}),`
`]}),`
`,(0,v.jsx)(n.h3,{id:`dont`,children:`Don’t`}),`
`,(0,v.jsxs)(n.ul,{children:[`
`,(0,v.jsx)(n.li,{children:`override component classes directly when a sys-token can express the change`}),`
`,(0,v.jsx)(n.li,{children:`use local theming to create unrelated visual systems inside one page`}),`
`,(0,v.jsx)(n.li,{children:`change only accent tokens while leaving surface and state-layer tokens global`}),`
`,(0,v.jsx)(n.li,{children:`nest reset scopes unless the inner control has a clear reason to return to baseline`}),`
`]})]})}function _(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,v.jsx)(n,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=o(),n(),r(),c(),m()})))()}y();export{_ as default};