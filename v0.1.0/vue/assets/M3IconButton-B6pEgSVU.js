import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,o as n}from"./blocks-Coxbmtpx.js";import{C as r,T as i,Y as a,n as o}from"./iframe-DqoEP6-3.js";import{i as s,r as c}from"./react-BXJ34t_g.js";import{a as l}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as u,t as d}from"./Inline-Ch5hsbpx.js";import{i as f,t as p}from"./icon-BzqhEXMj.js";import{n as m,t as h}from"./icon-button-DfGrghLx.js";import{n as g,t as _}from"./M3IconButton.stories-DMW84Mkz.js";function v(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...s(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(n,{of:_}),`
`,(0,b.jsx)(t.h1,{id:`icon-buttons`,children:`Icon buttons`}),`
`,(0,b.jsx)(t.p,{children:`Icon buttons surface compact, frequent actions without introducing the visual weight of a full text button. They work best for toolbar actions, trailing row actions, and repeated local controls.`}),`
`,(0,b.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,b.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,b.jsxs)(t.p,{children:[`Use `,(0,b.jsx)(t.code,{children:`M3IconButton`}),` for secondary or utility actions where the icon metaphor is well established. If the action is high-stakes or not obvious from the icon alone, a text button is usually clearer.`]}),`
`,(0,b.jsx)(t.h3,{id:`appearances`,children:`Appearances`}),`
`,(0,b.jsxs)(t.p,{children:[`Material 3 distinguishes icon buttons by fill and emphasis. This implementation covers `,(0,b.jsx)(t.code,{children:`standard`}),`, `,(0,b.jsx)(t.code,{children:`filled`}),`, `,(0,b.jsx)(t.code,{children:`tonal`}),`, and `,(0,b.jsx)(t.code,{children:`outlined`}),`, which map well to common local-action hierarchies.`]}),`
`,(0,b.jsx)(t.h3,{id:`toggleable-state`,children:`Toggleable state`}),`
`,(0,b.jsxs)(t.p,{children:[`When `,(0,b.jsx)(t.code,{children:`toggleable`}),` is enabled, the button should represent an on/off state such as favorite, pin, mute, or bookmark. In that mode, use selection styling together with `,(0,b.jsx)(t.code,{children:`aria-pressed`}),`.`]}),`
`,(0,b.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[`Icon-only controls must include an accessible name (`,(0,b.jsx)(t.code,{children:`aria-label`}),`).`]}),`
`,(0,b.jsxs)(t.li,{children:[`Toggleable icon buttons should expose state with `,(0,b.jsx)(t.code,{children:`aria-pressed`}),`.`]}),`
`,(0,b.jsx)(t.li,{children:`Use icon buttons for minor actions, not for primary destructive actions.`}),`
`]}),`
`,(0,b.jsx)(d,{tag:`p`,is:r({setup(){let e=a(!1),t={default:()=>i(f,{name:`favorite`})};return()=>[i(m,{appearance:`filled`,"aria-label":`Mark as favorite`},t),i(m,{appearance:`filled`,selected:e.value,toggleable:!0,"aria-label":`Toggle favorite`,"aria-pressed":e.value?`true`:`false`,onClick:()=>e.value=!e.value},t)]}})}),`
`,(0,b.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3iconbutton--standard`,children:`Standard`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3iconbutton--toggleable`,children:`Toggleable`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3iconbutton--appearance-matrix`,children:`Appearance Matrix`})}),`
`]}),`
`,(0,b.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,b.jsx)(t.h3,{id:`keep-hit-targets-generous`,children:`Keep hit targets generous`}),`
`,(0,b.jsx)(t.p,{children:`Even when the visual icon is small, the interactive target should remain comfortable for pointer and touch use. Material 3 icon buttons depend on this spacing to feel intentional rather than fiddly.`}),`
`,(0,b.jsx)(t.h3,{id:`use-toggles-only-for-persistent-state`,children:`Use toggles only for persistent state`}),`
`,(0,b.jsx)(t.p,{children:`If the action simply opens a menu or triggers a one-off command, do not model it as selected. Reserve toggle state for something the user can inspect later.`}),`
`,(0,b.jsx)(t.h2,{id:`code-example`,children:`Code example`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-html`,children:`<M3IconButton
  appearance="tonal"
  :toggleable="true"
  :selected="selected"
  aria-label="Toggle favorite"
  :aria-pressed="selected"
>
  <M3Icon name="favorite" />
</M3IconButton>
`})}),`
`,(0,b.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`https://m3.material.io/components/icon-buttons/overview`,rel:`nofollow`,children:`M3 Icon Buttons overview`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`https://m3.material.io/components/icon-buttons/guidelines`,rel:`nofollow`,children:`M3 Icon Buttons guidelines`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/button/`,rel:`nofollow`,children:`WAI-ARIA APG: Button Pattern`})}),`
`]})]})}function y(e={}){let{wrapper:t}={...s(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=l(),c(),t(),u(),o(),g(),p(),h()})))()}x();export{y as default};