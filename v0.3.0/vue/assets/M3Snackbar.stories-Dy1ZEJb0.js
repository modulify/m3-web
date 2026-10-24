import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,E as i,O as a,S as o,V as s,Z as c,a as l,at as u,b as d,g as f,i as p,j as ee,lt as m,nt as h,s as g,st as te,ut as _,x as v,y}from"./iframe-DlP_3VDG.js";import{n as b,t as x}from"./button-DcVEi8uC.js";import{n as S,t as C}from"./icon-BHYZNUrK.js";import{i as ne,n as w,t as T}from"./navigation-BlrLl-oC.js";import{n as re,t as E}from"./fab-button-CZSz7VEj.js";import{i as D,n as O,r as k,t as A}from"./M3SnackbarHost-CghYq1kD.js";function j(){return(j=e((()=>{D(),O()})))()}var M,N,P,F,I;function L(){return(L=e((()=>{g(),x(),E(),C(),T(),j(),p(),M={class:`flex-row flex-wrap gap-4`},N={key:3,role:`status`},P=6e3,F=4e3,I=a({__name:`SnackbarInteraction`,props:{scenario:{type:String,required:!0},locale:{type:String,default:`en-US`}},setup(e){let t={"en-US":{feedback:`Save changes`,saved:`Saved`,savedMessage:`Changes saved`,archive:`Archive email`,archived:`Email archived`,action:`Undo`,close:`Close notification`,queue:`Queue two updates`,replace:`Replace with latest update`,first:`Uploading photo`,second:`Photo uploaded`,inbox:`Inbox`,browse:`Browse`,library:`Library`,compose:`Compose`},"ru-RU":{feedback:`Сохранить изменения`,saved:`Сохранено`,savedMessage:`Изменения сохранены`,archive:`Архивировать письмо`,archived:`Письмо архивировано`,action:`Отменить`,close:`Закрыть уведомление`,queue:`Поставить два сообщения в очередь`,replace:`Заменить новым сообщением`,first:`Загружаем фото`,second:`Фото загружено`,inbox:`Входящие`,browse:`Обзор`,library:`Библиотека`,compose:`Создать`}},a=e,p=h(null),g=h(``),x=y(()=>l(a.locale,t)),C=({buttonProps:e})=>ee(b,e,()=>x.value.action),T=()=>{g.value=x.value.saved,p.value?.show({message:x.value.savedMessage,duration:P,closeLabel:x.value.close})},E=()=>{g.value=x.value.archived,p.value?.show({message:x.value.archived,closeLabel:x.value.close}).then(e=>{e===`action`&&(g.value=``)})},D=()=>{p.value?.show({message:x.value.first,duration:F,closeLabel:x.value.close}),p.value?.show({message:x.value.second,duration:F,closeLabel:x.value.close})},O=()=>{p.value?.replace({message:x.value.second,duration:F,closeLabel:x.value.close})};return(t,a)=>(s(),n(`div`,null,[e.scenario===`navigation`?(s(),v(u(ne),{key:0,appearance:`bar`},{default:c(()=>[r(u(w),{label:x.value.inbox,active:``},{default:c(()=>[r(u(S),{name:`inbox`})]),_:1},8,[`label`]),r(u(w),{label:x.value.browse},{default:c(()=>[r(u(S),{name:`explore`})]),_:1},8,[`label`]),r(u(w),{label:x.value.library},{default:c(()=>[r(u(S),{name:`library_music`})]),_:1},8,[`label`])]),_:1})):o(``,!0),d(`main`,{class:te([{"m3-has-navigation":e.scenario===`navigation`},`p-8`]),style:m({minHeight:e.scenario===`navigation`?`100vh`:`360px`,background:`var(--m3-sys-surface)`})},[d(`div`,M,[e.scenario===`feedback`||e.scenario===`navigation`?(s(),v(u(b),{key:0,onClick:T},{default:c(()=>[i(_(x.value.feedback),1)]),_:1})):o(``,!0),e.scenario===`undo`?(s(),v(u(b),{key:1,onClick:E},{default:c(()=>[i(_(x.value.archive),1)]),_:1})):o(``,!0),e.scenario===`queue`?(s(),n(f,{key:2},[r(u(b),{onClick:D},{default:c(()=>[i(_(x.value.queue),1)]),_:1}),r(u(b),{appearance:`outlined`,onClick:O},{default:c(()=>[i(_(x.value.replace),1)]),_:1})],64)):o(``,!0),g.value?(s(),n(`span`,N,_(g.value),1)):o(``,!0)]),r(u(A),{ref_key:`host`,ref:p,"render-action":e.scenario===`undo`?C:void 0,style:m(e.scenario===`navigation`?{"--m3-snackbar-inset-block-end":`calc(64px + 96px)`}:void 0)},null,8,[`render-action`,`style`]),e.scenario===`navigation`?(s(),v(u(re),{key:0,style:{position:`fixed`,insetInlineEnd:`24px`,insetBlockEnd:`calc(64px + 16px)`},variant:`tertiary`},{default:c(()=>[r(u(S),{name:`edit`}),i(_(x.value.compose),1)]),_:1})):o(``,!0)],6)]))}})})))()}var R;function z(){return(z=e((()=>{L(),R=I,I.__docgenInfo=Object.assign({displayName:I.name??I.__name},{exportName:`default`,displayName:`SnackbarInteraction`,description:``,tags:{},props:[{name:`scenario`,values:[`feedback`,`undo`,`queue`,`navigation`],type:{name:`string`},required:!0},{name:`locale`,type:{name:`string`},defaultValue:{func:!1,value:`'en-US'`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/snackbar/SnackbarInteraction.vue`]})})))()}var B=t({InlineFeedback:()=>J,LongAction:()=>K,QueueAndReplace:()=>X,SingleLine:()=>U,TwoLines:()=>G,UndoAction:()=>Y,WithAction:()=>W,WithNavigationAndFab:()=>Z,__namedExportsOrder:()=>Q,default:()=>H}),V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{x(),j(),p(),z(),V={"en-US":{saved:`Changes saved`,archived:`Email archived`,action:`Undo`,close:`Close notification`,duplicate:`The item already has the label “travel.” Add a new label.`,long:`Add a new label`},"ru-RU":{saved:`Изменения сохранены`,archived:`Письмо архивировано`,action:`Отменить`,close:`Закрыть уведомление`,duplicate:`У элемента уже есть метка «путешествие». Добавьте другую метку.`,long:`Добавить новую метку`}},H={title:`Components/M3Snackbar`,component:k,args:{message:`Email archived`},parameters:{layout:`fullscreen`}},U={render:(e,{globals:t})=>({components:{M3Snackbar:k},setup:()=>({text:l(t.locale,V)}),template:`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar :message="text.saved" />
        </div>
    `})},W={render:(e,{globals:t})=>({components:{M3Button:b,M3Snackbar:k},setup:()=>({text:l(t.locale,V)}),template:`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar :message="text.archived" :close-label="text.close" closable>
                <template #action="{ buttonProps }">
                    <M3Button v-bind="buttonProps">{{ text.action }}</M3Button>
                </template>
            </M3Snackbar>
        </div>
    `})},G={render:(e,{globals:t})=>({components:{M3Snackbar:k},setup:()=>({text:l(t.locale,V)}),template:`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar :message="text.duplicate" style="max-inline-size:336px" />
        </div>
    `})},K={render:(e,{globals:t})=>({components:{M3Button:b,M3Snackbar:k},setup:()=>({text:l(t.locale,V)}),template:`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar
                :message="text.duplicate"
                :close-label="text.close"
                layout="stacked"
                closable
                style="max-inline-size:336px"
            >
                <template #action="{ buttonProps }">
                    <M3Button v-bind="buttonProps">{{ text.long }}</M3Button>
                </template>
            </M3Snackbar>
        </div>
    `})},q=(e,t)=>({components:{SnackbarInteraction:R},setup:()=>({locale:t,scenario:e}),template:`<SnackbarInteraction :scenario="scenario" :locale="locale" />`}),J={render:(e,{globals:t})=>q(`feedback`,t.locale)},Y={render:(e,{globals:t})=>q(`undo`,t.locale)},X={render:(e,{globals:t})=>q(`queue`,t.locale)},Z={render:(e,{globals:t})=>q(`navigation`,t.locale)},Q=[`SingleLine`,`WithAction`,`TwoLines`,`LongAction`,`InlineFeedback`,`UndoAction`,`QueueAndReplace`,`WithNavigationAndFab`],U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Snackbar
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar :message="text.saved" />
        </div>
    \`
  })
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Snackbar
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar :message="text.archived" :close-label="text.close" closable>
                <template #action="{ buttonProps }">
                    <M3Button v-bind="buttonProps">{{ text.action }}</M3Button>
                </template>
            </M3Snackbar>
        </div>
    \`
  })
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Snackbar
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar :message="text.duplicate" style="max-inline-size:336px" />
        </div>
    \`
  })
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Snackbar
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="padding:clamp(16px,4vw,32px)">
            <M3Snackbar
                :message="text.duplicate"
                :close-label="text.close"
                layout="stacked"
                closable
                style="max-inline-size:336px"
            >
                <template #action="{ buttonProps }">
                    <M3Button v-bind="buttonProps">{{ text.long }}</M3Button>
                </template>
            </M3Snackbar>
        </div>
    \`
  })
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => interaction('feedback', globals.locale)
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => interaction('undo', globals.locale)
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => interaction('queue', globals.locale)
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => interaction('navigation', globals.locale)
}`,...Z.parameters?.docs?.source}}}})))()}export{$ as n,B as t};