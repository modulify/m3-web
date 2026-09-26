import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,n,o as r}from"./blocks-Coxbmtpx.js";import{i,r as a}from"./react-BXJ34t_g.js";import{a as o}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{a as s,i as c,n as l,r as u,t as d}from"./M3Select.stories-DCoVeuUu.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...i(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(r,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`select`,children:`Select`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`M3Select`}),` combines text-field presentation with a menu-backed option picker. It fits cases where the current value should stay visible in the form while the available choices open in an anchored list.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`M3Select`}),` when users must choose one option from a structured list and the current choice should remain visible as field content. If freeform input is allowed, use a text field or autocomplete pattern instead.`]}),`
`,(0,m.jsx)(t.h3,{id:`composition`,children:`Composition`}),`
`,(0,m.jsx)(t.p,{children:`This implementation follows a hybrid pattern:`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`field-like trigger for label, outline, support text, and current value`}),`
`,(0,m.jsx)(t.li,{children:`listbox-style option popup for selection`}),`
`,(0,m.jsx)(t.li,{children:`optional leading content for selected value and option rows`}),`
`]}),`
`,(0,m.jsx)(t.h3,{id:`leading-visuals`,children:`Leading visuals`}),`
`,(0,m.jsxs)(t.p,{children:[`The `,(0,m.jsx)(t.code,{children:`WithIcons`}),` story demonstrates a useful Material 3 pattern for country, account, or category pickers where a compact visual cue speeds up recognition without replacing the text label.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`M3Select`}),` exposes combobox semantics with a listbox popup and option items.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Provide a visible label through `,(0,m.jsx)(t.code,{children:`label`}),` or an explicit aria-label/aria-labelledby strategy.`]}),`
`,(0,m.jsx)(t.li,{children:`Keep option labels unique and meaningful for screen readers.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3select--standard`,children:`Standard`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3select--with-icons`,children:`With Icons`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3select--outlined`,children:`Outlined`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3select--invalid`,children:`Invalid`})}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`demo`,children:`Demo`}),`
`,(0,m.jsx)(n,{of:u}),`
`,(0,m.jsx)(n,{of:c}),`
`,(0,m.jsx)(n,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,m.jsx)(t.h3,{id:`prefer-stable-option-labels`,children:`Prefer stable option labels`}),`
`,(0,m.jsx)(t.p,{children:`Because the chosen option is mirrored back into the field, label wording should stay concise and unambiguous. Long, repetitive labels make the closed state harder to scan.`}),`
`,(0,m.jsx)(t.h3,{id:`keep-menus-manageable`,children:`Keep menus manageable`}),`
`,(0,m.jsx)(t.p,{children:`If the option set becomes very large, consider search or autocomplete instead of a pure select interaction.`}),`
`,(0,m.jsx)(t.h2,{id:`code-example`,children:`Code example`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<M3Select
  v-model:value="value"
  label="Choose"
  :options="[
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ]"
/>
`})}),`
`,(0,m.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/text-fields/overview`,rel:`nofollow`,children:`M3 Text fields overview`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/menus/overview`,rel:`nofollow`,children:`M3 Menus overview`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/menus/guidelines`,rel:`nofollow`,children:`M3 Menus guidelines`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/combobox/`,rel:`nofollow`,children:`WAI-ARIA APG: Combobox Pattern`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/listbox/`,rel:`nofollow`,children:`WAI-ARIA APG: Listbox Pattern`})}),`
`]})]})}function p(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=o(),a(),t(),s()})))()}h();export{p as default};