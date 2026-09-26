import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,n as i,o as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{a as s,i as c,n as l,r as u,t as d}from"./M3Select.stories-CP3QlVTi.js";function f(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{of:d}),`
`,(0,m.jsx)(n.h1,{id:`select`,children:`Select`}),`
`,(0,m.jsxs)(n.p,{children:[(0,m.jsx)(n.code,{children:`M3Select`}),` combines text-field presentation with a menu-backed option picker. It fits cases where the current value should stay visible in the form while the available choices open in an anchored list.`]}),`
`,(0,m.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(n.p,{children:[`Use `,(0,m.jsx)(n.code,{children:`M3Select`}),` when users must choose one option from a structured list and the current choice should remain visible as field content. If freeform input is allowed, use a text field or autocomplete pattern instead.`]}),`
`,(0,m.jsx)(n.h3,{id:`composition`,children:`Composition`}),`
`,(0,m.jsx)(n.p,{children:`This implementation follows a hybrid pattern:`}),`
`,(0,m.jsxs)(n.ul,{children:[`
`,(0,m.jsx)(n.li,{children:`field-like trigger for label, outline, support text, and current value`}),`
`,(0,m.jsx)(n.li,{children:`listbox-style option popup for selection`}),`
`,(0,m.jsx)(n.li,{children:`optional leading content for selected value and option rows`}),`
`]}),`
`,(0,m.jsx)(n.h3,{id:`leading-visuals`,children:`Leading visuals`}),`
`,(0,m.jsxs)(n.p,{children:[`The `,(0,m.jsx)(n.code,{children:`WithIcons`}),` story demonstrates a useful Material 3 pattern for country, account, or category pickers where a compact visual cue speeds up recognition without replacing the text label.`]}),`
`,(0,m.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,m.jsxs)(n.ul,{children:[`
`,(0,m.jsxs)(n.li,{children:[(0,m.jsx)(n.code,{children:`M3Select`}),` exposes combobox semantics with a listbox popup and option items.`]}),`
`,(0,m.jsxs)(n.li,{children:[`Provide a visible label through `,(0,m.jsx)(n.code,{children:`label`}),` or an explicit aria-label/aria-labelledby strategy.`]}),`
`,(0,m.jsx)(n.li,{children:`Keep option labels unique and meaningful for screen readers.`}),`
`]}),`
`,(0,m.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,m.jsxs)(n.ul,{children:[`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`?path=/story/components-m3select--standard`,children:`Standard`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`?path=/story/components-m3select--with-icons`,children:`With Icons`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`?path=/story/components-m3select--outlined`,children:`Outlined`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`?path=/story/components-m3select--invalid`,children:`Invalid`})}),`
`]}),`
`,(0,m.jsx)(n.h2,{id:`demo`,children:`Demo`}),`
`,(0,m.jsx)(i,{of:u}),`
`,(0,m.jsx)(i,{of:c}),`
`,(0,m.jsx)(i,{of:l}),`
`,(0,m.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,m.jsx)(n.h3,{id:`prefer-stable-option-labels`,children:`Prefer stable option labels`}),`
`,(0,m.jsx)(n.p,{children:`Because the chosen option is mirrored back into the field, label wording should stay concise and unambiguous. Long, repetitive labels make the closed state harder to scan.`}),`
`,(0,m.jsx)(n.h3,{id:`keep-menus-manageable`,children:`Keep menus manageable`}),`
`,(0,m.jsx)(n.p,{children:`If the option set becomes very large, consider search or autocomplete instead of a pure select interaction.`}),`
`,(0,m.jsx)(n.h2,{id:`code-example`,children:`Code example`}),`
`,(0,m.jsx)(n.pre,{children:(0,m.jsx)(n.code,{className:`language-tsx`,children:`<M3Select<number>
  value={value}
  label="Choose"
  options={[
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ]}
  onUpdate={setValue}
/>
`})}),`
`,(0,m.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,m.jsxs)(n.ul,{children:[`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`https://m3.material.io/components/text-fields/overview`,rel:`nofollow`,children:`M3 Text fields overview`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`https://m3.material.io/components/menus/overview`,rel:`nofollow`,children:`M3 Menus overview`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`https://m3.material.io/components/menus/guidelines`,rel:`nofollow`,children:`M3 Menus guidelines`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/combobox/`,rel:`nofollow`,children:`WAI-ARIA APG: Combobox Pattern`})}),`
`,(0,m.jsx)(n.li,{children:(0,m.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/listbox/`,rel:`nofollow`,children:`WAI-ARIA APG: Listbox Pattern`})}),`
`]})]})}function p(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,m.jsx)(n,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=o(),n(),r(),s()})))()}h();export{p as default};