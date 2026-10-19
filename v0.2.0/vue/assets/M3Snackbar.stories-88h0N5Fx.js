import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{B as n,C as r,D as i,E as a,O as o,S as s,X as c,a as l,b as u,ct as d,g as f,i as p,it as m,j as ee,lt as h,ot as g,s as _,tt as v,x as y,y as te}from"./iframe-B19RV9Pc.js";import{i as b,t as x}from"./icon-BVQ8SObm.js";import{i as S,n as C,t as w}from"./navigation-D9b7VcxV.js";import{n as T,t as E}from"./button-BHBfLLh5.js";import{n as ne,t as D}from"./fab-button-ck8J0kJ5.js";import{i as O,n as k,r as A,t as re}from"./M3SnackbarHost-CFKSvTp4.js";function j(){return(j=e((()=>{O(),k()})))()}var M,N,P,F,I;function L(){return(L=e((()=>{_(),E(),D(),x(),w(),j(),p(),M={style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`center`}},N={key:3,role:`status`},P=6e3,F=4e3,I=o({__name:`SnackbarInteraction`,props:{scenario:{type:String,required:!0},locale:{type:String,default:`en-US`}},setup(e){let t={"en-US":{feedback:`Save changes`,saved:`Saved`,savedMessage:`Changes saved`,archive:`Archive email`,archived:`Email archived`,action:`Undo`,close:`Close notification`,queue:`Queue two updates`,replace:`Replace with latest update`,first:`Uploading photo`,second:`Photo uploaded`,inbox:`Inbox`,browse:`Browse`,library:`Library`,compose:`Compose`},"ru-RU":{feedback:`Сохранить изменения`,saved:`Сохранено`,savedMessage:`Изменения сохранены`,archive:`Архивировать письмо`,archived:`Письмо архивировано`,action:`Отменить`,close:`Закрыть уведомление`,queue:`Поставить два сообщения в очередь`,replace:`Заменить новым сообщением`,first:`Загружаем фото`,second:`Фото загружено`,inbox:`Входящие`,browse:`Обзор`,library:`Библиотека`,compose:`Создать`}},o=e,p=v(null),_=v(``),x=te(()=>l(o.locale,t)),w=({buttonProps:e})=>ee(T,e,()=>x.value.action),E=()=>{_.value=x.value.saved,p.value?.show({message:x.value.savedMessage,duration:P,closeLabel:x.value.close})},D=()=>{_.value=x.value.archived,p.value?.show({message:x.value.archived,closeLabel:x.value.close}).then(e=>{e===`action`&&(_.value=``)})},O=()=>{p.value?.show({message:x.value.first,duration:F,closeLabel:x.value.close}),p.value?.show({message:x.value.second,duration:F,closeLabel:x.value.close})},k=()=>{p.value?.replace({message:x.value.second,duration:F,closeLabel:x.value.close})};return(t,o)=>(n(),r(`div`,null,[e.scenario===`navigation`?(n(),y(m(S),{key:0,appearance:`bar`},{default:c(()=>[i(m(C),{label:x.value.inbox,active:``},{default:c(()=>[i(m(b),{name:`inbox`})]),_:1},8,[`label`]),i(m(C),{label:x.value.browse},{default:c(()=>[i(m(b),{name:`explore`})]),_:1},8,[`label`]),i(m(C),{label:x.value.library},{default:c(()=>[i(m(b),{name:`library_music`})]),_:1},8,[`label`])]),_:1})):s(``,!0),u(`main`,{class:g({"m3-has-navigation":e.scenario===`navigation`}),style:d({minHeight:e.scenario===`navigation`?`100vh`:`360px`,padding:`32px`,background:`var(--m3-sys-surface)`})},[u(`div`,M,[e.scenario===`feedback`||e.scenario===`navigation`?(n(),y(m(T),{key:0,onClick:E},{default:c(()=>[a(h(x.value.feedback),1)]),_:1})):s(``,!0),e.scenario===`undo`?(n(),y(m(T),{key:1,onClick:D},{default:c(()=>[a(h(x.value.archive),1)]),_:1})):s(``,!0),e.scenario===`queue`?(n(),r(f,{key:2},[i(m(T),{onClick:O},{default:c(()=>[a(h(x.value.queue),1)]),_:1}),i(m(T),{appearance:`outlined`,onClick:k},{default:c(()=>[a(h(x.value.replace),1)]),_:1})],64)):s(``,!0),_.value?(n(),r(`span`,N,h(_.value),1)):s(``,!0)]),i(m(re),{ref_key:`host`,ref:p,"render-action":e.scenario===`undo`?w:void 0,style:d(e.scenario===`navigation`?{"--m3-snackbar-inset-block-end":`calc(64px + 96px)`}:void 0)},null,8,[`render-action`,`style`]),e.scenario===`navigation`?(n(),y(m(ne),{key:0,style:{position:`fixed`,insetInlineEnd:`24px`,insetBlockEnd:`calc(64px + 16px)`},variant:`tertiary`},{default:c(()=>[i(m(b),{name:`edit`}),a(h(x.value.compose),1)]),_:1})):s(``,!0)],6)]))}})})))()}var R;function z(){return(z=e((()=>{L(),R=I,I.__docgenInfo=Object.assign({displayName:I.name??I.__name},{exportName:`default`,displayName:`SnackbarInteraction`,description:``,tags:{},props:[{name:`scenario`,values:[`feedback`,`undo`,`queue`,`navigation`],type:{name:`string`},required:!0},{name:`locale`,type:{name:`string`},defaultValue:{func:!1,value:`'en-US'`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/snackbar/SnackbarInteraction.vue`]})})))()}var B=t({InlineFeedback:()=>J,LongAction:()=>K,QueueAndReplace:()=>X,SingleLine:()=>U,TwoLines:()=>G,UndoAction:()=>Y,WithAction:()=>W,WithNavigationAndFab:()=>Z,__namedExportsOrder:()=>Q,default:()=>H}),V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{E(),j(),p(),z(),V={"en-US":{saved:`Changes saved`,archived:`Email archived`,action:`Undo`,close:`Close notification`,duplicate:`The item already has the label “travel.” Add a new label.`,long:`Add a new label`},"ru-RU":{saved:`Изменения сохранены`,archived:`Письмо архивировано`,action:`Отменить`,close:`Закрыть уведомление`,duplicate:`У элемента уже есть метка «путешествие». Добавьте другую метку.`,long:`Добавить новую метку`}},H={title:`Components/M3Snackbar`,component:A,args:{message:`Email archived`},parameters:{layout:`fullscreen`}},U={render:(e,{globals:t})=>({components:{M3Snackbar:A},setup:()=>({text:l(t.locale,V)}),template:`
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar :message="text.saved" />
      </div>
    `})},W={render:(e,{globals:t})=>({components:{M3Button:T,M3Snackbar:A},setup:()=>({text:l(t.locale,V)}),template:`
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar :message="text.archived" :close-label="text.close" closable>
          <template #action="{ buttonProps }">
            <M3Button v-bind="buttonProps">{{ text.action }}</M3Button>
          </template>
        </M3Snackbar>
      </div>
    `})},G={render:(e,{globals:t})=>({components:{M3Snackbar:A},setup:()=>({text:l(t.locale,V)}),template:`
      <div style="padding:clamp(16px,4vw,32px)">
        <M3Snackbar :message="text.duplicate" style="max-inline-size:336px" />
      </div>
    `})},K={render:(e,{globals:t})=>({components:{M3Button:T,M3Snackbar:A},setup:()=>({text:l(t.locale,V)}),template:`
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