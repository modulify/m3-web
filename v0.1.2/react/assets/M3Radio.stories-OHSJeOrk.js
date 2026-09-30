import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{A as o,O as s,h as c,k as l,p as u,s as d,t as f,y as p}from"./hooks-CPk-xpjN.js";import{n as m,t as h}from"./ripple-BZyVuUjI.js";import{n as g,t as _}from"./styling-Cr0ZBcFE.js";var v,y,b;function x(){return(x=e((()=>{v=n(),h(),l(),_(),f(),y=a(),b=s(function({ref:e,id:t,name:n,model:r,value:i=!0,invalid:a=!1,disabled:s=!1,equalsFn:l=(e,t)=>e===t,className:f=``,onChange:h=e=>{},..._},b){let{expose:x}=o(b),S=(0,v.useRef)(null),C=(0,v.useRef)(null),w=(0,v.useRef)(null),[T,E]=d();x(u(S,C)),p(S,E);let D=(0,v.useMemo)(()=>l(r,i),[l,r,i]),O=c(t,`m3-radio`),k=(0,v.useCallback)(e=>{e&&h(i)},[h,i]);return(0,y.jsxs)(`span`,{ref:S,className:g([f,{"m3-radio":!0,"m3-radio_checked":D,"m3-radio_invalid":a,"m3-radio_disabled":s}]),..._,children:[(0,y.jsx)(m,{ref:w,owner:T}),(0,y.jsx)(`input`,{ref:C,id:O,name:n,"aria-checked":D,"aria-disabled":s,"aria-invalid":a,checked:D,disabled:s,type:`radio`,className:`m3-radio__input`,onChange:e=>k(e.currentTarget.checked)}),(0,y.jsx)(`span`,{"aria-hidden":!0,className:`m3-radio__state`}),(0,y.jsx)(`span`,{"aria-hidden":!0,className:`m3-radio__icon`})]})},{generic:!0})})))()}function S(){return(S=e((()=>{x()})))()}var C,w,T;function E(){return(E=e((()=>{C=n(),S(),f(),w=a(),T=({legend:e=`Selection`,options:t,invalid:n=!1})=>{let r=c(null,`m3-radio-group`),[i,a]=(0,C.useState)(t[0]?.value);return(0,w.jsxs)(`fieldset`,{style:{margin:0,padding:0,border:`none`,display:`grid`,gap:`12px`,minWidth:`280px`},children:[(0,w.jsx)(`legend`,{style:{padding:0,marginBottom:`8px`,fontSize:`14px`,lineHeight:`20px`,color:`var(--m3-sys-on-surface-variant)`},children:e}),t.map(e=>{let t=`${r}-${e.value}`;return(0,w.jsxs)(`label`,{htmlFor:t,style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,w.jsx)(b,{id:t,name:r,model:i,value:e.value,invalid:n,disabled:e.disabled,onChange:a}),(0,w.jsx)(`span`,{children:e.label})]},e.value)})]})},T.__docgenInfo={description:``,methods:[],displayName:`RadioGroup`,props:{legend:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Selection'`,computed:!1}},options:{required:!0,tsType:{name:`Array`,elements:[{name:`RadioOption`}],raw:`RadioOption[]`},description:``},invalid:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var D=t({InvalidGroup:()=>P,PreferenceGroup:()=>N,Standard:()=>M,__namedExportsOrder:()=>F,default:()=>j}),O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{O=n(),S(),f(),i(),E(),k=a(),A={"en-US":{choice:`Choice`,email:`Email`,notificationChannel:`Notification channel`,preview:`Preview`,push:`Push`,releaseCadence:`Release cadence`,sms:`SMS`,stable:`Stable`},"ru-RU":{choice:`Выбор`,email:`Электронная почта`,notificationChannel:`Канал уведомлений`,preview:`Предварительные версии`,push:`Push-уведомления`,releaseCadence:`Канал обновлений`,sms:`SMS`,stable:`Стабильные версии`}},j={title:`Components/M3Radio`,component:b,argTypes:{invalid:{control:`boolean`},disabled:{control:`boolean`}},args:{invalid:!1,disabled:!1},render:({id:e,name:t,model:n,value:i,onChange:a,...o},{globals:s})=>{let l=c(null,`m3-radio-group`),u=c(null,`m3-radio`),[d,f]=(0,O.useState)(`choice`),p=r(s.locale,A);return(0,k.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,k.jsx)(b,{id:u,name:l,model:d,value:`choice`,...o,onChange:f}),(0,k.jsx)(`span`,{children:p.choice})]})},parameters:{layout:`centered`}},M={},N={render:(e,{globals:t})=>{let n=r(t.locale,A);return(0,k.jsx)(T,{legend:n.notificationChannel,options:[{label:n.email,value:`email`},{label:n.push,value:`push`},{label:n.sms,value:`sms`,disabled:!0}]})}},P={render:(e,{globals:t})=>{let n=r(t.locale,A);return(0,k.jsx)(T,{legend:n.releaseCadence,invalid:!0,options:[{label:n.stable,value:`stable`},{label:n.preview,value:`preview`}]})}},F=[`Standard`,`PreferenceGroup`,`InvalidGroup`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <RadioGroup legend={text.notificationChannel} options={[{
      label: text.email,
      value: 'email'
    }, {
      label: text.push,
      value: 'push'
    }, {
      label: text.sms,
      value: 'sms',
      disabled: true
    }]} />;
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <RadioGroup legend={text.releaseCadence} invalid={true} options={[{
      label: text.stable,
      value: 'stable'
    }, {
      label: text.preview,
      value: 'preview'
    }]} />;
  }
}`,...P.parameters?.docs?.source}}}})))()}export{E as i,I as n,T as r,D as t};