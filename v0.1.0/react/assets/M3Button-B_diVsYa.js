import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./button-Bg5IbSnS.js";import{r as l,t as u}from"./icon-qppvVYBr.js";import{n as d,t as f}from"./M3Button.stories-DkeM-aLk.js";function p(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(i,{of:f}),`
`,(0,h.jsx)(n.h1,{id:`buttons`,children:`Buttons`}),`
`,(0,h.jsx)(n.p,{children:`Buttons communicate available actions and establish hierarchy on a surface. Material 3 distinguishes buttons primarily by emphasis, not by feature set.`}),`
`,(0,h.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,h.jsxs)(n.p,{children:[`Use `,(0,h.jsx)(n.code,{children:`M3Button`}),` for explicit actions such as save, submit, share, or continue. Prefer buttons over links when the result changes UI state or triggers an in-app operation.`]}),`
`,(0,h.jsx)(n.h3,{id:`appearances`,children:`Appearances`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsxs)(n.li,{children:[(0,h.jsx)(n.code,{children:`filled`}),` for the primary action in a region`]}),`
`,(0,h.jsxs)(n.li,{children:[(0,h.jsx)(n.code,{children:`elevated`}),` when the action should stand out on low-emphasis surfaces`]}),`
`,(0,h.jsxs)(n.li,{children:[(0,h.jsx)(n.code,{children:`tonal`}),` for prominent but secondary emphasis`]}),`
`,(0,h.jsxs)(n.li,{children:[(0,h.jsx)(n.code,{children:`outlined`}),` for lower-emphasis alternatives`]}),`
`,(0,h.jsxs)(n.li,{children:[(0,h.jsx)(n.code,{children:`text`}),` for lightweight supporting actions`]}),`
`]}),`
`,(0,h.jsx)(n.h3,{id:`icons-and-labels`,children:`Icons and labels`}),`
`,(0,h.jsx)(n.p,{children:`Leading icons help scanning when the metaphor is widely understood. Keep the text label explicit even when an icon is present, so the action remains readable without relying on symbol recognition alone.`}),`
`,(0,h.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:`Use a clear text label for action buttons.`}),`
`,(0,h.jsxs)(n.li,{children:[`For icon-only actions, provide `,(0,h.jsx)(n.code,{children:`aria-label`}),`.`]}),`
`,(0,h.jsxs)(n.li,{children:[`Keep disabled actions unavailable through the `,(0,h.jsx)(n.code,{children:`disabled`}),` state.`]}),`
`]}),`
`,(0,h.jsxs)(a,{children:[(0,h.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,h.jsx)(s,{children:`Edit`}),(0,h.jsx)(s,{appearance:`elevated`,children:`Edit`}),(0,h.jsx)(s,{appearance:`outlined`,children:`Edit`}),(0,h.jsx)(s,{appearance:`text`,children:`Edit`}),(0,h.jsx)(s,{appearance:`tonal`,children:`Edit`})]}),(0,h.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,h.jsxs)(s,{children:[(0,h.jsx)(l,{name:`edit`}),` Edit`]}),(0,h.jsxs)(s,{appearance:`elevated`,children:[(0,h.jsx)(l,{name:`edit`}),` Edit`]}),(0,h.jsxs)(s,{appearance:`outlined`,children:[(0,h.jsx)(l,{name:`edit`}),` Edit`]}),(0,h.jsxs)(s,{appearance:`text`,children:[(0,h.jsx)(l,{name:`edit`}),` Edit`]}),(0,h.jsxs)(s,{appearance:`tonal`,children:[(0,h.jsx)(l,{name:`edit`}),` Edit`]})]})]}),`
`,(0,h.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3button--with-text-only`,children:`With Text Only`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3button--with-leading-icon`,children:`With Leading Icon`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3button--appearance-matrix`,children:`Appearance Matrix`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3button--disabled-states`,children:`Disabled States`})}),`
`]}),`
`,(0,h.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,h.jsx)(n.h3,{id:`keep-hierarchy-local`,children:`Keep hierarchy local`}),`
`,(0,h.jsx)(n.p,{children:`Each region should usually have one highest-emphasis action. If everything is filled, users lose the sense of priority that Material 3 buttons are designed to communicate.`}),`
`,(0,h.jsx)(n.h3,{id:`disable-carefully`,children:`Disable carefully`}),`
`,(0,h.jsxs)(n.p,{children:[`Use `,(0,h.jsx)(n.code,{children:`disabled`}),` only when the action is genuinely unavailable. If the action is available but risky, keep it enabled and explain the consequence instead of hiding the path forward.`]}),`
`,(0,h.jsx)(n.h2,{id:`code-example`,children:`Code example`}),`
`,(0,h.jsx)(n.pre,{children:(0,h.jsx)(n.code,{className:`language-tsx`,children:`export const EditButton = () => (
  <M3Button appearance="tonal">
    <M3Icon name="edit" /> Edit
  </M3Button>
)
`})}),`
`,(0,h.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/buttons/overview`,rel:`nofollow`,children:`M3 Buttons overview`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/buttons/guidelines`,rel:`nofollow`,children:`M3 Buttons guidelines`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function m(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,h.jsx)(n,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;function g(){return(g=e((()=>{h=o(),n(),r(),c(),u(),d()})))()}g();export{m as default};