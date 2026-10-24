import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,E as i,O as a,S as o,U as s,V as c,Z as l,a as u,at as d,b as f,g as p,i as m,nt as h,s as g,ut as _,x as v,y}from"./iframe-DlP_3VDG.js";import{n as b,t as x}from"./button-DcVEi8uC.js";import{n as S,t as C}from"./icon-BHYZNUrK.js";import{n as w,t as T}from"./search-BSb8ew8o.js";import{n as E,t as D}from"./_plugin-vue_export-helper-BqBa3wPr.js";import{i as O,n as k,t as A}from"./list-CpYq2h_b.js";var j,M,N,P,F,I;function L(){return(L=e((()=>{g(),x(),C(),A(),T(),m(),j={class:`search-example`},M={class:`search-example__content`},N={class:`search-example__header`},P={class:`search-example__section`},F={class:`search-example__grid`},I=a({__name:`SearchExample`,props:{appearance:{type:String,default:`contained`},layout:{type:String,default:`auto`},locale:{type:String,default:`en-US`},initialOpen:{type:Boolean,default:!1},externalTrigger:{type:Boolean,default:!1}},setup(e){let t={"en-US":{heading:`Mail`,hint:`Search your messages`,back:`Back to mail`,clear:`Clear search`,example:`Use a recent query`,open:`Open search programmatically`,recent:`Recent searches`,suggestions:`Suggestions`,results:`Results`,inbox:`Inbox`,cards:[`Planning the next release`,`Notes from yesterday`,`Design review`,`Project status`]},"ru-RU":{heading:`Почта`,hint:`Поиск по сообщениям`,back:`Назад к почте`,clear:`Очистить поиск`,example:`Вставить недавний запрос`,open:`Открыть поиск программно`,recent:`Недавние запросы`,suggestions:`Подсказки`,results:`Результаты`,inbox:`Входящие`,cards:[`План следующего выпуска`,`Заметки за вчера`,`Обзор дизайна`,`Состояние проекта`]}},a=e,m=y(()=>u(a.locale,t)),g=h(``),x=h(a.initialOpen),C=h(!1),T=y(()=>m.value.cards.filter(e=>e.toLocaleLowerCase(a.locale).includes(g.value.toLocaleLowerCase(a.locale)))),E=y(()=>g.value?T.value:m.value.cards.slice(0,3)),D=y(()=>C.value?m.value.results:g.value?m.value.suggestions:m.value.recent),A=y(()=>`${D.value}: ${E.value.length}`),I=e=>{g.value=e,x.value=!1};return(t,a)=>(c(),n(`main`,j,[f(`div`,M,[f(`header`,N,[f(`h1`,null,_(m.value.heading),1),e.externalTrigger?(c(),v(d(b),{key:0,onClick:a[0]||=e=>x.value=!0},{default:l(()=>[i(_(m.value.open),1)]),_:1})):o(``,!0)]),r(d(w),{query:g.value,"onUpdate:query":[a[2]||=e=>g.value=e,a[5]||=e=>C.value=!1],open:x.value,"onUpdate:open":a[3]||=e=>x.value=e,appearance:e.appearance,layout:e.layout,label:m.value.hint,hint:m.value.hint,"back-label":m.value.back,"clear-label":m.value.clear,status:A.value,onSubmit:a[4]||=e=>C.value=!0},{actions:l(()=>[r(d(b),{"aria-label":m.value.example,appearance:`standard`,width:`medium`,onClick:a[1]||=e=>g.value=m.value.cards[0]},{default:l(()=>[r(d(S),{name:`history`})]),_:1},8,[`aria-label`])]),results:l(()=>[f(`p`,P,_(D.value),1),r(d(O),null,{default:l(()=>[(c(!0),n(p,null,s(E.value,e=>(c(),v(d(k),{key:e,headline:e,interactive:``,onClick:t=>I(e)},{leading:l(()=>[r(d(S),{name:g.value?`mail`:`history`},null,8,[`name`])]),_:1},8,[`headline`,`onClick`]))),128))]),_:1})]),_:1},8,[`query`,`open`,`appearance`,`layout`,`label`,`hint`,`back-label`,`clear-label`,`status`]),f(`h2`,null,_(m.value.inbox),1),f(`div`,F,[(c(!0),n(p,null,s(m.value.cards,e=>(c(),n(`article`,{key:e},_(e),1))),128))])])]))}})})))()}var R;function z(){return(z=e((()=>{L(),E(),R=D(I,[[`__scopeId`,`data-v-c57447a5`]]),I.__docgenInfo=Object.assign({displayName:I.name??I.__name},{exportName:`default`,displayName:`SearchExample`,description:``,tags:{},props:[{name:`appearance`,type:{name:`SearchAppearance`},defaultValue:{func:!1,value:`'contained'`}},{name:`layout`,type:{name:`SearchLayout`},defaultValue:{func:!1,value:`'auto'`}},{name:`locale`,type:{name:`string`},defaultValue:{func:!1,value:`'en-US'`}},{name:`initialOpen`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`externalTrigger`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/search/SearchExample.vue`]})})))()}var B=t({AdaptiveContained:()=>H,DockedContained:()=>U,DockedDivided:()=>G,FullScreenContained:()=>W,FullScreenDivided:()=>K,InitiallyOpen:()=>J,ProgrammaticOpen:()=>q,__namedExportsOrder:()=>Y,default:()=>V}),V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{T(),z(),V={title:`Components/M3Search`,component:w,args:{appearance:`contained`,layout:`auto`,query:``,open:!1,label:`Search your messages`,status:``},argTypes:{appearance:{control:`select`,options:[`contained`,`divided`]},layout:{control:`select`,options:[`auto`,`full-screen`,`docked`]}},render:(e,{globals:t})=>({components:{SearchExample:R},setup:()=>({appearance:e.appearance,layout:e.layout,locale:t.locale}),template:`<SearchExample :appearance="appearance" :layout="layout" :locale="locale" />`}),parameters:{layout:`fullscreen`}},H={},U={args:{layout:`docked`}},W={args:{layout:`full-screen`}},G={args:{layout:`docked`,appearance:`divided`}},K={args:{layout:`full-screen`,appearance:`divided`}},q={render:(e,{globals:t})=>({components:{SearchExample:R},setup:()=>({appearance:e.appearance,layout:e.layout,locale:t.locale}),template:`<SearchExample :appearance="appearance" :layout="layout" :locale="locale" external-trigger />`})},J={render:(e,{globals:t})=>({components:{SearchExample:R},setup:()=>({appearance:e.appearance,layout:e.layout,locale:t.locale}),template:`<SearchExample :appearance="appearance" :layout="layout" :locale="locale" initial-open />`})},Y=[`AdaptiveContained`,`DockedContained`,`FullScreenContained`,`DockedDivided`,`FullScreenDivided`,`ProgrammaticOpen`,`InitiallyOpen`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'docked'
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'full-screen'
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'docked',
    appearance: 'divided'
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'full-screen',
    appearance: 'divided'
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: (args: Record<string, unknown>, {
    globals
  }) => ({
    components: {
      SearchExample
    },
    setup: () => ({
      appearance: args.appearance,
      layout: args.layout,
      locale: globals.locale
    }),
    template: '<SearchExample :appearance="appearance" :layout="layout" :locale="locale" external-trigger />'
  })
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: (args: Record<string, unknown>, {
    globals
  }) => ({
    components: {
      SearchExample
    },
    setup: () => ({
      appearance: args.appearance,
      layout: args.layout,
      locale: globals.locale
    }),
    template: '<SearchExample :appearance="appearance" :layout="layout" :locale="locale" initial-open />'
  })
}`,...J.parameters?.docs?.source}}}})))()}export{X as n,B as t};