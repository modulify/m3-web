import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-D8ji4XVX.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{r as o,t as s}from"./icon-4W1iC_Ck.js";import{n as c,t as l}from"./button-wQR3CB3H.js";import{i as u,n as d,t as f}from"./navigation-lSVUBdAF.js";import{n as p,t as m}from"./fab-button-Cf33qXCV.js";import{i as h,n as g,t as _}from"./snackbar-x5hQqtsS.js";var v=t({InlineFeedback:()=>A,LongAction:()=>k,QueueAndReplace:()=>M,SingleLine:()=>E,TwoLines:()=>O,UndoAction:()=>j,WithAction:()=>D,WithNavigationAndFab:()=>N,__namedExportsOrder:()=>P,default:()=>T});function y({scenario:e,locale:t}){let n=(0,b.useRef)(null),[i,a]=(0,b.useState)(``),s=r(t,w),l=(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(`div`,{className:`flex-row flex-wrap gap-4`,children:[(e===`feedback`||e===`navigation`)&&(0,x.jsx)(c,{onClick:()=>{a(s.saved),n.current?.show({message:s.savedMessage,duration:S,closeLabel:s.close})},children:s.feedback}),e===`undo`&&(0,x.jsx)(c,{onClick:()=>{a(s.archived),n.current?.show({message:s.archived,closeLabel:s.close}).then(e=>{e===`action`&&a(``)})},children:s.archive}),e===`queue`&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(c,{onClick:()=>{n.current?.show({message:s.first,duration:C,closeLabel:s.close}),n.current?.show({message:s.second,duration:C,closeLabel:s.close})},children:s.queue}),(0,x.jsx)(c,{appearance:`outlined`,onClick:()=>{n.current?.replace({message:s.second,duration:C,closeLabel:s.close})},children:s.replace})]}),i&&(0,x.jsx)(`span`,{role:`status`,children:i})]}),(0,x.jsx)(g,{ref:n,renderAction:e===`undo`?({buttonProps:e})=>(0,x.jsx)(c,{...e,children:s.action}):void 0,style:e===`navigation`?{"--m3-snackbar-inset-block-end":`calc(64px + 96px)`}:void 0})]});return e===`navigation`?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(u,{appearance:`bar`,children:[(0,x.jsx)(d,{label:s.inbox,active:!0,children:(0,x.jsx)(o,{name:`inbox`})}),(0,x.jsx)(d,{label:s.browse,children:(0,x.jsx)(o,{name:`explore`})}),(0,x.jsx)(d,{label:s.library,children:(0,x.jsx)(o,{name:`library_music`})})]}),(0,x.jsxs)(`main`,{className:`m3-has-navigation p-8`,style:{minHeight:`100vh`,background:`var(--m3-sys-surface)`},children:[l,(0,x.jsxs)(p,{variant:`tertiary`,style:{position:`fixed`,insetInlineEnd:24,insetBlockEnd:`calc(64px + 16px)`},children:[(0,x.jsx)(o,{name:`edit`}),s.compose]})]})]}):(0,x.jsx)(`main`,{className:`p-8`,style:{minHeight:360,background:`var(--m3-sys-surface)`},children:l})}var b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{b=n(),l(),m(),s(),f(),_(),i(),x=a(),S=6e3,C=4e3,w={"en-US":{feedback:`Save changes`,saved:`Saved`,savedMessage:`Changes saved`,archive:`Archive email`,archived:`Email archived`,action:`Undo`,close:`Close notification`,queue:`Queue two updates`,replace:`Replace with latest update`,first:`Uploading photo`,second:`Photo uploaded`,duplicate:`The item already has the label “travel.” Add a new label.`,long:`Add a new label`,inbox:`Inbox`,browse:`Browse`,library:`Library`,compose:`Compose`},"ru-RU":{feedback:`Сохранить изменения`,saved:`Сохранено`,savedMessage:`Изменения сохранены`,archive:`Архивировать письмо`,archived:`Письмо архивировано`,action:`Отменить`,close:`Закрыть уведомление`,queue:`Поставить два сообщения в очередь`,replace:`Заменить новым сообщением`,first:`Загружаем фото`,second:`Фото загружено`,duplicate:`У элемента уже есть метка «путешествие». Добавьте другую метку.`,long:`Добавить новую метку`,inbox:`Входящие`,browse:`Обзор`,library:`Библиотека`,compose:`Создать`}},T={title:`Components/M3Snackbar`,component:h,args:{message:`Email archived`},parameters:{layout:`fullscreen`}},E={render:(e,{globals:t})=>{let n=r(t.locale,w);return(0,x.jsx)(`div`,{style:{padding:`clamp(16px, 4vw, 32px)`},children:(0,x.jsx)(h,{message:n.savedMessage})})}},D={render:(e,{globals:t})=>{let n=r(t.locale,w);return(0,x.jsx)(`div`,{style:{padding:`clamp(16px, 4vw, 32px)`},children:(0,x.jsx)(h,{message:n.archived,closeLabel:n.close,closable:!0,children:(0,x.jsx)(h.Action,{children:({buttonProps:e})=>(0,x.jsx)(c,{...e,children:n.action})})})})}},O={render:(e,{globals:t})=>{let n=r(t.locale,w);return(0,x.jsx)(`div`,{style:{padding:`clamp(16px, 4vw, 32px)`},children:(0,x.jsx)(h,{message:n.duplicate,style:{maxInlineSize:336}})})}},k={render:(e,{globals:t})=>{let n=r(t.locale,w);return(0,x.jsx)(`div`,{style:{padding:`clamp(16px, 4vw, 32px)`},children:(0,x.jsx)(h,{message:n.duplicate,closeLabel:n.close,layout:`stacked`,style:{maxInlineSize:336},closable:!0,children:(0,x.jsx)(h.Action,{children:({buttonProps:e})=>(0,x.jsx)(c,{...e,children:n.long})})})})}},A={render:(e,{globals:t})=>(0,x.jsx)(y,{scenario:`feedback`,locale:t.locale})},j={render:(e,{globals:t})=>(0,x.jsx)(y,{scenario:`undo`,locale:t.locale})},M={render:(e,{globals:t})=>(0,x.jsx)(y,{scenario:`queue`,locale:t.locale})},N={render:(e,{globals:t})=>(0,x.jsx)(y,{scenario:`navigation`,locale:t.locale})},P=[`SingleLine`,`WithAction`,`TwoLines`,`LongAction`,`InlineFeedback`,`UndoAction`,`QueueAndReplace`,`WithNavigationAndFab`],E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <div style={{
      padding: 'clamp(16px, 4vw, 32px)'
    }}>
        <M3Snackbar message={text.savedMessage} />
      </div>;
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <div style={{
      padding: 'clamp(16px, 4vw, 32px)'
    }}>
        <M3Snackbar message={text.archived} closeLabel={text.close} closable>
          <M3Snackbar.Action>{({
            buttonProps
          }) => <M3Button {...buttonProps}>{text.action}</M3Button>}</M3Snackbar.Action>
        </M3Snackbar>
      </div>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <div style={{
      padding: 'clamp(16px, 4vw, 32px)'
    }}>
        <M3Snackbar message={text.duplicate} style={{
        maxInlineSize: 336
      }} />
      </div>;
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <div style={{
      padding: 'clamp(16px, 4vw, 32px)'
    }}>
        <M3Snackbar message={text.duplicate} closeLabel={text.close} layout="stacked" style={{
        maxInlineSize: 336
      }} closable>
          <M3Snackbar.Action>{({
            buttonProps
          }) => <M3Button {...buttonProps}>{text.long}</M3Button>}</M3Snackbar.Action>
        </M3Snackbar>
      </div>;
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <SnackbarInteraction scenario="feedback" locale={globals.locale} />
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <SnackbarInteraction scenario="undo" locale={globals.locale} />
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <SnackbarInteraction scenario="queue" locale={globals.locale} />
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <SnackbarInteraction scenario="navigation" locale={globals.locale} />
}`,...N.parameters?.docs?.source}}}})))()}export{F as n,v as t};