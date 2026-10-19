import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{B as n,C as r,D as i,E as a,H as o,O as s,S as c,X as l,a as u,b as d,g as f,i as p,it as m,lt as h,s as g,tt as _,x as v,y}from"./iframe-B19RV9Pc.js";import{i as b,t as x}from"./icon-BVQ8SObm.js";import{n as S,t as C}from"./icon-button-BbD7efFX.js";import{n as w,t as T}from"./search-B2lgXg6V.js";import{n as E,t as D}from"./_plugin-vue_export-helper-BqBa3wPr.js";import{n as O,t as k}from"./button-BHBfLLh5.js";import{i as A,n as j,t as M}from"./list-BqQLVbiA.js";var N,P,F,I,L,R;function z(){return(z=e((()=>{g(),k(),x(),C(),M(),T(),p(),N={class:`search-example`},P={class:`search-example__content`},F={class:`search-example__header`},I={class:`search-example__section`},L={class:`search-example__grid`},R=s({__name:`SearchExample`,props:{appearance:{type:String,default:`contained`},layout:{type:String,default:`auto`},locale:{type:String,default:`en-US`},initialOpen:{type:Boolean,default:!1},externalTrigger:{type:Boolean,default:!1}},setup(e){let t={"en-US":{heading:`Mail`,hint:`Search your messages`,back:`Back to mail`,clear:`Clear search`,example:`Use a recent query`,open:`Open search programmatically`,recent:`Recent searches`,suggestions:`Suggestions`,results:`Results`,inbox:`Inbox`,cards:[`Planning the next release`,`Notes from yesterday`,`Design review`,`Project status`]},"ru-RU":{heading:`Почта`,hint:`Поиск по сообщениям`,back:`Назад к почте`,clear:`Очистить поиск`,example:`Вставить недавний запрос`,open:`Открыть поиск программно`,recent:`Недавние запросы`,suggestions:`Подсказки`,results:`Результаты`,inbox:`Входящие`,cards:[`План следующего выпуска`,`Заметки за вчера`,`Обзор дизайна`,`Состояние проекта`]}},s=e,p=y(()=>u(s.locale,t)),g=_(``),x=_(s.initialOpen),C=_(!1),T=y(()=>p.value.cards.filter(e=>e.toLocaleLowerCase(s.locale).includes(g.value.toLocaleLowerCase(s.locale)))),E=y(()=>g.value?T.value:p.value.cards.slice(0,3)),D=y(()=>C.value?p.value.results:g.value?p.value.suggestions:p.value.recent),k=y(()=>`${D.value}: ${E.value.length}`),M=e=>{g.value=e,x.value=!1};return(t,s)=>(n(),r(`main`,N,[d(`div`,P,[d(`header`,F,[d(`h1`,null,h(p.value.heading),1),e.externalTrigger?(n(),v(m(O),{key:0,onClick:s[0]||=e=>x.value=!0},{default:l(()=>[a(h(p.value.open),1)]),_:1})):c(``,!0)]),i(m(w),{query:g.value,"onUpdate:query":[s[2]||=e=>g.value=e,s[5]||=e=>C.value=!1],open:x.value,"onUpdate:open":s[3]||=e=>x.value=e,appearance:e.appearance,layout:e.layout,label:p.value.hint,hint:p.value.hint,"back-label":p.value.back,"clear-label":p.value.clear,status:k.value,onSubmit:s[4]||=e=>C.value=!0},{actions:l(()=>[i(m(S),{"aria-label":p.value.example,onClick:s[1]||=e=>g.value=p.value.cards[0]},{default:l(()=>[i(m(b),{name:`history`})]),_:1},8,[`aria-label`])]),results:l(()=>[d(`p`,I,h(D.value),1),i(m(A),null,{default:l(()=>[(n(!0),r(f,null,o(E.value,e=>(n(),v(m(j),{key:e,headline:e,interactive:``,onClick:t=>M(e)},{leading:l(()=>[i(m(b),{name:g.value?`mail`:`history`},null,8,[`name`])]),_:1},8,[`headline`,`onClick`]))),128))]),_:1})]),_:1},8,[`query`,`open`,`appearance`,`layout`,`label`,`hint`,`back-label`,`clear-label`,`status`]),d(`h2`,null,h(p.value.inbox),1),d(`div`,L,[(n(!0),r(f,null,o(p.value.cards,e=>(n(),r(`article`,{key:e},h(e),1))),128))])])]))}})})))()}var B;function V(){return(V=e((()=>{z(),E(),B=D(R,[[`__scopeId`,`data-v-3083e81b`]]),R.__docgenInfo=Object.assign({displayName:R.name??R.__name},{exportName:`default`,displayName:`SearchExample`,description:``,tags:{},props:[{name:`appearance`,type:{name:`SearchAppearance`},defaultValue:{func:!1,value:`'contained'`}},{name:`layout`,type:{name:`SearchLayout`},defaultValue:{func:!1,value:`'auto'`}},{name:`locale`,type:{name:`string`},defaultValue:{func:!1,value:`'en-US'`}},{name:`initialOpen`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`externalTrigger`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/search/SearchExample.vue`]})})))()}var H=t({AdaptiveContained:()=>W,DockedContained:()=>G,DockedDivided:()=>q,FullScreenContained:()=>K,FullScreenDivided:()=>J,InitiallyOpen:()=>X,ProgrammaticOpen:()=>Y,__namedExportsOrder:()=>Z,default:()=>U}),U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{T(),V(),U={title:`Components/M3Search`,component:w,args:{appearance:`contained`,layout:`auto`,query:``,open:!1,label:`Search your messages`,status:``},argTypes:{appearance:{control:`select`,options:[`contained`,`divided`]},layout:{control:`select`,options:[`auto`,`full-screen`,`docked`]}},render:(e,{globals:t})=>({components:{SearchExample:B},setup:()=>({appearance:e.appearance,layout:e.layout,locale:t.locale}),template:`<SearchExample :appearance="appearance" :layout="layout" :locale="locale" />`}),parameters:{layout:`fullscreen`}},W={},G={args:{layout:`docked`}},K={args:{layout:`full-screen`}},q={args:{layout:`docked`,appearance:`divided`}},J={args:{layout:`full-screen`,appearance:`divided`}},Y={render:(e,{globals:t})=>({components:{SearchExample:B},setup:()=>({appearance:e.appearance,layout:e.layout,locale:t.locale}),template:`<SearchExample :appearance="appearance" :layout="layout" :locale="locale" external-trigger />`})},X={render:(e,{globals:t})=>({components:{SearchExample:B},setup:()=>({appearance:e.appearance,layout:e.layout,locale:t.locale}),template:`<SearchExample :appearance="appearance" :layout="layout" :locale="locale" initial-open />`})},Z=[`AdaptiveContained`,`DockedContained`,`FullScreenContained`,`DockedDivided`,`FullScreenDivided`,`ProgrammaticOpen`,`InitiallyOpen`],W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'docked'
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'full-screen'
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'docked',
    appearance: 'divided'
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'full-screen',
    appearance: 'divided'
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}}})))()}export{Q as n,H as t};