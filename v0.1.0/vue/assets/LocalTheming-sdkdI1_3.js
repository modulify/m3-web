import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,n,o as r}from"./blocks-Coxbmtpx.js";import{i,r as a}from"./react-BXJ34t_g.js";import{a as o}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as s,t as c}from"./Inline-Ch5hsbpx.js";import{n as l,t as u}from"./ButtonExample-C2IYuWMs.js";import{a as d,i as f,n as p,o as m,r as h,s as g,t as _}from"./LocalTheming.stories-BbD0u_R6.js";function v(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...i(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(r,{of:f}),`
`,(0,b.jsx)(t.h1,{id:`theming`,children:`Theming`}),`
`,(0,b.jsxs)(t.p,{children:[`Theming is a token contract, not a component override layer. A theme provides Material sys-tokens such as `,(0,b.jsx)(t.code,{children:`--m3-sys-primary`}),`, `,(0,b.jsx)(t.code,{children:`--m3-sys-surface`}),`, and `,(0,b.jsx)(t.code,{children:`--m3-sys-on-surface`}),`; components read those tokens and keep their API unchanged.`]}),`
`,(0,b.jsx)(t.p,{children:`This guide intentionally uses a custom azure-blue baseline theme in examples. It is not the standard Material default. The baseline is changed on purpose so local scope changes are easy to see against a recognizable non-purple primary color.`}),`
`,(0,b.jsx)(t.h2,{id:`theory`,children:`Theory`}),`
`,(0,b.jsx)(t.h3,{id:`theme-layers`,children:`Theme layers`}),`
`,(0,b.jsxs)(t.p,{children:[`The Storybook toolbar still switches the document between `,(0,b.jsx)(t.code,{children:`m3-theme-light`}),` and `,(0,b.jsx)(t.code,{children:`m3-theme-dark`}),`. The examples then add a guide-local baseline scope:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-scss`,children:`.m3-local-theme_showcase {
  --m3-local-primary: #2d5fb8;
  --m3-local-primary-container: #dbe5ff;
  --m3-local-on-primary: #ffffff;
  --m3-local-surface: #f8f9ff;
  --m3-local-surface-container: #edf1fb;
  --m3-local-on-surface: #181c24;
}
`})}),`
`,(0,b.jsx)(t.p,{children:`That scope is deliberately local to this guide. A nested danger, warning, success, or brand scope can then override the same token set for a smaller module.`}),`
`,(0,b.jsx)(t.h3,{id:`local-scope-contract`,children:`Local scope contract`}),`
`,(0,b.jsxs)(t.p,{children:[`A local theme remaps selected `,(0,b.jsx)(t.code,{children:`--m3-sys-*`}),` tokens for descendants only. Components keep the same props; colors, surfaces, and state layers follow the nearest token scope.`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-scss`,children:`.m3-local-theme {
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
`,(0,b.jsx)(t.p,{children:`Use a modifier class to provide concrete values per global theme:`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-scss`,children:`html.m3-theme-light .m3-local-theme_danger {
  --m3-local-primary: #b42346;
  --m3-local-primary-container: #ffd9e2;
  --m3-local-on-primary: #ffffff;
  --m3-local-surface: #fdf0f4;
  --m3-local-surface-container: #fce9ef;
  --m3-local-on-surface: #34111a;
}
`})}),`
`,(0,b.jsx)(t.h3,{id:`usage-model`,children:`Usage model`}),`
`,(0,b.jsx)(t.p,{children:`Wrap the smallest module that needs the alternate token set.`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_danger">
  <div class="theme-sample__panel">
    <h3>Delete release</h3>
    <p>This action permanently removes the prepared release draft.</p>
    <M3Button appearance="filled">Delete release</M3Button>
  </div>
</section>
`})}),`
`,(0,b.jsx)(t.p,{children:`Reset a nested control only when it must return to the baseline scope inside a local module.`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_danger">
  <M3Button appearance="filled">Delete release</M3Button>

  <span class="m3-local-theme m3-local-theme_reset">
    <M3Button appearance="text">Cancel</M3Button>
  </span>
</section>
`})}),`
`,(0,b.jsx)(t.h2,{id:`abstract-examples`,children:`Abstract Examples`}),`
`,(0,b.jsxs)(t.p,{children:[`These examples use simple layout geometry and `,(0,b.jsx)(t.code,{children:`M3Button`}),` actions so token relationships stay visible while the action control still follows the component contract.`]}),`
`,(0,b.jsx)(t.h3,{id:`accent-panel`,children:`Accent panel`}),`
`,(0,b.jsxs)(t.p,{children:[`Use the local `,(0,b.jsx)(t.code,{children:`primary`}),` pair for the action and local surface roles for the surrounding geometry.`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_danger theme-sample">
  <div class="theme-sample__panel">
    <span class="theme-sample__label">Danger scope</span>
    <h3>Delete release</h3>
    <p>Primary action tokens recolor the action while surface tokens keep the panel coherent.</p>
    <M3Button appearance="filled">Delete release</M3Button>
  </div>
</section>
`})}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-scss`,children:`.theme-sample {
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
`,(0,b.jsx)(t.p,{children:`Visual result:`}),`
`,(0,b.jsx)(`div`,{className:`m3-local-theme m3-local-theme_danger`,style:{padding:`24px`,borderRadius:`16px`,background:`var(--m3-sys-surface)`,color:`var(--m3-sys-on-surface)`},children:(0,b.jsxs)(`div`,{style:{padding:`20px`,border:`1px solid var(--m3-sys-outline-variant)`,borderRadius:`16px`,background:`var(--m3-sys-surface-container-high)`},children:[(0,b.jsx)(`span`,{style:{color:`var(--m3-sys-on-surface-variant)`,fontSize:`12px`},children:(0,b.jsx)(t.p,{children:`Danger scope`})}),(0,b.jsx)(`h3`,{style:{margin:`8px 0`,color:`var(--m3-sys-on-surface)`},children:`Delete release`}),(0,b.jsx)(`p`,{style:{margin:`0 0 16px`,color:`var(--m3-sys-on-surface-variant)`},children:(0,b.jsx)(t.p,{children:`Primary action tokens recolor the action while surface tokens keep the panel coherent.`})}),(0,b.jsx)(c,{tag:`span`,is:u,label:`Delete release`,appearance:`filled`})]})}),`
`,(0,b.jsx)(t.h3,{id:`surface-ladder`,children:`Surface ladder`}),`
`,(0,b.jsx)(t.p,{children:`Use container tokens to show hierarchy inside one local scope. The ladder should read as related container tones, not unrelated brand colors.`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_warm-alert theme-sample">
  <div class="theme-sample__tone theme-sample__tone_low">Low container</div>
  <div class="theme-sample__tone theme-sample__tone_default">Default container</div>
  <div class="theme-sample__tone theme-sample__tone_high">High container</div>
  <div class="theme-sample__tone theme-sample__tone_highest">Highest container</div>
</section>
`})}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-scss`,children:`.theme-sample__tone {
  padding: 16px;
  border-radius: 12px;
  color: var(--m3-sys-on-surface);
}

.theme-sample__tone_low { background: var(--m3-sys-surface-container-low); }
.theme-sample__tone_default { background: var(--m3-sys-surface-container); }
.theme-sample__tone_high { background: var(--m3-sys-surface-container-high); }
.theme-sample__tone_highest { background: var(--m3-sys-surface-container-highest); }
`})}),`
`,(0,b.jsx)(t.p,{children:`Visual result:`}),`
`,(0,b.jsxs)(`div`,{className:`m3-local-theme m3-local-theme_warm-alert`,style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(140px, 1fr))`,gap:`12px`,padding:`24px`,borderRadius:`16px`,background:`var(--m3-sys-surface)`,color:`var(--m3-sys-on-surface)`},children:[(0,b.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-low)`},children:(0,b.jsx)(t.p,{children:`Low container`})}),(0,b.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container)`},children:(0,b.jsx)(t.p,{children:`Default container`})}),(0,b.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-high)`},children:(0,b.jsx)(t.p,{children:`High container`})}),(0,b.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-highest)`},children:(0,b.jsx)(t.p,{children:`Highest container`})})]}),`
`,(0,b.jsx)(t.h2,{id:`cookbook`,children:`Cookbook`}),`
`,(0,b.jsx)(t.h3,{id:`notification-scopes`,children:`Notification scopes`}),`
`,(0,b.jsx)(t.p,{children:`Each notification draws a small token palette above the component. The left notification stays on the azure-blue guide theme; the right notification adds a local scope.`}),`
`,(0,b.jsx)(n,{of:p}),`
`,(0,b.jsx)(n,{of:m}),`
`,(0,b.jsx)(n,{of:d}),`
`,(0,b.jsx)(n,{of:_}),`
`,(0,b.jsx)(t.h3,{id:`list-menu-with-a-destructive-action`,children:`List menu with a destructive action`}),`
`,(0,b.jsxs)(t.p,{children:[`The list follows the azure-blue baseline. The release checklist item owns an icon action with a popper menu. Only the destructive menu item is wrapped in the danger scope, so `,(0,b.jsx)(t.code,{children:`Delete list`}),` uses danger `,(0,b.jsx)(t.code,{children:`primary`}),`, `,(0,b.jsx)(t.code,{children:`on-surface`}),`, and state-layer tokens while the rest of the menu remains in the main theme.`]}),`
`,(0,b.jsx)(n,{of:h}),`
`,(0,b.jsx)(t.h2,{id:`token-reference`,children:`Token Reference`}),`
`,(0,b.jsx)(t.h3,{id:`primary-action-tokens`,children:`Primary action tokens`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-primary`}),`: main accent color for filled primary controls, active marks, selected indicators, and high-emphasis affordances inside the local scope.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-on-primary`}),`: text and icon color placed on `,(0,b.jsx)(t.code,{children:`primary`}),`; it must preserve contrast for filled controls.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-primary-container`}),`: softer accent container for badges, labels, selected surfaces, and low-emphasis accent backgrounds.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-on-primary-container`}),`: text and icon color placed on `,(0,b.jsx)(t.code,{children:`primary-container`}),`.`]}),`
`]}),`
`,(0,b.jsx)(t.h3,{id:`secondary-container-tokens`,children:`Secondary container tokens`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-secondary-container`}),`: tonal button and selected container background when the component uses secondary emphasis rather than the primary filled color.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-on-secondary-container`}),`: text, icon, and state-layer source color placed on `,(0,b.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`]}),`
`,(0,b.jsx)(t.h3,{id:`surface-tokens`,children:`Surface tokens`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-surface`}),`: default background color for the local scope. Use it for the page or module base where content is not inside a distinct container.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-surface-container-low`}),`: low-emphasis container color. Use it for subtle panels or container areas that should separate from `,(0,b.jsx)(t.code,{children:`surface`}),` without becoming prominent.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-surface-container`}),`: default container color. Use it for menus, tooltips, lists, and neutral component containers that need a clear contained surface.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-surface-container-high`}),`: high-emphasis container color. Use it for dialogs, prominent panels, and surfaces that need stronger separation in the local scope.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-surface-container-highest`}),`: highest-emphasis container color. Use it for the strongest neutral container or nested surfaces that must stand apart.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-surface-variant`}),`: alternate neutral-variant surface for components that intentionally use the neutral-variant family.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-inverse-surface`}),`: opposite-luminance surface for temporary high-contrast elements such as plain tooltips.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-inverse-on-surface`}),`: text and icon color placed on `,(0,b.jsx)(t.code,{children:`inverse-surface`}),`.`]}),`
`]}),`
`,(0,b.jsxs)(t.p,{children:[`The `,(0,b.jsx)(t.code,{children:`surface-container-*`}),` tokens form a tonal ladder. Choose them by container emphasis and visual hierarchy, not by hard-coded shadows.`]}),`
`,(0,b.jsx)(t.h3,{id:`text-and-boundary-tokens`,children:`Text and boundary tokens`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-on-surface`}),`: primary text and icon color on local surfaces.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-on-surface-variant`}),`: secondary text, supporting text, subdued icons, labels, and metadata.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-outline`}),`: stronger boundary color for visible borders and focus-adjacent structure.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-sys-outline-variant`}),`: quieter divider and low-emphasis border color.`]}),`
`]}),`
`,(0,b.jsx)(t.h3,{id:`state-layer-tokens`,children:`State-layer tokens`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-state-layers-on-surface-opacity-008`}),`: hover layer for elements whose foreground is `,(0,b.jsx)(t.code,{children:`on-surface`}),`.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-state-layers-on-surface-opacity-012`}),`: focus layer for elements whose foreground is `,(0,b.jsx)(t.code,{children:`on-surface`}),`.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-state-layers-on-surface-opacity-020`}),`: pressed or stronger interaction layer for elements whose foreground is `,(0,b.jsx)(t.code,{children:`on-surface`}),`.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-state-layers-on-secondary-container-opacity-008`}),`: hover layer for elements placed on `,(0,b.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-state-layers-on-secondary-container-opacity-012`}),`: focus layer for elements placed on `,(0,b.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.code,{children:`--m3-state-layers-on-secondary-container-opacity-020`}),`: pressed or stronger interaction layer for elements placed on `,(0,b.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`]}),`
`,(0,b.jsx)(t.p,{children:`State-layer tokens should be generated from the local foreground color, not copied from the global theme.`}),`
`,(0,b.jsx)(t.h2,{id:`story-guide`,children:`Story Guide`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/guides-theming--danger-notification`,children:`Danger Notification`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/guides-theming--warm-alert-notification`,children:`Warm Alert Notification`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/guides-theming--success-notification`,children:`Success Notification`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/guides-theming--brand-muted-notification`,children:`Brand Muted Notification`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/guides-theming--list-with-danger-menu`,children:`List With Danger Menu`})}),`
`]}),`
`,(0,b.jsx)(t.h2,{id:`do--dont`,children:`Do / don't`}),`
`,(0,b.jsx)(t.h3,{id:`do`,children:`Do`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:`keep local scopes small and attached to a meaningful product module`}),`
`,(0,b.jsx)(t.li,{children:`define local values for light and dark themes together`}),`
`,(0,b.jsx)(t.li,{children:`draw state-layer tokens from the local foreground colors`}),`
`,(0,b.jsx)(t.li,{children:`test default, hovered, focused, selected, and disabled states inside the scope`}),`
`]}),`
`,(0,b.jsx)(t.h3,{id:`dont`,children:`Don’t`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:`override component classes directly when a sys-token can express the change`}),`
`,(0,b.jsx)(t.li,{children:`use local theming to create unrelated visual systems inside one page`}),`
`,(0,b.jsx)(t.li,{children:`change only accent tokens while leaving surface and state-layer tokens global`}),`
`,(0,b.jsx)(t.li,{children:`nest reset scopes unless the inner control has a clear reason to return to baseline`}),`
`]})]})}function y(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=o(),a(),t(),s(),l(),g()})))()}x();export{y as default};