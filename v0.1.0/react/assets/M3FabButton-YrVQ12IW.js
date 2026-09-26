import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{r as s,t as c}from"./icon-qppvVYBr.js";import{n as l,t as u}from"./fab-button-gcQJwemO.js";import{n as d,t as f}from"./M3FabButton.stories-CecxmZns.js";function p(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(i,{of:f}),`
`,(0,h.jsx)(n.h1,{id:`floating-action-buttons`,children:`Floating action buttons`}),`
`,(0,h.jsx)(n.p,{children:`Floating action buttons emphasize the highest-priority action on a surface. Material 3 treats FABs as strong directional cues, so they work best when the page has one clear "next thing to do."`}),`
`,(0,h.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,h.jsxs)(n.p,{children:[`Use `,(0,h.jsx)(n.code,{children:`M3FabButton`}),` for the primary action of a screen or large section, especially when that action should remain easy to reach while content scrolls.`]}),`
`,(0,h.jsx)(n.h3,{id:`standard-vs-extended`,children:`Standard vs extended`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:`standard FAB for compact icon-first actions`}),`
`,(0,h.jsx)(n.li,{children:`extended FAB when the action benefits from a visible label`}),`
`]}),`
`,(0,h.jsx)(n.p,{children:`The extended form is usually easier to scan when the action is not universally obvious from the icon alone.`}),`
`,(0,h.jsx)(n.h3,{id:`variants`,children:`Variants`}),`
`,(0,h.jsxs)(n.p,{children:[`This implementation exposes Material 3 tonal variants such as `,(0,h.jsx)(n.code,{children:`surface`}),`, `,(0,h.jsx)(n.code,{children:`primary`}),`, `,(0,h.jsx)(n.code,{children:`secondary`}),`, and `,(0,h.jsx)(n.code,{children:`tertiary`}),`, which let the FAB stay prominent without always defaulting to the same tone.`]}),`
`,(0,h.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsxs)(n.li,{children:[`Icon-only FABs require an accessible name via `,(0,h.jsx)(n.code,{children:`aria-label`}),`.`]}),`
`,(0,h.jsx)(n.li,{children:`Keep FAB usage focused on the primary action on a given surface.`}),`
`,(0,h.jsx)(n.li,{children:`Extended FABs should keep a short visible label.`}),`
`]}),`
`,(0,h.jsx)(n.h3,{id:`standard-fabs`,children:`Standard FABs`}),`
`,(0,h.jsx)(a,{children:(0,h.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,h.jsx)(l,{"aria-label":`New task`,variant:`surface`,children:(0,h.jsx)(s,{name:`edit`})}),(0,h.jsx)(l,{"aria-label":`New task`,children:(0,h.jsx)(s,{name:`edit`})}),(0,h.jsx)(l,{"aria-label":`New task`,variant:`secondary`,children:(0,h.jsx)(s,{name:`edit`})}),(0,h.jsx)(l,{"aria-label":`New task`,variant:`tertiary`,children:(0,h.jsx)(s,{name:`edit`})})]})}),`
`,(0,h.jsx)(n.h3,{id:`extended-fabs`,children:`Extended FABs`}),`
`,(0,h.jsx)(a,{children:(0,h.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,h.jsxs)(l,{variant:`surface`,children:[(0,h.jsx)(s,{name:`edit`}),` New task`]}),(0,h.jsxs)(l,{children:[(0,h.jsx)(s,{name:`edit`}),` New task`]}),(0,h.jsxs)(l,{variant:`secondary`,children:[(0,h.jsx)(s,{name:`edit`}),` New task`]}),(0,h.jsxs)(l,{variant:`tertiary`,children:[(0,h.jsx)(s,{name:`edit`}),` New task`]})]})}),`
`,(0,h.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3fabbutton--standard`,children:`Standard`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3fabbutton--extended`,children:`Extended`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3fabbutton--variant-matrix`,children:`Variant Matrix`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3fabbutton--size-matrix`,children:`Size Matrix`})}),`
`]}),`
`,(0,h.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,h.jsx)(n.h3,{id:`one-fab-per-context`,children:`One FAB per context`}),`
`,(0,h.jsx)(n.p,{children:`Most surfaces should have at most one FAB. Multiple competing FABs dilute the main-action pattern that Material 3 is trying to reinforce.`}),`
`,(0,h.jsx)(n.h3,{id:`prefer-extended-when-the-icon-is-ambiguous`,children:`Prefer extended when the icon is ambiguous`}),`
`,(0,h.jsx)(n.p,{children:`If users need to stop and decode the icon, show the label. The slight increase in width is usually worth the clarity.`}),`
`,(0,h.jsx)(n.h2,{id:`code-example`,children:`Code example`}),`
`,(0,h.jsx)(n.pre,{children:(0,h.jsx)(n.code,{className:`language-tsx`,children:`<M3FabButton>
  <M3Icon name="add" /> New task
</M3FabButton>
`})}),`
`,(0,h.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/floating-action-button/overview`,rel:`nofollow`,children:`M3 FAB overview`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/floating-action-button/guidelines`,rel:`nofollow`,children:`M3 FAB guidelines`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/extended-fab/overview`,rel:`nofollow`,children:`M3 Extended FAB overview`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/extended-fab/guidelines`,rel:`nofollow`,children:`M3 Extended FAB guidelines`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function m(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,h.jsx)(n,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;function g(){return(g=e((()=>{h=o(),n(),r(),u(),c(),d()})))()}g();export{m as default};