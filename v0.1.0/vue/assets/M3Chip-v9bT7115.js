import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,o as n}from"./blocks-Coxbmtpx.js";import{i as r,r as i}from"./react-BXJ34t_g.js";import{a}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as o,t as s}from"./Inline-Ch5hsbpx.js";import{i as c,n as l,r as u,t as d}from"./M3Chip.stories-DlAPqLfV.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...r(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`chips`,children:`Chips`}),`
`,(0,m.jsx)(t.p,{children:`Chips help people enter information, make selections, filter content, or trigger actions. Material 3 distinguishes four chip types: assist, filter, input, and suggestion.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`M3Chip`}),` for compact, contextual actions or selections that should stay visible inside the surrounding content. If the action needs stronger emphasis or more copy, prefer buttons.`]}),`
`,(0,m.jsx)(t.h3,{id:`variants`,children:`Variants`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`assist`}),` for quick contextual actions such as "Remind later"`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`filter`}),` for toggleable filters that stay visible as active constraints`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`input`}),` for entered entities or tokens that can usually be removed`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`suggestion`}),` for lightweight recommendations that help users continue a flow`]}),`
`]}),`
`,(0,m.jsx)(t.h3,{id:`selection-and-dismissal`,children:`Selection and dismissal`}),`
`,(0,m.jsxs)(t.p,{children:[`This implementation keeps `,(0,m.jsx)(t.code,{children:`filter`}),` chips controlled through `,(0,m.jsx)(t.code,{children:`selected`}),` and `,(0,m.jsx)(t.code,{children:`update:selected`}),`. Input chips can expose a separate dismiss affordance through `,(0,m.jsx)(t.code,{children:`dismissible`}),` and `,(0,m.jsx)(t.code,{children:`dismiss`}),`.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`There is no special ARIA chip role here; the primary surface uses native button semantics.`}),`
`,(0,m.jsxs)(t.li,{children:[`Filter chips expose toggle state through `,(0,m.jsx)(t.code,{children:`aria-pressed`}),`.`]}),`
`,(0,m.jsx)(t.li,{children:`If a chip exposes a remove affordance, the trailing dismiss button should keep an explicit accessible label.`}),`
`,(0,m.jsx)(t.li,{children:`Chip labels should stay short and scannable because they are often read in dense horizontal clusters.`}),`
`]}),`
`,(0,m.jsx)(t.h3,{id:`variant-panel`,children:`Variant panel`}),`
`,(0,m.jsx)(`div`,{className:`m3-panel m3-panel_elevated-1`,style:{padding:`16px`},children:(0,m.jsx)(s,{is:u,mode:`matrix`})}),`
`,(0,m.jsx)(t.h3,{id:`filter-set`,children:`Filter set`}),`
`,(0,m.jsx)(`div`,{className:`m3-panel m3-panel_elevated-1`,style:{padding:`16px`},children:(0,m.jsx)(s,{is:u,mode:`filters`})}),`
`,(0,m.jsx)(t.h3,{id:`input-tokens`,children:`Input tokens`}),`
`,(0,m.jsx)(`div`,{className:`m3-panel m3-panel_elevated-1`,style:{padding:`16px`},children:(0,m.jsx)(s,{is:u,mode:`inputs`})}),`
`,(0,m.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3chip--standard`,children:`Standard`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3chip--variant-matrix`,children:`Variant Matrix`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3chip--filter-set`,children:`Filter Set`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`?path=/story/components-m3chip--input-tokens`,children:`Input Tokens`})}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,m.jsx)(t.h3,{id:`keep-chip-copy-brief`,children:`Keep chip copy brief`}),`
`,(0,m.jsx)(t.p,{children:`Chips work best with short labels that can be scanned in rows. If the label turns into a sentence, the interaction usually wants a button or list row instead.`}),`
`,(0,m.jsx)(t.h3,{id:`match-semantics-to-intent`,children:`Match semantics to intent`}),`
`,(0,m.jsx)(t.p,{children:`Use assist and suggestion chips as action affordances. Use filter chips only when the selected state matters. Use input chips when the item itself becomes part of the current form or scope.`}),`
`,(0,m.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/chips/overview`,rel:`nofollow`,children:`M3 Chips overview`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://m3.material.io/components/chips/guidelines`,rel:`nofollow`,children:`M3 Chips guidelines`})}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function p(e={}){let{wrapper:t}={...r(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=a(),i(),t(),o(),c(),l()})))()}h();export{p as default};