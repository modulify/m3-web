import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{i as s,n as c,r as l,t as u}from"./M3Chip.stories-DuVsnHyD.js";function d(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...t(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i,{of:u}),`
`,(0,p.jsx)(n.h1,{id:`chips`,children:`Chips`}),`
`,(0,p.jsx)(n.p,{children:`Chips help people enter information, make selections, filter content, or trigger actions. Material 3 distinguishes four chip types: assist, filter, input, and suggestion.`}),`
`,(0,p.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(n.p,{children:[`Use `,(0,p.jsx)(n.code,{children:`M3Chip`}),` for compact, contextual actions or selections that should stay visible inside the surrounding content. If the action needs stronger emphasis or more copy, prefer buttons.`]}),`
`,(0,p.jsx)(n.h3,{id:`variants`,children:`Variants`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsxs)(n.li,{children:[(0,p.jsx)(n.code,{children:`assist`}),` for quick contextual actions such as "Remind later"`]}),`
`,(0,p.jsxs)(n.li,{children:[(0,p.jsx)(n.code,{children:`filter`}),` for toggleable filters that stay visible as active constraints`]}),`
`,(0,p.jsxs)(n.li,{children:[(0,p.jsx)(n.code,{children:`input`}),` for entered entities or tokens that can usually be removed`]}),`
`,(0,p.jsxs)(n.li,{children:[(0,p.jsx)(n.code,{children:`suggestion`}),` for lightweight recommendations that help users continue a flow`]}),`
`]}),`
`,(0,p.jsx)(n.h3,{id:`selection-and-dismissal`,children:`Selection and dismissal`}),`
`,(0,p.jsxs)(n.p,{children:[`This implementation keeps `,(0,p.jsx)(n.code,{children:`filter`}),` chips controlled through `,(0,p.jsx)(n.code,{children:`selected`}),` and `,(0,p.jsx)(n.code,{children:`onToggle`}),`. Input chips can expose a separate dismiss affordance through `,(0,p.jsx)(n.code,{children:`dismissible`}),` and `,(0,p.jsx)(n.code,{children:`onDismiss`}),`.`]}),`
`,(0,p.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:`There is no special ARIA chip role here; the primary surface uses native button semantics.`}),`
`,(0,p.jsxs)(n.li,{children:[`Filter chips expose toggle state through `,(0,p.jsx)(n.code,{children:`aria-pressed`}),`.`]}),`
`,(0,p.jsx)(n.li,{children:`If a chip exposes a remove affordance, the trailing dismiss button should keep an explicit accessible label.`}),`
`,(0,p.jsx)(n.li,{children:`Chip labels should stay short and scannable because they are often read in dense horizontal clusters.`}),`
`]}),`
`,(0,p.jsx)(n.h3,{id:`variant-panel`,children:`Variant panel`}),`
`,(0,p.jsx)(a,{className:`m3-panel m3-panel_elevated-1`,style:{padding:`16px`},children:(0,p.jsx)(l,{mode:`matrix`})}),`
`,(0,p.jsx)(n.h3,{id:`filter-set`,children:`Filter set`}),`
`,(0,p.jsx)(a,{className:`m3-panel m3-panel_elevated-1`,style:{padding:`16px`},children:(0,p.jsx)(l,{mode:`filters`})}),`
`,(0,p.jsx)(n.h3,{id:`input-tokens`,children:`Input tokens`}),`
`,(0,p.jsx)(a,{className:`m3-panel m3-panel_elevated-1`,style:{padding:`16px`},children:(0,p.jsx)(l,{mode:`inputs`})}),`
`,(0,p.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3chip--standard`,children:`Standard`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3chip--variant-matrix`,children:`Variant Matrix`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3chip--filter-set`,children:`Filter Set`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3chip--input-tokens`,children:`Input Tokens`})}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,p.jsx)(n.h3,{id:`keep-chip-copy-brief`,children:`Keep chip copy brief`}),`
`,(0,p.jsx)(n.p,{children:`Chips work best with short labels that can be scanned in rows. If the label turns into a sentence, the interaction usually wants a button or list row instead.`}),`
`,(0,p.jsx)(n.h3,{id:`match-semantics-to-intent`,children:`Match semantics to intent`}),`
`,(0,p.jsx)(n.p,{children:`Use assist and suggestion chips as action affordances. Use filter chips only when the selected state matters. Use input chips when the item itself becomes part of the current form or scope.`}),`
`,(0,p.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/chips/overview`,rel:`nofollow`,children:`M3 Chips overview`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/chips/guidelines`,rel:`nofollow`,children:`M3 Chips guidelines`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function f(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,p.jsx)(n,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=o(),n(),r(),s(),c()})))()}m();export{f as default};