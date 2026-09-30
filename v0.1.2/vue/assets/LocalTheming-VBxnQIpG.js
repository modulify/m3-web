import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,n,o as r}from"./blocks-Coxbmtpx.js";import{i,r as a}from"./iframe-hIq0EEjR.js";import{i as o,r as s}from"./react-BXJ34t_g.js";import{a as c}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as l,t as u}from"./Inline-BHaEJZ_z.js";import{n as d,t as f}from"./ButtonExample-BChuzdNp.js";import{a as p,i as m,n as h,o as g,r as _,s as v,t as y}from"./LocalTheming.stories-TTwrFG_0.js";function b(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...o(),...e.components};return(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(r,{of:m}),`
`,(0,S.jsxs)(a,{locale:`en-US`,children:[(0,S.jsx)(t.h1,{id:`theming`,children:`Theming`}),(0,S.jsxs)(t.p,{children:[`Theming is a token contract, not a component override layer. A theme provides Material sys-tokens such as `,(0,S.jsx)(t.code,{children:`--m3-sys-primary`}),`, `,(0,S.jsx)(t.code,{children:`--m3-sys-surface`}),`, and `,(0,S.jsx)(t.code,{children:`--m3-sys-on-surface`}),`; components read those tokens and keep their API unchanged.`]}),(0,S.jsx)(t.p,{children:`This guide intentionally uses a custom azure-blue baseline theme in examples. It is not the standard Material default. The baseline is changed on purpose so local scope changes are easy to see against a recognizable non-purple primary color.`}),(0,S.jsx)(t.h2,{id:`theory`,children:`Theory`}),(0,S.jsx)(t.h3,{id:`theme-layers`,children:`Theme layers`}),(0,S.jsxs)(t.p,{children:[`The Storybook toolbar still switches the document between `,(0,S.jsx)(t.code,{children:`m3-theme-light`}),` and `,(0,S.jsx)(t.code,{children:`m3-theme-dark`}),`. The examples then add a guide-local baseline scope:`]}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-scss`,children:`.m3-local-theme_showcase {
  --m3-local-primary: #2d5fb8;
  --m3-local-primary-container: #dbe5ff;
  --m3-local-on-primary: #ffffff;
  --m3-local-surface: #f8f9ff;
  --m3-local-surface-container: #edf1fb;
  --m3-local-on-surface: #181c24;
}
`})}),(0,S.jsx)(t.p,{children:`That scope is deliberately local to this guide. A nested danger, warning, success, or brand scope can then override the same token set for a smaller module.`}),(0,S.jsx)(t.h3,{id:`local-scope-contract`,children:`Local scope contract`}),(0,S.jsxs)(t.p,{children:[`A local theme remaps selected `,(0,S.jsx)(t.code,{children:`--m3-sys-*`}),` tokens for descendants only. Components keep the same props; colors, surfaces, and state layers follow the nearest token scope.`]}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-scss`,children:`.m3-local-theme {
  --m3-sys-primary: var(--m3-local-primary);
  --m3-sys-primary-container: var(--m3-local-primary-container);
  --m3-sys-on-primary: var(--m3-local-on-primary);
  --m3-sys-on-primary-container: var(--m3-local-on-primary-container);
  --m3-sys-surface: var(--m3-local-surface);
  --m3-sys-surface-container: var(--m3-local-surface-container);
  --m3-sys-on-surface: var(--m3-local-on-surface);
  --m3-state-layers-on-surface-opacity-008: color-mix(in srgb, var(--m3-local-on-surface) 8%, transparent);
}
`})}),(0,S.jsx)(t.p,{children:`Use a modifier class to provide concrete values per global theme:`}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-scss`,children:`html.m3-theme-light .m3-local-theme_danger {
  --m3-local-primary: #b42346;
  --m3-local-primary-container: #ffd9e2;
  --m3-local-on-primary: #ffffff;
  --m3-local-surface: #fdf0f4;
  --m3-local-surface-container: #fce9ef;
  --m3-local-on-surface: #34111a;
}
`})}),(0,S.jsx)(t.h3,{id:`usage-model`,children:`Usage model`}),(0,S.jsx)(t.p,{children:`Wrap the smallest module that needs the alternate token set.`}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_danger">
  <div class="theme-sample__panel">
    <h3>Delete release</h3>
    <p>This action permanently removes the prepared release draft.</p>
    <M3Button appearance="filled">Delete release</M3Button>
  </div>
</section>
`})}),(0,S.jsx)(t.p,{children:`Reset a nested control only when it must return to the baseline scope inside a local module.`}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_danger">
  <M3Button appearance="filled">Delete release</M3Button>

  <span class="m3-local-theme m3-local-theme_reset">
    <M3Button appearance="text">Cancel</M3Button>
  </span>
</section>
`})}),(0,S.jsx)(t.h2,{id:`abstract-examples`,children:`Abstract Examples`}),(0,S.jsxs)(t.p,{children:[`These examples use simple layout geometry and `,(0,S.jsx)(t.code,{children:`M3Button`}),` actions so token relationships stay visible while the action control still follows the component contract.`]}),(0,S.jsx)(t.h3,{id:`accent-panel`,children:`Accent panel`}),(0,S.jsxs)(t.p,{children:[`Use the local `,(0,S.jsx)(t.code,{children:`primary`}),` pair for the action and local surface roles for the surrounding geometry.`]}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_danger theme-sample">
  <div class="theme-sample__panel">
    <span class="theme-sample__label">Danger scope</span>
    <h3>Delete release</h3>
    <p>Primary action tokens recolor the action while surface tokens keep the panel coherent.</p>
    <M3Button appearance="filled">Delete release</M3Button>
  </div>
</section>
`})}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-scss`,children:`.theme-sample {
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
`})}),(0,S.jsx)(t.p,{children:`Visual result:`}),(0,S.jsx)(`div`,{className:`m3-local-theme m3-local-theme_danger`,style:{padding:`24px`,borderRadius:`16px`,background:`var(--m3-sys-surface)`,color:`var(--m3-sys-on-surface)`},children:(0,S.jsxs)(`div`,{style:{padding:`20px`,border:`1px solid var(--m3-sys-outline-variant)`,borderRadius:`16px`,background:`var(--m3-sys-surface-container-high)`},children:[(0,S.jsx)(`span`,{style:{color:`var(--m3-sys-on-surface-variant)`,fontSize:`12px`},children:(0,S.jsx)(t.p,{children:`Danger scope`})}),(0,S.jsx)(`h3`,{style:{margin:`8px 0`,color:`var(--m3-sys-on-surface)`},children:`Delete release`}),(0,S.jsx)(`p`,{style:{margin:`0 0 16px`,color:`var(--m3-sys-on-surface-variant)`},children:(0,S.jsx)(t.p,{children:`Primary action tokens recolor the action while surface tokens keep the panel coherent.`})}),(0,S.jsx)(u,{tag:`span`,is:f,label:`Delete release`,appearance:`filled`})]})}),(0,S.jsx)(t.h3,{id:`surface-ladder`,children:`Surface ladder`}),(0,S.jsx)(t.p,{children:`Use container tokens to show hierarchy inside one local scope. The ladder should read as related container tones, not unrelated brand colors.`}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-html`,children:`<section class="m3-local-theme m3-local-theme_warm-alert theme-sample">
  <div class="theme-sample__tone theme-sample__tone_low">Low container</div>
  <div class="theme-sample__tone theme-sample__tone_default">Default container</div>
  <div class="theme-sample__tone theme-sample__tone_high">High container</div>
  <div class="theme-sample__tone theme-sample__tone_highest">Highest container</div>
</section>
`})}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-scss`,children:`.theme-sample__tone {
  padding: 16px;
  border-radius: 12px;
  color: var(--m3-sys-on-surface);
}

.theme-sample__tone_low { background: var(--m3-sys-surface-container-low); }
.theme-sample__tone_default { background: var(--m3-sys-surface-container); }
.theme-sample__tone_high { background: var(--m3-sys-surface-container-high); }
.theme-sample__tone_highest { background: var(--m3-sys-surface-container-highest); }
`})}),(0,S.jsx)(t.p,{children:`Visual result:`}),(0,S.jsxs)(`div`,{className:`m3-local-theme m3-local-theme_warm-alert`,style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(140px, 1fr))`,gap:`12px`,padding:`24px`,borderRadius:`16px`,background:`var(--m3-sys-surface)`,color:`var(--m3-sys-on-surface)`},children:[(0,S.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-low)`},children:(0,S.jsx)(t.p,{children:`Low container`})}),(0,S.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container)`},children:(0,S.jsx)(t.p,{children:`Default container`})}),(0,S.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-high)`},children:(0,S.jsx)(t.p,{children:`High container`})}),(0,S.jsx)(`div`,{style:{padding:`16px`,borderRadius:`12px`,background:`var(--m3-sys-surface-container-highest)`},children:(0,S.jsx)(t.p,{children:`Highest container`})})]}),(0,S.jsx)(t.h2,{id:`cookbook`,children:`Cookbook`}),(0,S.jsx)(t.h3,{id:`notification-scopes`,children:`Notification scopes`}),(0,S.jsx)(t.p,{children:`Each notification draws a small token palette above the component. The left notification stays on the azure-blue guide theme; the right notification adds a local scope.`}),(0,S.jsx)(n,{of:h}),(0,S.jsx)(n,{of:g}),(0,S.jsx)(n,{of:p}),(0,S.jsx)(n,{of:y}),(0,S.jsx)(t.h3,{id:`list-menu-with-a-destructive-action`,children:`List menu with a destructive action`}),(0,S.jsxs)(t.p,{children:[`The list follows the azure-blue baseline. The release checklist item owns an icon action with a popper menu. Only the destructive menu item is wrapped in the danger scope, so `,(0,S.jsx)(t.code,{children:`Delete list`}),` uses danger `,(0,S.jsx)(t.code,{children:`primary`}),`, `,(0,S.jsx)(t.code,{children:`on-surface`}),`, and state-layer tokens while the rest of the menu remains in the main theme.`]}),(0,S.jsx)(n,{of:_}),(0,S.jsx)(t.h2,{id:`token-reference`,children:`Token Reference`}),(0,S.jsx)(t.h3,{id:`primary-action-tokens`,children:`Primary action tokens`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-primary`}),`: main accent color for filled primary controls, active marks, selected indicators, and high-emphasis affordances inside the local scope.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-on-primary`}),`: text and icon color placed on `,(0,S.jsx)(t.code,{children:`primary`}),`; it must preserve contrast for filled controls.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-primary-container`}),`: softer accent container for badges, labels, selected surfaces, and low-emphasis accent backgrounds.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-on-primary-container`}),`: text and icon color placed on `,(0,S.jsx)(t.code,{children:`primary-container`}),`.`]}),`
`]}),(0,S.jsx)(t.h3,{id:`secondary-container-tokens`,children:`Secondary container tokens`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-secondary-container`}),`: tonal button and selected container background when the component uses secondary emphasis rather than the primary filled color.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-on-secondary-container`}),`: text, icon, and state-layer source color placed on `,(0,S.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`]}),(0,S.jsx)(t.h3,{id:`surface-tokens`,children:`Surface tokens`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-surface`}),`: default background color for the local scope. Use it for the page or module base where content is not inside a distinct container.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-surface-container-low`}),`: low-emphasis container color. Use it for subtle panels or container areas that should separate from `,(0,S.jsx)(t.code,{children:`surface`}),` without becoming prominent.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-surface-container`}),`: default container color. Use it for menus, tooltips, lists, and neutral component containers that need a clear contained surface.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-surface-container-high`}),`: high-emphasis container color. Use it for dialogs, prominent panels, and surfaces that need stronger separation in the local scope.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-surface-container-highest`}),`: highest-emphasis container color. Use it for the strongest neutral container or nested surfaces that must stand apart.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-surface-variant`}),`: alternate neutral-variant surface for components that intentionally use the neutral-variant family.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-inverse-surface`}),`: opposite-luminance surface for temporary high-contrast elements such as plain tooltips.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-inverse-on-surface`}),`: text and icon color placed on `,(0,S.jsx)(t.code,{children:`inverse-surface`}),`.`]}),`
`]}),(0,S.jsxs)(t.p,{children:[`The `,(0,S.jsx)(t.code,{children:`surface-container-*`}),` tokens form a tonal ladder. Choose them by container emphasis and visual hierarchy, not by hard-coded shadows.`]}),(0,S.jsx)(t.h3,{id:`text-and-boundary-tokens`,children:`Text and boundary tokens`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-on-surface`}),`: primary text and icon color on local surfaces.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-on-surface-variant`}),`: secondary text, supporting text, subdued icons, labels, and metadata.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-outline`}),`: stronger boundary color for visible borders and focus-adjacent structure.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-sys-outline-variant`}),`: quieter divider and low-emphasis border color.`]}),`
`]}),(0,S.jsx)(t.h3,{id:`state-layer-tokens`,children:`State-layer tokens`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-state-layers-on-surface-opacity-008`}),`: hover layer for elements whose foreground is `,(0,S.jsx)(t.code,{children:`on-surface`}),`.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-state-layers-on-surface-opacity-012`}),`: focus layer for elements whose foreground is `,(0,S.jsx)(t.code,{children:`on-surface`}),`.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-state-layers-on-surface-opacity-020`}),`: pressed or stronger interaction layer for elements whose foreground is `,(0,S.jsx)(t.code,{children:`on-surface`}),`.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-state-layers-on-secondary-container-opacity-008`}),`: hover layer for elements placed on `,(0,S.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-state-layers-on-secondary-container-opacity-012`}),`: focus layer for elements placed on `,(0,S.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`,(0,S.jsxs)(t.li,{children:[(0,S.jsx)(t.code,{children:`--m3-state-layers-on-secondary-container-opacity-020`}),`: pressed or stronger interaction layer for elements placed on `,(0,S.jsx)(t.code,{children:`secondary-container`}),`.`]}),`
`]}),(0,S.jsx)(t.p,{children:`State-layer tokens should be generated from the local foreground color, not copied from the global theme.`}),(0,S.jsx)(t.h2,{id:`story-guide`,children:`Story Guide`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--danger-notification`,children:`Danger Notification`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--warm-alert-notification`,children:`Warm Alert Notification`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--success-notification`,children:`Success Notification`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--brand-muted-notification`,children:`Brand Muted Notification`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--list-with-danger-menu`,children:`List With Danger Menu`})}),`
`]}),(0,S.jsx)(t.h2,{id:`do--dont`,children:`Do / don't`}),(0,S.jsx)(t.h3,{id:`do`,children:`Do`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:`keep local scopes small and attached to a meaningful product module`}),`
`,(0,S.jsx)(t.li,{children:`define local values for light and dark themes together`}),`
`,(0,S.jsx)(t.li,{children:`draw state-layer tokens from the local foreground colors`}),`
`,(0,S.jsx)(t.li,{children:`test default, hovered, focused, selected, and disabled states inside the scope`}),`
`]}),(0,S.jsx)(t.h3,{id:`dont`,children:`Don’t`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:`override component classes directly when a sys-token can express the change`}),`
`,(0,S.jsx)(t.li,{children:`use local theming to create unrelated visual systems inside one page`}),`
`,(0,S.jsx)(t.li,{children:`change only accent tokens while leaving surface and state-layer tokens global`}),`
`,(0,S.jsx)(t.li,{children:`nest reset scopes unless the inner control has a clear reason to return to baseline`}),`
`]})]}),`
`,(0,S.jsxs)(a,{locale:`ru-RU`,children:[(0,S.jsx)(t.h1,{id:`настройка-темы`,children:`Настройка темы`}),(0,S.jsxs)(t.p,{children:[`Тема — это контракт токенов, а не слой переопределения компонентов. Она задаёт системные токены Material, например `,(0,S.jsx)(t.code,{children:`--m3-sys-primary`}),`, `,(0,S.jsx)(t.code,{children:`--m3-sys-surface`}),` и `,(0,S.jsx)(t.code,{children:`--m3-sys-on-surface`}),`; компоненты читают их без изменения API.`]}),(0,S.jsx)(t.p,{children:`Примеры используют намеренно изменённую базовую лазурно-синюю тему, чтобы локальные области хорошо отличались от общего оформления.`}),(0,S.jsx)(t.h2,{id:`основные-принципы`,children:`Основные принципы`}),(0,S.jsx)(t.h3,{id:`слои-темы`,children:`Слои темы`}),(0,S.jsxs)(t.p,{children:[`Toolbar Storybook переключает документ между `,(0,S.jsx)(t.code,{children:`m3-theme-light`}),` и `,(0,S.jsx)(t.code,{children:`m3-theme-dark`}),`. Пример добавляет локальную базовую область, а вложенные danger, warning, success и brand-области переопределяют тот же набор токенов только для своего модуля.`]}),(0,S.jsx)(t.h3,{id:`локальная-область-темы`,children:`Локальная область темы`}),(0,S.jsxs)(t.p,{children:[`Локальная тема переназначает выбранные `,(0,S.jsx)(t.code,{children:`--m3-sys-*`}),` токены только для потомков. Props компонентов остаются прежними, а цвета, поверхности и state layers следуют ближайшей области токенов.`]}),(0,S.jsx)(t.pre,{children:(0,S.jsx)(t.code,{className:`language-scss`,children:`.m3-local-theme {
  --m3-sys-primary: var(--m3-local-primary);
  --m3-sys-primary-container: var(--m3-local-primary-container);
  --m3-sys-on-primary: var(--m3-local-on-primary);
  --m3-sys-surface: var(--m3-local-surface);
  --m3-sys-on-surface: var(--m3-local-on-surface);
}
`})}),(0,S.jsx)(t.p,{children:`Оберните наименьший модуль, которому действительно нужен другой набор токенов. Reset-область добавляйте только элементу, который должен вернуться к базовой теме.`}),(0,S.jsx)(t.h2,{id:`базовые-примеры`,children:`Базовые примеры`}),(0,S.jsx)(t.h3,{id:`панель-с-акцентом`,children:`Панель с акцентом`}),(0,S.jsxs)(t.p,{children:[`Используйте локальную пару `,(0,S.jsx)(t.code,{children:`primary`}),` для действия и локальные роли surface для окружающей геометрии.`]}),(0,S.jsx)(t.h3,{id:`иерархия-поверхностей`,children:`Иерархия поверхностей`}),(0,S.jsx)(t.p,{children:`Контейнерные токены должны показывать иерархию связанных тонов, а не набор несвязанных брендовых цветов.`}),(0,S.jsx)(t.h2,{id:`готовые-сценарии`,children:`Готовые сценарии`}),(0,S.jsx)(t.p,{children:`Каждое уведомление показывает небольшую палитру над компонентом: левое остаётся на базовой теме руководства, правое получает локальную область.`}),(0,S.jsx)(n,{of:h}),(0,S.jsx)(n,{of:g}),(0,S.jsx)(n,{of:p}),(0,S.jsx)(n,{of:y}),(0,S.jsx)(n,{of:_}),(0,S.jsx)(t.h2,{id:`примеры-в-storybook`,children:`Примеры в Storybook`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--danger-notification`,children:`Опасное уведомление`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--warm-alert-notification`,children:`Тёплое предупреждение`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--success-notification`,children:`Успешное уведомление`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--brand-muted-notification`,children:`Приглушённый бренд`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/guides-theming--list-with-danger-menu`,children:`Список с опасным действием`})}),`
`]}),(0,S.jsx)(t.h2,{id:`что-делать-и-чего-избегать`,children:`Что делать и чего избегать`}),(0,S.jsx)(t.h3,{id:`можно`,children:`Можно`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:`сохранять области небольшими и связанными с продуктовым модулем`}),`
`,(0,S.jsx)(t.li,{children:`одновременно определять значения для светлой и тёмной темы`}),`
`,(0,S.jsx)(t.li,{children:`строить state-layer токены из локального цвета переднего плана`}),`
`,(0,S.jsx)(t.li,{children:`проверять обычное, hover, focus, selected и disabled состояния`}),`
`]}),(0,S.jsx)(t.h3,{id:`нельзя`,children:`Нельзя`}),(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:`переопределять классы компонентов, когда изменение выражается sys-токеном`}),`
`,(0,S.jsx)(t.li,{children:`создавать одной страницей несколько несвязанных визуальных систем`}),`
`,(0,S.jsx)(t.li,{children:`менять только акцент, оставляя поверхности и state layers глобальными`}),`
`,(0,S.jsx)(t.li,{children:`вкладывать reset-области без явной причины`}),`
`]})]})]})}function x(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,S.jsx)(t,{...e,children:(0,S.jsx)(b,{...e})}):b(e)}var S;function C(){return(C=e((()=>{S=c(),s(),t(),l(),d(),i(),v()})))()}C();export{x as default};