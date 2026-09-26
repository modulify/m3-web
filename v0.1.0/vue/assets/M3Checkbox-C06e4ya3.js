import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,o as n}from"./blocks-Coxbmtpx.js";import{i as r,r as i}from"./react-BXJ34t_g.js";import{a}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as o,t as s}from"./Inline-Ch5hsbpx.js";import{i as c,n as l,r as u,t as d}from"./M3Checkbox.stories-Q5bZ80sE.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...r(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`checkboxes`,children:`Checkboxes`}),`
`,(0,m.jsx)(t.p,{children:`Checkboxes let users select one or more options independently. They also support parent-child selection patterns where a parent reflects the aggregate state of subordinate items.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`M3Checkbox`}),` when multiple items can be selected at the same time, or when a single option behaves like a boolean choice inside a form. If the user must pick exactly one option, prefer radios instead.`]}),`
`,(0,m.jsx)(t.h3,{id:`selection-model`,children:`Selection model`}),`
`,(0,m.jsxs)(t.p,{children:[`This implementation supports both simple boolean selection and array-backed multi-select models. It also supports `,(0,m.jsx)(t.code,{children:`indeterminate`}),` for aggregate parent rows, which matches the Material 3 guidance for nested selection patterns.`]}),`
`,(0,m.jsx)(t.h3,{id:`nested-selection`,children:`Nested selection`}),`
`,(0,m.jsx)(t.p,{children:`In nested lists, the parent checkbox should summarize descendant state:`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`checked when all descendants are selected`}),`
`,(0,m.jsx)(t.li,{children:`indeterminate when some descendants are selected`}),`
`,(0,m.jsx)(t.li,{children:`unchecked when none are selected`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`Every checkbox needs a visible text label.`}),`
`,(0,m.jsxs)(t.li,{children:[`Group related checkboxes under a shared group label (`,(0,m.jsx)(t.code,{children:`fieldset/legend`}),` or `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),`).`]}),`
`,(0,m.jsx)(t.li,{children:`Use indeterminate state only for partial parent-selection states.`}),`
`]}),`
`,(0,m.jsx)(t.h3,{id:`regular-list`,children:`Regular list`}),`
`,(0,m.jsx)(s,{is:u,options:[{label:`Apples`,value:`apples`},{label:`Bananas`,value:`bananas`},{label:`Oranges`,value:`oranges`}]}),`
`,(0,m.jsx)(t.h3,{id:`nested-list`,children:`Nested list`}),`
`,(0,m.jsx)(s,{is:u,options:[{label:`Remind`,value:`remind`,subordinates:[{label:`Daily`,value:`daily`},{label:`Weekly`,value:`weekly`},{label:`Monthly`,value:`monthly`}]}]}),`
`,(0,m.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3checkbox--standard`,children:`Standard`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3checkbox--nested-selection`,children:`Nested Selection`})}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,m.jsx)(t.h3,{id:`keep-labels-explicit`,children:`Keep labels explicit`}),`
`,(0,m.jsx)(t.p,{children:`Checkbox labels should describe the resulting state, not the control itself. "Email receipts" is clearer than "Enable."`}),`
`,(0,m.jsx)(t.h3,{id:`use-indeterminate-only-as-summary-state`,children:`Use indeterminate only as summary state`}),`
`,(0,m.jsxs)(t.p,{children:[`Do not present `,(0,m.jsx)(t.code,{children:`indeterminate`}),` as a user-selectable third state. It should only communicate partial selection across descendants.`]}),`
`,(0,m.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/checkbox/overview`,rel:`nofollow`,children:`M3 Checkbox overview`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/checkbox/guidelines`,rel:`nofollow`,children:`M3 Checkbox guidelines`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`,rel:`nofollow`,children:`WAI-ARIA APG: Checkbox Pattern`})}),`
`]})]})}function p(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=a(),i(),t(),o(),c(),l()})))()}h();export{p as default};