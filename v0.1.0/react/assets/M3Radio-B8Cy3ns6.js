import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{i as s,n as c,r as l,t as u}from"./M3Radio.stories-DojmUuQG.js";function d(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...t(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i,{of:u}),`
`,(0,p.jsx)(n.h1,{id:`radio-buttons`,children:`Radio buttons`}),`
`,(0,p.jsx)(n.p,{children:`Radio buttons let users choose exactly one option from a related set. Unlike checkboxes, they are not meant for independent multi-selection or parent-child aggregate states.`}),`
`,(0,p.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(n.p,{children:[`Use `,(0,p.jsx)(n.code,{children:`M3Radio`}),` when the user must choose one option from a small, visible list. If multiple options can be selected together, prefer `,(0,p.jsx)(n.code,{children:`M3Checkbox`}),`.`]}),`
`,(0,p.jsx)(n.h3,{id:`selection-model`,children:`Selection model`}),`
`,(0,p.jsxs)(n.p,{children:[`This implementation treats each radio as a single-value option. A radio is checked when `,(0,p.jsx)(n.code,{children:`model`}),` equals `,(0,p.jsx)(n.code,{children:`value`}),`, and selecting it emits that `,(0,p.jsx)(n.code,{children:`value`}),`.`]}),`
`,(0,p.jsx)(n.h3,{id:`grouping`,children:`Grouping`}),`
`,(0,p.jsxs)(n.p,{children:[`For native keyboard and form semantics, related radios should share the same `,(0,p.jsx)(n.code,{children:`name`}),`. Wrap related options in a `,(0,p.jsx)(n.code,{children:`fieldset`}),` with a visible `,(0,p.jsx)(n.code,{children:`legend`}),` whenever possible.`]}),`
`,(0,p.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:`Every radio needs a visible text label.`}),`
`,(0,p.jsx)(n.li,{children:`Related radios should be grouped under a shared label.`}),`
`,(0,p.jsxs)(n.li,{children:[`Use `,(0,p.jsx)(n.code,{children:`name`}),` consistently across one group so browser navigation behaves predictably.`]}),`
`,(0,p.jsx)(n.li,{children:`Mark the group or options invalid only when the selection is required and unresolved.`}),`
`]}),`
`,(0,p.jsx)(n.h3,{id:`preference-group`,children:`Preference group`}),`
`,(0,p.jsx)(a,{className:`m3-panel m3-panel_elevated-1`,children:(0,p.jsx)(l,{legend:`Theme preference`,options:[{label:`System`,value:`system`},{label:`Light`,value:`light`},{label:`Dark`,value:`dark`}]})}),`
`,(0,p.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3radio--standard`,children:`Standard`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3radio--preference-group`,children:`Preference Group`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3radio--invalid-group`,children:`Invalid Group`})}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,p.jsx)(n.h3,{id:`keep-option-sets-short-and-explicit`,children:`Keep option sets short and explicit`}),`
`,(0,p.jsx)(n.p,{children:`Radio groups work best when all options are visible at once and labels are mutually exclusive.`}),`
`,(0,p.jsx)(n.h3,{id:`do-not-use-radios-for-toggles`,children:`Do not use radios for toggles`}),`
`,(0,p.jsx)(n.p,{children:`If the choice is simply on/off, prefer a switch or checkbox. Radios communicate one-of-many selection.`}),`
`,(0,p.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/radio-button/overview`,rel:`nofollow`,children:`M3 Radio button overview`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/radio/`,rel:`nofollow`,children:`WAI-ARIA APG: Radio Group Pattern`})}),`
`]})]})}function f(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,p.jsx)(n,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=o(),n(),r(),s(),c()})))()}m();export{f as default};