import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,n as i,o as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{i as s,n as c,r as l,t as u}from"./M3Link.stories-BBEgVayE.js";function d(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...t(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(n.h1,{id:`link`,children:`Link`}),`
`,(0,p.jsxs)(n.p,{children:[(0,p.jsx)(n.code,{children:`M3Link`}),` is a semantic primitive that renders either a button-like control or an anchor, depending on whether navigation is involved. In this workspace it is intentionally low-level and acts as a base for richer controls.`]}),`
`,(0,p.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(n.p,{children:[`Use `,(0,p.jsx)(n.code,{children:`M3Link`}),` when you need a semantic clickable primitive that may resolve to `,(0,p.jsx)(n.code,{children:`<button>`}),` or `,(0,p.jsx)(n.code,{children:`<a>`}),` without rewriting the surrounding presentation logic. It is especially useful for custom controls that share styling but differ in navigation semantics.`]}),`
`,(0,p.jsx)(n.h3,{id:`primitive-role`,children:`Primitive role`}),`
`,(0,p.jsx)(n.p,{children:`Material 3 does not define a dedicated standalone "link primitive" page. Instead, links appear inside buttons, cards, navigation items, and other patterns. This component fills that implementation-level gap while still following Material 3 guidance for the patterns built on top of it.`}),`
`,(0,p.jsx)(n.h3,{id:`rendering-model`,children:`Rendering model`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsxs)(n.li,{children:[`renders as `,(0,p.jsx)(n.code,{children:`<button>`}),` when the action is in-app and no `,(0,p.jsx)(n.code,{children:`href`}),` is provided`]}),`
`,(0,p.jsxs)(n.li,{children:[`renders as `,(0,p.jsx)(n.code,{children:`<a>`}),` when navigation is the intended behavior`]}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:`Use button semantics for state-changing actions.`}),`
`,(0,p.jsx)(n.li,{children:`Use anchor semantics for navigation to another resource or location.`}),`
`,(0,p.jsx)(n.li,{children:`Keep visible labels descriptive enough to make sense out of context.`}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3link--primitive-shape`,children:`Primitive Shape`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`?path=/story/components-m3link--as-base-for-custom-controls`,children:`As Base For Custom Controls`})}),`
`]}),`
`,(0,p.jsx)(n.h2,{id:`demo`,children:`Demo`}),`
`,(0,p.jsx)(i,{of:l}),`
`,(0,p.jsx)(i,{of:u}),`
`,(0,p.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,p.jsx)(n.h3,{id:`choose-semantics-first`,children:`Choose semantics first`}),`
`,(0,p.jsx)(n.p,{children:`Do not decide between anchor and button based only on visual appearance. Choose based on whether the result is navigation or an action.`}),`
`,(0,p.jsx)(n.h3,{id:`build-presentation-on-top`,children:`Build presentation on top`}),`
`,(0,p.jsxs)(n.p,{children:[`Because `,(0,p.jsx)(n.code,{children:`M3Link`}),` is intentionally primitive, treat it as a foundation for custom controls rather than as a full visual component by itself.`]}),`
`,(0,p.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,p.jsxs)(n.ul,{children:[`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/buttons/overview`,rel:`nofollow`,children:`M3 Buttons overview`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/cards/overview`,rel:`nofollow`,children:`M3 Cards overview`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://m3.material.io/components/navigation-drawer/overview`,rel:`nofollow`,children:`M3 Navigation drawer overview`})}),`
`,(0,p.jsx)(n.li,{children:(0,p.jsx)(n.a,{href:`https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Links_and_navigation`,rel:`nofollow`,children:`MDN: Links vs. buttons`})}),`
`]})]})}function f(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,p.jsx)(n,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=o(),n(),r(),s()})))()}m();export{f as default};