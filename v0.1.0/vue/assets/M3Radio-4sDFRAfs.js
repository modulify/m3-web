import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,o as n}from"./blocks-Coxbmtpx.js";import{i as r,r as i}from"./react-BXJ34t_g.js";import{a}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as o,t as s}from"./Inline-Ch5hsbpx.js";import{i as c,n as l,r as u,t as d}from"./M3Radio.stories-RS0HVz43.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...r(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`radio-buttons`,children:`Radio buttons`}),`
`,(0,m.jsx)(t.p,{children:`Radio buttons let users choose exactly one option from a related set. Unlike checkboxes, they are not meant for independent multi-selection or parent-child aggregate states.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`M3Radio`}),` when the user must choose one option from a small, visible list. If multiple options can be selected together, prefer `,(0,m.jsx)(t.code,{children:`M3Checkbox`}),`.`]}),`
`,(0,m.jsx)(t.h3,{id:`selection-model`,children:`Selection model`}),`
`,(0,m.jsxs)(t.p,{children:[`This implementation treats each radio as a single-value option. A radio is checked when `,(0,m.jsx)(t.code,{children:`model`}),` equals `,(0,m.jsx)(t.code,{children:`value`}),`, and selecting it emits that `,(0,m.jsx)(t.code,{children:`value`}),`.`]}),`
`,(0,m.jsx)(t.h3,{id:`grouping`,children:`Grouping`}),`
`,(0,m.jsxs)(t.p,{children:[`For native keyboard and form semantics, related radios should share the same `,(0,m.jsx)(t.code,{children:`name`}),`. Wrap related options in a `,(0,m.jsx)(t.code,{children:`fieldset`}),` with a visible `,(0,m.jsx)(t.code,{children:`legend`}),` whenever possible.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`Every radio needs a visible text label.`}),`
`,(0,m.jsx)(t.li,{children:`Related radios should be grouped under a shared label.`}),`
`,(0,m.jsxs)(t.li,{children:[`Use `,(0,m.jsx)(t.code,{children:`name`}),` consistently across one group so browser navigation behaves predictably.`]}),`
`,(0,m.jsx)(t.li,{children:`Mark the group or options invalid only when the selection is required and unresolved.`}),`
`]}),`
`,(0,m.jsx)(t.h3,{id:`preference-group`,children:`Preference group`}),`
`,(0,m.jsx)(`div`,{className:`m3-panel m3-panel_elevated-1`,children:(0,m.jsx)(s,{is:u,legend:`Theme preference`,options:[{label:`System`,value:`system`},{label:`Light`,value:`light`},{label:`Dark`,value:`dark`}]})}),`
`,(0,m.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3radio--standard`,children:`Standard`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3radio--preference-group`,children:`Preference Group`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3radio--invalid-group`,children:`Invalid Group`})}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,m.jsx)(t.h3,{id:`keep-option-sets-short-and-explicit`,children:`Keep option sets short and explicit`}),`
`,(0,m.jsx)(t.p,{children:`Radio groups work best when all options are visible at once and labels are mutually exclusive.`}),`
`,(0,m.jsx)(t.h3,{id:`do-not-use-radios-for-toggles`,children:`Do not use radios for toggles`}),`
`,(0,m.jsx)(t.p,{children:`If the choice is simply on/off, prefer a switch or checkbox. Radios communicate one-of-many selection.`}),`
`,(0,m.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/radio-button/overview`,rel:`nofollow`,children:`M3 Radio button overview`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/radio/`,rel:`nofollow`,children:`WAI-ARIA APG: Radio Group Pattern`})}),`
`]})]})}function p(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=a(),i(),t(),o(),c(),l()})))()}h();export{p as default};