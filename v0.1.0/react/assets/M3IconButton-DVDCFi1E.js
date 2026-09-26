import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{r as s,t as c}from"./icon-qppvVYBr.js";import{n as l,t as u}from"./icon-button-D8Zh6wJc.js";import{n as d,t as f}from"./M3IconButton.stories-D6Xo2gK1.js";function p(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(i,{of:f}),`
`,(0,h.jsx)(n.h1,{id:`icon-buttons`,children:`Icon buttons`}),`
`,(0,h.jsx)(n.p,{children:`Icon buttons surface compact, frequent actions without introducing the visual weight of a full text button. They work best for toolbar actions, trailing row actions, and repeated local controls.`}),`
`,(0,h.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,h.jsxs)(n.p,{children:[`Use `,(0,h.jsx)(n.code,{children:`M3IconButton`}),` for secondary or utility actions where the icon metaphor is well established. If the action is high-stakes or not obvious from the icon alone, a text button is usually clearer.`]}),`
`,(0,h.jsx)(n.h3,{id:`appearances`,children:`Appearances`}),`
`,(0,h.jsxs)(n.p,{children:[`Material 3 distinguishes icon buttons by fill and emphasis. This implementation covers `,(0,h.jsx)(n.code,{children:`standard`}),`, `,(0,h.jsx)(n.code,{children:`filled`}),`, `,(0,h.jsx)(n.code,{children:`tonal`}),`, and `,(0,h.jsx)(n.code,{children:`outlined`}),`, which map well to common local-action hierarchies.`]}),`
`,(0,h.jsx)(n.h3,{id:`toggleable-state`,children:`Toggleable state`}),`
`,(0,h.jsxs)(n.p,{children:[`When `,(0,h.jsx)(n.code,{children:`toggleable`}),` is enabled, the button should represent an on/off state such as favorite, pin, mute, or bookmark. In that mode, use selection styling together with `,(0,h.jsx)(n.code,{children:`aria-pressed`}),`.`]}),`
`,(0,h.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsxs)(n.li,{children:[`Icon-only controls must include an accessible name (`,(0,h.jsx)(n.code,{children:`aria-label`}),`).`]}),`
`,(0,h.jsxs)(n.li,{children:[`Toggleable icon buttons should expose state with `,(0,h.jsx)(n.code,{children:`aria-pressed`}),`.`]}),`
`,(0,h.jsx)(n.li,{children:`Use icon buttons for minor actions, not for primary destructive actions.`}),`
`]}),`
`,(0,h.jsx)(a,{children:(0,h.jsxs)(`p`,{style:{display:`flex`,gap:`16px`},children:[(0,h.jsx)(l,{appearance:`filled`,"aria-label":`Mark as favorite`,children:(0,h.jsx)(s,{name:`favorite`})}),(0,h.jsx)(l,{appearance:`filled`,toggleable:!0,selected:!0,"aria-label":`Toggle favorite`,"aria-pressed":`true`,children:(0,h.jsx)(s,{name:`favorite`})})]})}),`
`,(0,h.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3iconbutton--standard`,children:`Standard`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3iconbutton--toggleable`,children:`Toggleable`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`?path=/story/components-m3iconbutton--appearance-matrix`,children:`Appearance Matrix`})}),`
`]}),`
`,(0,h.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,h.jsx)(n.h3,{id:`keep-hit-targets-generous`,children:`Keep hit targets generous`}),`
`,(0,h.jsx)(n.p,{children:`Even when the visual icon is small, the interactive target should remain comfortable for pointer and touch use. Material 3 icon buttons depend on this spacing to feel intentional rather than fiddly.`}),`
`,(0,h.jsx)(n.h3,{id:`use-toggles-only-for-persistent-state`,children:`Use toggles only for persistent state`}),`
`,(0,h.jsx)(n.p,{children:`If the action simply opens a menu or triggers a one-off command, do not model it as selected. Reserve toggle state for something the user can inspect later.`}),`
`,(0,h.jsx)(n.h2,{id:`code-example`,children:`Code example`}),`
`,(0,h.jsx)(n.pre,{children:(0,h.jsx)(n.code,{className:`language-tsx`,children:`<M3IconButton
  appearance="tonal"
  toggleable={true}
  selected={selected}
  aria-label="Toggle favorite"
  aria-pressed={selected}
>
  <M3Icon name="favorite" />
</M3IconButton>
`})}),`
`,(0,h.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,h.jsxs)(n.ul,{children:[`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/icon-buttons/overview`,rel:`nofollow`,children:`M3 Icon Buttons overview`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://m3.material.io/components/icon-buttons/guidelines`,rel:`nofollow`,children:`M3 Icon Buttons guidelines`})}),`
`,(0,h.jsx)(n.li,{children:(0,h.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function m(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,h.jsx)(n,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;function g(){return(g=e((()=>{h=o(),n(),r(),c(),u(),d()})))()}g();export{m as default};