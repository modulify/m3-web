import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{E as n,T as r,c as i,s as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./button-Bg5IbSnS.js";import{r as l,t as u}from"./icon-qppvVYBr.js";import{n as d,t as f}from"./dialog-ChTUR9S8.js";var p,m,h;function g(){return(g=e((()=>{p=t(),c(),f(),u(),m=o(),h=()=>{let[e,t]=(0,p.useState)(!1),n=`dialog-confirmation-title`,r=`dialog-confirmation-description`;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(s,{appearance:`tonal`,onClick:()=>t(!0),children:`Delete`}),(0,m.jsxs)(d,{opened:e,role:`dialog`,"aria-modal":`true`,"aria-labelledby":n,"aria-describedby":r,onToggle:t,children:[(0,m.jsx)(d.Icon,{children:(0,m.jsx)(l,{name:`delete`,appearance:`outlined`})}),(0,m.jsx)(d.Header,{children:(0,m.jsx)(`h3`,{id:n,children:`Permanently delete?`})}),(0,m.jsx)(`p`,{id:r,children:`Deleting the selected messages will also remove them from all synced devices.`}),(0,m.jsxs)(d.Footer,{children:[(0,m.jsx)(s,{appearance:`text`,onClick:()=>t(!1),children:`Cancel`}),(0,m.jsx)(s,{appearance:`tonal`,onClick:()=>t(!1),children:`Delete`})]})]})]})},h.__docgenInfo={description:``,methods:[],displayName:`DialogConfirmation`}})))()}function _(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(t.h1,{id:`dialogs`,children:`Dialogs`}),`
`,(0,y.jsx)(t.p,{children:`Dialogs communicate important information and block the underlying interface until the user responds.`}),`
`,(0,y.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,y.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,y.jsxs)(t.p,{children:[`Use `,(0,y.jsx)(t.code,{children:`M3Dialog`}),` for short, interruptive decisions that need an explicit user choice before the page can continue. In Material 3 terms this maps best to confirmation, acknowledgement, and blocking task flows rather than to long-form editing or navigation.`]}),`
`,(0,y.jsx)(t.h3,{id:`structure`,children:`Structure`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`M3Dialog`}),` keeps the same content anatomy across React and Vue:`]}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`M3Dialog.Icon`}),` for a leading visual cue`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`M3Dialog.Header`}),` for the title area`]}),`
`,(0,y.jsx)(t.li,{children:`default content for supporting text or compact form controls`}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`M3Dialog.Footer`}),` for high-signal actions`]}),`
`]}),`
`,(0,y.jsxs)(t.p,{children:[`The component now renders on top of `,(0,y.jsx)(t.code,{children:`M3Surface`}),`, so dialog presentation and motion are aligned with the same modal surface vocabulary used by side sheets and orchestration stories.`]}),`
`,(0,y.jsx)(t.h3,{id:`behavior-in-this-implementation`,children:`Behavior in this implementation`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsx)(t.li,{children:`Non-fullscreen dialogs open as centered modal surfaces with a scrim.`}),`
`,(0,y.jsx)(t.li,{children:`Fullscreen dialogs remove the scrim and expand to the viewport.`}),`
`,(0,y.jsx)(t.li,{children:`The surface enters with a short fade plus a slight upward settle, matching the modal choreography used in the nested-surface stories.`}),`
`,(0,y.jsx)(t.li,{children:`Dialog content stays mounted briefly during exit so the leave animation can finish before unmount.`}),`
`]}),`
`,(0,y.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[`Set `,(0,y.jsx)(t.code,{children:`role="dialog"`}),` (or `,(0,y.jsx)(t.code,{children:`alertdialog`}),` for urgent confirmations).`]}),`
`,(0,y.jsxs)(t.li,{children:[`Provide `,(0,y.jsx)(t.code,{children:`aria-modal="true"`}),` for modal flows.`]}),`
`,(0,y.jsxs)(t.li,{children:[`Connect title and description with `,(0,y.jsx)(t.code,{children:`aria-labelledby`}),` and `,(0,y.jsx)(t.code,{children:`aria-describedby`}),`.`]}),`
`,(0,y.jsx)(t.li,{children:`Keep focus inside the dialog while it is opened.`}),`
`,(0,y.jsx)(t.li,{children:`Keep action labels explicit and outcome-oriented.`}),`
`]}),`
`,(0,y.jsx)(a,{children:(0,y.jsx)(`div`,{className:`mb-3`,children:(0,y.jsx)(h,{})})}),`
`,(0,y.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,y.jsx)(t.h3,{id:`content-density`,children:`Content density`}),`
`,(0,y.jsx)(t.p,{children:`Prefer one short title, one supporting message, and one clear primary action. If the flow starts needing dense forms, multiple scrolling regions, or navigation-like exploration, a side sheet or dedicated page usually communicates the state change more clearly.`}),`
`,(0,y.jsx)(t.h3,{id:`actions`,children:`Actions`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsx)(t.li,{children:`Use the footer for the final decision point.`}),`
`,(0,y.jsx)(t.li,{children:`Keep destructive actions explicit in both label and placement.`}),`
`,(0,y.jsxs)(t.li,{children:[`Prefer a dismissive secondary action such as `,(0,y.jsx)(t.code,{children:`Cancel`}),` over relying on scrim click alone.`]}),`
`]}),`
`,(0,y.jsx)(t.h3,{id:`fullscreen-mode`,children:`Fullscreen mode`}),`
`,(0,y.jsxs)(t.p,{children:[`Use `,(0,y.jsx)(t.code,{children:`fullscreen`}),` only when the task needs the full viewport or when compact dialog proportions would constrain readability. This mode still keeps dialog semantics, but visually behaves closer to a temporary task surface than to a small confirmation window.`]}),`
`,(0,y.jsx)(t.h2,{id:`code-example`,children:`Code example`}),`
`,(0,y.jsx)(t.pre,{children:(0,y.jsx)(t.code,{className:`language-tsx`,children:`const dialogTitleId = 'dialog-confirmation-title'
const dialogDescriptionId = 'dialog-confirmation-description'

<M3Dialog
  opened={opened}
  role="dialog"
  aria-modal="true"
  aria-labelledby={dialogTitleId}
  aria-describedby={dialogDescriptionId}
  onToggle={setOpened}
>
  <M3Dialog.Icon>
    <M3Icon name="delete" appearance="outlined" />
  </M3Dialog.Icon>

  <M3Dialog.Header>
    <h3 id={dialogTitleId}>Permanently delete?</h3>
  </M3Dialog.Header>

  <p id={dialogDescriptionId}>
    Deleting the selected messages will also remove them from all synced devices.
  </p>

  <M3Dialog.Footer>
    <M3Button appearance="text" onClick={() => setOpened(false)}>
      Cancel
    </M3Button>

    <M3Button appearance="tonal" onClick={() => setOpened(false)}>
      Delete
    </M3Button>
  </M3Dialog.Footer>
</M3Dialog>
`})}),`
`,(0,y.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsx)(t.li,{children:(0,y.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`M3 Dialogs overview`})}),`
`,(0,y.jsx)(t.li,{children:(0,y.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/guidelines`,rel:`nofollow`,children:`M3 Dialogs guidelines`})}),`
`,(0,y.jsx)(t.li,{children:(0,y.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Modal Dialog Pattern`})}),`
`]})]})}function v(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;function b(){return(b=e((()=>{y=o(),r(),i(),g()})))()}b();export{v as default};