import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,o as n,s as r}from"./blocks-Coxbmtpx.js";import{C as i,P as a,Q as o,S as s,V as c,Y as l,_ as u,n as d,nt as f,v as p}from"./iframe-DqoEP6-3.js";import{i as m,r as h}from"./react-BXJ34t_g.js";import{a as g}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as _,t as v}from"./Inline-Ch5hsbpx.js";import{i as y,n as b,r as x,t as S}from"./M3Switch.stories-Dd0AqsHJ.js";var C,w,T;function E(){return(E=e((()=>{d(),x(),C={class:`flex-row`},w=[`for`],T=i({__name:`SwitchExample`,props:{label:{type:String,default:``},disabled:{type:Boolean,default:!1}},setup(e){let t=c(),n=l(!1);return(r,i)=>(a(),p(`div`,C,[e.label.length?(a(),p(`label`,{key:0,for:o(t),class:`mr-2`},f(e.label),9,w)):u(``,!0),s(o(y),{id:o(t),checked:n.value,"onUpdate:checked":i[0]||=e=>n.value=e,disabled:e.disabled,class:`ml-auto`},null,8,[`id`,`checked`,`disabled`])]))}})})))()}var D;function O(){return(O=e((()=>{E(),D=T,T.__docgenInfo=Object.assign({displayName:T.name??T.__name},{exportName:`default`,displayName:`SwitchExample`,description:``,tags:{},props:[{name:`label`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`disabled`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/switch/SwitchExample.vue`]})})))()}function k(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...m(),...e.components};return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(n,{of:S}),`
`,(0,j.jsx)(t.h1,{id:`switch`,children:`Switch`}),`
`,(0,j.jsx)(t.p,{children:`Switches communicate an immediate on/off state. They are best for settings and independent toggles where users expect the state to change as soon as they interact.`}),`
`,(0,j.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,j.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,j.jsxs)(t.p,{children:[`Use `,(0,j.jsx)(t.code,{children:`M3Switch`}),` for binary system or preference settings such as Wi-Fi, notifications, or sync. If the choice needs confirmation or belongs to a form submitted later, a checkbox may communicate intent more clearly.`]}),`
`,(0,j.jsx)(t.h3,{id:`immediate-behavior`,children:`Immediate behavior`}),`
`,(0,j.jsx)(t.p,{children:`Material 3 switches imply direct state change. The control should reflect the new state right away and the surrounding UI should treat it as active unless the flow explicitly communicates pending sync or save.`}),`
`,(0,j.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsx)(t.li,{children:`Keep a visible label next to each switch control.`}),`
`,(0,j.jsxs)(t.li,{children:[`Expose checked state via `,(0,j.jsx)(t.code,{children:`role="switch"`}),` and `,(0,j.jsx)(t.code,{children:`aria-checked`}),`.`]}),`
`,(0,j.jsx)(t.li,{children:`Use switches for immediate on/off state changes, not for multi-choice selections.`}),`
`]}),`
`,(0,j.jsx)(t.h3,{id:`demo`,children:`Demo`}),`
`,(0,j.jsx)(r,{children:(0,j.jsxs)(`div`,{className:`m3-surface m3-surface_container m3-surface_elevation-0 my-4`,style:{maxWidth:`360px`,padding:`32px`,borderRadius:`16px`,color:`var(--m3-sys-on-surface)`},children:[(0,j.jsx)(v,{is:D,label:`Wi-Fi`,class:`mb-4`}),(0,j.jsx)(v,{is:D,label:`Bluetooth`})]})}),`
`,(0,j.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`?path=/story/components-m3switch--standard-switch`,children:`Standard Switch`})}),`
`]}),`
`,(0,j.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,j.jsx)(t.h3,{id:`write-labels-as-current-setting-names`,children:`Write labels as current setting names`}),`
`,(0,j.jsx)(t.p,{children:`Prefer labels like "Wi-Fi" or "Auto-update" over imperative wording like "Enable Wi-Fi." The state of the switch already communicates on/off.`}),`
`,(0,j.jsx)(t.h3,{id:`avoid-switches-for-irreversible-or-risky-actions`,children:`Avoid switches for irreversible or risky actions`}),`
`,(0,j.jsx)(t.p,{children:`If toggling the control can delete data or trigger destructive side effects, use a safer pattern with clearer confirmation.`}),`
`,(0,j.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`https://m3.material.io/components/switch/overview`,rel:`nofollow`,children:`M3 Switch overview`})}),`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`https://m3.material.io/components/switch/guidelines`,rel:`nofollow`,children:`M3 Switch guidelines`})}),`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/switch/`,rel:`nofollow`,children:`WAI-ARIA APG: Switch Pattern`})}),`
`]})]})}function A(e={}){let{wrapper:t}={...m(),...e.components};return t?(0,j.jsx)(t,{...e,children:(0,j.jsx)(k,{...e})}):k(e)}var j;function M(){return(M=e((()=>{j=g(),h(),_(),t(),O(),b()})))()}M();export{A as default};