import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,o as n}from"./blocks-Coxbmtpx.js";import{i as r,r as i}from"./react-BXJ34t_g.js";import{a}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as o,t as s}from"./Inline-Ch5hsbpx.js";import{n as c,t as l}from"./ButtonExample-C2IYuWMs.js";import{n as u,t as d}from"./M3Button.stories-BqVnXdZU.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...r(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`buttons`,children:`Buttons`}),`
`,(0,m.jsx)(t.p,{children:`Buttons communicate available actions and establish hierarchy on a surface. Material 3 distinguishes buttons primarily by emphasis, not by feature set.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`M3Button`}),` for explicit actions such as save, submit, share, or continue. Prefer buttons over links when the result changes UI state or triggers an in-app operation.`]}),`
`,(0,m.jsx)(t.h3,{id:`appearances`,children:`Appearances`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`filled`}),` for the primary action in a region`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`elevated`}),` when the action should stand out on low-emphasis surfaces`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`tonal`}),` for prominent but secondary emphasis`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`outlined`}),` for lower-emphasis alternatives`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`text`}),` for lightweight supporting actions`]}),`
`]}),`
`,(0,m.jsx)(t.h3,{id:`icons-and-labels`,children:`Icons and labels`}),`
`,(0,m.jsx)(t.p,{children:`Leading icons help scanning when the metaphor is widely understood. Keep the text label explicit even when an icon is present, so the action remains readable without relying on symbol recognition alone.`}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`Use a clear text label for action buttons.`}),`
`,(0,m.jsxs)(t.li,{children:[`For icon-only actions, provide `,(0,m.jsx)(t.code,{children:`aria-label`}),`.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Keep disabled actions unavailable through the `,(0,m.jsx)(t.code,{children:`disabled`}),` state.`]}),`
`]}),`
`,(0,m.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,m.jsx)(s,{tag:`span`,is:l,label:`Edit`}),(0,m.jsx)(s,{tag:`span`,is:l,label:`Edit`,appearance:`elevated`}),(0,m.jsx)(s,{tag:`span`,is:l,label:`Edit`,appearance:`outlined`}),(0,m.jsx)(s,{tag:`span`,is:l,label:`Edit`,appearance:`text`}),(0,m.jsx)(s,{tag:`span`,is:l,label:`Edit`,appearance:`tonal`})]}),`
`,(0,m.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,m.jsx)(s,{tag:`span`,is:l,icon:`edit`,label:`Edit`}),(0,m.jsx)(s,{tag:`span`,is:l,icon:`edit`,label:`Edit`,appearance:`elevated`}),(0,m.jsx)(s,{tag:`span`,is:l,icon:`edit`,label:`Edit`,appearance:`outlined`}),(0,m.jsx)(s,{tag:`span`,is:l,icon:`edit`,label:`Edit`,appearance:`text`}),(0,m.jsx)(s,{tag:`span`,is:l,icon:`edit`,label:`Edit`,appearance:`tonal`})]}),`
`,(0,m.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3button--with-text-only`,children:`With Text Only`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3button--with-leading-icon`,children:`With Leading Icon`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3button--appearance-matrix`,children:`Appearance Matrix`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3button--disabled-states`,children:`Disabled States`})}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,m.jsx)(t.h3,{id:`keep-hierarchy-local`,children:`Keep hierarchy local`}),`
`,(0,m.jsx)(t.p,{children:`Each region should usually have one highest-emphasis action. If everything is filled, users lose the sense of priority that Material 3 buttons are designed to communicate.`}),`
`,(0,m.jsx)(t.h3,{id:`disable-carefully`,children:`Disable carefully`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`disabled`}),` only when the action is genuinely unavailable. If the action is available but risky, keep it enabled and explain the consequence instead of hiding the path forward.`]}),`
`,(0,m.jsx)(t.h2,{id:`code-example`,children:`Code example`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<M3Button appearance="tonal">
  <M3Icon name="edit" /> Edit
</M3Button>
`})}),`
`,(0,m.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/buttons/overview`,rel:`nofollow`,children:`M3 Buttons overview`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/buttons/guidelines`,rel:`nofollow`,children:`M3 Buttons guidelines`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function p(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=a(),i(),t(),o(),c(),u()})))()}h();export{p as default};