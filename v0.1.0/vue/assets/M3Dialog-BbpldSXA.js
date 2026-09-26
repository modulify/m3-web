import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,s as n}from"./blocks-Coxbmtpx.js";import{C as r,P as i,Q as a,S as o,W as s,Y as c,d as l,h as u,n as d,v as f,x as p}from"./iframe-DqoEP6-3.js";import{i as m,r as h}from"./react-BXJ34t_g.js";import{a as g}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as _,t as v}from"./Inline-Ch5hsbpx.js";import{n as y,t as b}from"./button-C5ZOfJIb.js";import{i as x,t as S}from"./icon-BzqhEXMj.js";import{n as C,t as w}from"./dialog-CvxI1Nnu.js";var T;function E(){return(E=e((()=>{d(),b(),w(),S(),T=r({__name:`DialogConfirmation`,setup(e){let t=c(!1);return(e,n)=>(i(),f(l,null,[o(a(y),{appearance:`tonal`,onClick:n[0]||=e=>t.value=!0},{default:s(()=>[...n[4]||=[p(` Delete `,-1)]]),_:1}),o(a(C),{opened:t.value,"onUpdate:opened":n[3]||=e=>t.value=e,role:`dialog`,"aria-modal":`true`,"aria-labelledby":`dialog-confirmation-title`,"aria-describedby":`dialog-confirmation-description`},{icon:s(()=>[o(a(x),{name:`delete`,appearance:`outlined`})]),header:s(()=>[...n[5]||=[u(`h3`,{id:`dialog-confirmation-title`},` Permanently delete? `,-1)]]),footer:s(()=>[o(a(y),{appearance:`text`,onClick:n[1]||=e=>t.value=!1},{default:s(()=>[...n[6]||=[p(` Cancel `,-1)]]),_:1}),o(a(y),{appearance:`tonal`,onClick:n[2]||=e=>t.value=!1},{default:s(()=>[...n[7]||=[p(` Delete `,-1)]]),_:1})]),default:s(()=>[n[8]||=u(`p`,{id:`dialog-confirmation-description`},` Deleting the selected messages will also remove them from all synced devices. `,-1)]),_:1},8,[`opened`])],64))}})})))()}var D;function O(){return(O=e((()=>{E(),D=T,T.__docgenInfo=Object.assign({displayName:T.name??T.__name},{exportName:`default`,displayName:`DialogConfirmation`,description:``,tags:{},sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/dialog/DialogConfirmation.vue`]})})))()}function k(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...m(),...e.components};return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(t.h1,{id:`dialogs`,children:`Dialogs`}),`
`,(0,j.jsx)(t.p,{children:`Dialogs communicate important information and block the underlying interface until the user responds.`}),`
`,(0,j.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,j.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,j.jsxs)(t.p,{children:[`Use `,(0,j.jsx)(t.code,{children:`M3Dialog`}),` for short, interruptive decisions that need an explicit user choice before the page can continue. In Material 3 terms this maps best to confirmation, acknowledgement, and blocking task flows rather than to long-form editing or navigation.`]}),`
`,(0,j.jsx)(t.h3,{id:`structure`,children:`Structure`}),`
`,(0,j.jsxs)(t.p,{children:[(0,j.jsx)(t.code,{children:`M3Dialog`}),` keeps the same content anatomy across React and Vue:`]}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsxs)(t.li,{children:[(0,j.jsx)(t.code,{children:`icon`}),` slot for a leading visual cue`]}),`
`,(0,j.jsxs)(t.li,{children:[(0,j.jsx)(t.code,{children:`header`}),` slot for the title area`]}),`
`,(0,j.jsx)(t.li,{children:`default slot for supporting text or compact form controls`}),`
`,(0,j.jsxs)(t.li,{children:[(0,j.jsx)(t.code,{children:`footer`}),` slot for high-signal actions`]}),`
`]}),`
`,(0,j.jsxs)(t.p,{children:[`The component now renders on top of `,(0,j.jsx)(t.code,{children:`M3Surface`}),`, so dialog presentation and motion are aligned with the same modal surface vocabulary used by side sheets and orchestration stories.`]}),`
`,(0,j.jsx)(t.h3,{id:`behavior-in-this-implementation`,children:`Behavior in this implementation`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsx)(t.li,{children:`Non-fullscreen dialogs open as centered modal surfaces with a scrim.`}),`
`,(0,j.jsx)(t.li,{children:`Fullscreen dialogs remove the scrim and expand to the viewport.`}),`
`,(0,j.jsx)(t.li,{children:`The surface enters with a short fade plus a slight upward settle, matching the modal choreography used in the nested-surface stories.`}),`
`,(0,j.jsx)(t.li,{children:`Dialog content stays mounted briefly during exit so the leave animation can finish before unmount.`}),`
`]}),`
`,(0,j.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsxs)(t.li,{children:[`Set `,(0,j.jsx)(t.code,{children:`role="dialog"`}),` (or `,(0,j.jsx)(t.code,{children:`alertdialog`}),` for urgent confirmations).`]}),`
`,(0,j.jsxs)(t.li,{children:[`Provide `,(0,j.jsx)(t.code,{children:`aria-modal="true"`}),` for modal flows.`]}),`
`,(0,j.jsxs)(t.li,{children:[`Connect title and description with `,(0,j.jsx)(t.code,{children:`aria-labelledby`}),` and `,(0,j.jsx)(t.code,{children:`aria-describedby`}),`.`]}),`
`,(0,j.jsx)(t.li,{children:`Keep focus inside the dialog while it is opened.`}),`
`,(0,j.jsx)(t.li,{children:`Keep action labels explicit and outcome-oriented.`}),`
`]}),`
`,(0,j.jsx)(n,{children:(0,j.jsx)(`div`,{className:`mb-3`,children:(0,j.jsx)(v,{is:D})})}),`
`,(0,j.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,j.jsx)(t.h3,{id:`content-density`,children:`Content density`}),`
`,(0,j.jsx)(t.p,{children:`Prefer one short title, one supporting message, and one clear primary action. If the flow starts needing dense forms, multiple scrolling regions, or navigation-like exploration, a side sheet or dedicated page usually communicates the state change more clearly.`}),`
`,(0,j.jsx)(t.h3,{id:`actions`,children:`Actions`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsx)(t.li,{children:`Use the footer for the final decision point.`}),`
`,(0,j.jsx)(t.li,{children:`Keep destructive actions explicit in both label and placement.`}),`
`,(0,j.jsxs)(t.li,{children:[`Prefer a dismissive secondary action such as `,(0,j.jsx)(t.code,{children:`Cancel`}),` over relying on scrim click alone.`]}),`
`]}),`
`,(0,j.jsx)(t.h3,{id:`fullscreen-mode`,children:`Fullscreen mode`}),`
`,(0,j.jsxs)(t.p,{children:[`Use `,(0,j.jsx)(t.code,{children:`fullscreen`}),` only when the task needs the full viewport or when compact dialog proportions would constrain readability. This mode still keeps dialog semantics, but visually behaves closer to a temporary task surface than to a small confirmation window.`]}),`
`,(0,j.jsx)(t.h2,{id:`code-example`,children:`Code example`}),`
`,(0,j.jsx)(t.pre,{children:(0,j.jsx)(t.code,{className:`language-html`,children:`<M3Dialog
  v-model:opened="opened"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-confirmation-title"
  aria-describedby="dialog-confirmation-description"
>
  <template #icon>
    <M3Icon name="delete" appearance="outlined" />
  </template>

  <template #header>
    <h3 id="dialog-confirmation-title">
      Permanently delete?
    </h3>
  </template>

  <p id="dialog-confirmation-description">
    Deleting the selected messages will also remove them from all synced devices.
  </p>

  <template #footer>
    <M3Button appearance="text" @click="opened = false">
      Cancel
    </M3Button>

    <M3Button appearance="tonal" @click="opened = false">
      Delete
    </M3Button>
  </template>
</M3Dialog>
`})}),`
`,(0,j.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,j.jsxs)(t.ul,{children:[`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`M3 Dialogs overview`})}),`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/guidelines`,rel:`nofollow`,children:`M3 Dialogs guidelines`})}),`
`,(0,j.jsx)(t.li,{children:(0,j.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Modal Dialog Pattern`})}),`
`]})]})}function A(e={}){let{wrapper:t}={...m(),...e.components};return t?(0,j.jsx)(t,{...e,children:(0,j.jsx)(k,{...e})}):k(e)}var j;function M(){return(M=e((()=>{j=g(),h(),t(),_(),O()})))()}M();export{A as default};