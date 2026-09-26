import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{i as s,n as c,r as l,t as u}from"./M3Checkbox.stories-BlzKaNBY.js";function d(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...t(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i,{of:u}),`
`,(0,p.jsx)(n.h1,{id:`checkboxes`,children:`Checkboxes`}),`
`,(0,p.jsx)(n.p,{children:`Checkboxes let users select one or more options independently. They also support parent-child selection patterns where a parent reflects the aggregate state of subordinate items.`}),`
`,(0,p.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(n.p,{children:[`Use `,(0,p.jsx)(n.code,{children:`M3Checkbox`}),` when multiple items can be selected at the same time, or when a single option behaves like a boolean choice inside a form. If the user must pick exactly one option, prefer radios instead.`]}),`
`,(0,p.jsx)(n.h3,{id:`selection-model`,children:`Selection model`}),`
`,(0,p.jsxs)(n.p,{children:[`This implementation supports both simple boolean selection and array-backed multi-select models. It also supports `,(0,p.jsx)(n.code,{children:`indeterminate`}),` for aggregate parent rows, which matches the Material 3 guidance for nested selection patterns.`]}),`
`,(0,p.jsx)(n.h3,{id:`nested-selection`,children:`Nested selection`}),`
`,(0,p.jsx)(n.p,{children:`In nested lists, the parent checkbox should summarize descendant state:`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:`checked when all descendants are selected`}),`
`,(0,p.jsx)(n.li,{children:`indeterminate when some descendants are selected`}),`
`,(0,p.jsx)(n.li,{children:`unchecked when none are selected`}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:`Every checkbox needs a visible text label.`}),`
`,(0,p.jsxs)(n.li,{children:[`Group related checkboxes under a shared group label (`,(0,p.jsx)(n.code,{children:`fieldset/legend`}),` or `,(0,p.jsx)(n.code,{children:`aria-labelledby`}),`).`]}),`
`,(0,p.jsx)(n.li,{children:`Use indeterminate state only for partial parent-selection states.`}),`
`]}),`
`,(0,p.jsx)(n.h3,{id:`regular-list`,children:`Regular list`}),`
`,(0,p.jsx)(a,{className:`m3-panel m3-panel_elevated-1`,children:(0,p.jsx)(l,{options:[{label:`Apples`,value:`apples`},{label:`Bananas`,value:`bananas`},{label:`Oranges`,value:`oranges`}]})}),`
`,(0,p.jsx)(n.h3,{id:`nested-list`,children:`Nested list`}),`
`,(0,p.jsx)(a,{className:`m3-panel m3-panel_elevated-1`,children:(0,p.jsx)(l,{options:[{label:`Remind`,value:`remind`,subordinates:[{label:`Daily`,value:`daily`},{label:`Weekly`,value:`weekly`},{label:`Monthly`,value:`monthly`}]}]})}),`
`,(0,p.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3checkbox--standard`,children:`Standard`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3checkbox--nested-selection`,children:`Nested Selection`})}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,p.jsx)(n.h3,{id:`keep-labels-explicit`,children:`Keep labels explicit`}),`
`,(0,p.jsx)(n.p,{children:`Checkbox labels should describe the resulting state, not the control itself. "Email receipts" is clearer than "Enable."`}),`
`,(0,p.jsx)(n.h3,{id:`use-indeterminate-only-as-summary-state`,children:`Use indeterminate only as summary state`}),`
`,(0,p.jsxs)(n.p,{children:[`Do not present `,(0,p.jsx)(n.code,{children:`indeterminate`}),` as a user-selectable third state. It should only communicate partial selection across descendants.`]}),`
`,(0,p.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/checkbox/overview`,rel:`nofollow`,children:`M3 Checkbox overview`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/checkbox/guidelines`,rel:`nofollow`,children:`M3 Checkbox guidelines`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`,rel:`nofollow`,children:`WAI-ARIA APG: Checkbox Pattern`})}),`
`]})]})}function f(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,p.jsx)(n,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=o(),n(),r(),s(),c()})))()}m();export{f as default};