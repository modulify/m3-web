import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{E as n,T as r,c as i,o as a,s as o}from"./blocks-NwLwj9yT.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{h as c,m as l}from"./hooks-CPk-xpjN.js";import{n as u,t as d}from"./styling-Cr0ZBcFE.js";import{i as f,n as p,r as m,t as h}from"./M3Switch.stories-BOYnqPiZ.js";var g,_,v;function y(){return(y=e((()=>{g=t(),m(),d(),l(),_=s(),v=({className:e=``,label:t=``,disabled:n=!1})=>{let r=c(null,`m3-switch`),[i,a]=(0,g.useState)(!1);return(0,_.jsxs)(`div`,{className:u([e,`flex-row`]),children:[t.length>0?(0,_.jsx)(`label`,{htmlFor:r,className:`mr-2`,children:t}):null,(0,_.jsx)(f,{id:r,checked:i,disabled:n,className:`ml-auto`,onToggle:a})]})},v.__docgenInfo={description:``,methods:[],displayName:`SwitchExample`,props:{className:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},label:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}function b(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(a,{of:h}),`
`,(0,S.jsx)(t.h1,{id:`switch`,children:`Switch`}),`
`,(0,S.jsx)(t.p,{children:`Switches communicate an immediate on/off state. They are best for settings and independent toggles where users expect the state to change as soon as they interact.`}),`
`,(0,S.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,S.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,S.jsxs)(t.p,{children:[`Use `,(0,S.jsx)(t.code,{children:`M3Switch`}),` for binary system or preference settings such as Wi-Fi, notifications, or sync. If the choice needs confirmation or belongs to a form submitted later, a checkbox may communicate intent more clearly.`]}),`
`,(0,S.jsx)(t.h3,{id:`immediate-behavior`,children:`Immediate behavior`}),`
`,(0,S.jsx)(t.p,{children:`Material 3 switches imply direct state change. The control should reflect the new state right away and the surrounding UI should treat it as active unless the flow explicitly communicates pending sync or save.`}),`
`,(0,S.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:`Keep a visible label next to each switch control.`}),`
`,(0,S.jsxs)(t.li,{children:[`Expose checked state via `,(0,S.jsx)(t.code,{children:`role="switch"`}),` and `,(0,S.jsx)(t.code,{children:`aria-checked`}),`.`]}),`
`,(0,S.jsx)(t.li,{children:`Use switches for immediate on/off state changes, not for multi-choice selections.`}),`
`]}),`
`,(0,S.jsx)(t.h3,{id:`demo`,children:`Demo`}),`
`,(0,S.jsx)(o,{children:(0,S.jsxs)(`div`,{className:`m3-panel m3-panel_elevated-1 my-4`,style:{maxWidth:`360px`},children:[(0,S.jsx)(v,{label:`Wi-Fi`,className:`mb-4`}),(0,S.jsx)(v,{label:`Bluetooth`})]})}),`
`,(0,S.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`?path=/story/components-m3switch--standard-switch`,children:`Standard Switch`})}),`
`]}),`
`,(0,S.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,S.jsx)(t.h3,{id:`write-labels-as-current-setting-names`,children:`Write labels as current setting names`}),`
`,(0,S.jsx)(t.p,{children:`Prefer labels like "Wi-Fi" or "Auto-update" over imperative wording like "Enable Wi-Fi." The state of the switch already communicates on/off.`}),`
`,(0,S.jsx)(t.h3,{id:`avoid-switches-for-irreversible-or-risky-actions`,children:`Avoid switches for irreversible or risky actions`}),`
`,(0,S.jsx)(t.p,{children:`If toggling the control can delete data or trigger destructive side effects, use a safer pattern with clearer confirmation.`}),`
`,(0,S.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,S.jsxs)(t.ul,{children:[`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`https://m3.material.io/components/switch/overview`,rel:`nofollow`,children:`M3 Switch overview`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`https://m3.material.io/components/switch/guidelines`,rel:`nofollow`,children:`M3 Switch guidelines`})}),`
`,(0,S.jsx)(t.li,{children:(0,S.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/switch/`,rel:`nofollow`,children:`WAI-ARIA APG: Switch Pattern`})}),`
`]})]})}function x(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,S.jsx)(t,{...e,children:(0,S.jsx)(b,{...e})}):b(e)}var S;function C(){return(C=e((()=>{S=s(),r(),i(),y(),p()})))()}C();export{x as default};