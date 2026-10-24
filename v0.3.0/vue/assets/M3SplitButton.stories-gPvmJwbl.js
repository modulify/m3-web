import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,O as i,V as a,W as o,X as s,Z as c,a as l,at as u,b as d,g as f,i as p,m,nt as h,s as g,st as _,tt as v}from"./iframe-DlP_3VDG.js";import{n as y,t as b}from"./id-DkFC80RS.js";import{n as x,t as S}from"./button-DcVEi8uC.js";import{n as C,t as w}from"./icon-BHYZNUrK.js";import{d as T,n as E,o as D,s as O,t as k}from"./predicates-BWeCcKiY.js";import{i as A,n as j,t as M}from"./menu-O0SEVzFG.js";var N,P;function F(){return(F=e((()=>{g(),O(),E(),S(),w(),M(),b(),N=[`id`],P=i({__name:`M3SplitButton`,props:{id:{type:null,validator:k(T,D),default:void 0},appearance:{type:String,default:`filled`},size:{type:String,default:`sm`},menuLabel:{type:String,required:!0},open:{type:Boolean,default:void 0},disabled:{type:Boolean,default:!1}},emits:[`action`,`toggle`,`update:open`],setup(e,{expose:t,emit:i}){let l=e,p=i,g=y(`m3-split-button`,()=>l.id),b=h(null),S=h(null),w=h(null),T=v({open:l.open??!1});s(()=>l.open,e=>{e!==void 0&&e!==T.open&&(T.open=e)});let E=e=>{T.open=e,p(`update:open`,e),p(`toggle`,e)};return t({get el(){return b.value}}),(t,i)=>(a(),n(f,null,[d(`div`,{id:u(g),ref_key:`root`,ref:b,class:_({"m3-split-button":!0,[`m3-split-button_`+e.size]:!0,"m3-split-button_open":T.open&&!e.disabled}),role:`group`},[d(`span`,{class:`m3-split-button__segment`,onClick:i[1]||=m(t=>!e.disabled&&S.value?.click(),[`self`])},[r(u(x),{ref_key:`main`,ref:S,appearance:e.appearance,size:e.size,disabled:e.disabled,class:`m3-split-button__main`,onClick:i[0]||=e=>t.$emit(`action`,e)},{default:c(()=>[o(t.$slots,`default`)]),_:3},8,[`appearance`,`size`,`disabled`])]),d(`span`,{class:`m3-split-button__segment`,onClick:i[2]||=m(t=>!e.disabled&&w.value?.click(),[`self`])},[r(u(x),{ref_key:`trailing`,ref:w,appearance:e.appearance,size:e.size,disabled:e.disabled,"aria-label":e.menuLabel,"aria-expanded":T.open&&!e.disabled,"aria-controls":u(g)+`-menu`,class:`m3-split-button__trailing`,"aria-haspopup":`menu`},{default:c(()=>[r(u(C),{name:`expand_more`})]),_:1},8,[`appearance`,`size`,`disabled`,`aria-label`,`aria-expanded`,`aria-controls`])])],10,N),r(u(A),{id:u(g)+`-menu`,target:()=>w.value?.el??null,shown:T.open,disabled:e.disabled,"offset-main-axis":4,placement:`bottom-end`,"onUpdate:shown":E},{default:c(()=>[o(t.$slots,`menu`,{close:()=>E(!1)})]),_:3},8,[`id`,`target`,`shown`,`disabled`])],64))}})})))()}var I;function L(){return(L=e((()=>{F(),I=P,P.__docgenInfo=Object.assign({displayName:P.name??P.__name},{exportName:`default`,displayName:`M3SplitButton`,description:``,tags:{},props:[{name:`id`,type:{name:`string | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`appearance`,type:{name:`Appearance`},defaultValue:{func:!1,value:`'filled'`}},{name:`size`,type:{name:`Size`},defaultValue:{func:!1,value:`'sm'`}},{name:`menuLabel`,type:{name:`string`},required:!0},{name:`open`,type:{name:`boolean | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`disabled`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],events:[{name:`action`,type:{names:[`MouseEvent`]}},{name:`toggle`,type:{names:[`boolean`]}},{name:`update:open`,type:{names:[`boolean`]}}],slots:[{name:`default`},{name:`menu`,scoped:!0,bindings:[{name:`close`,title:`binding`}]}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/split-button/M3SplitButton.vue`]})})))()}function R(){return(R=e((()=>{L()})))()}var z=t({Elevated:()=>U,ExtraLarge:()=>q,Filled:()=>H,Medium:()=>K,Open:()=>J,Outlined:()=>G,Tonal:()=>W,__namedExportsOrder:()=>Y,default:()=>V}),B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{w(),M(),R(),p(),B={"en-US":{send:`Send`,more:`More sending options`,schedule:`Schedule send`,draft:`Save draft`},"ru-RU":{send:`Отправить`,more:`Другие варианты отправки`,schedule:`Запланировать отправку`,draft:`Сохранить черновик`}},V={title:`Components/M3SplitButton`,component:I,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`tonal`,`outlined`,`standard`,`text`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},open:{control:!1}},args:{appearance:`filled`,size:`sm`,menuLabel:`More sending options`},render:(e,{globals:t})=>({components:{M3SplitButton:I,M3Icon:C,M3MenuItem:j},setup(){return{args:e,text:l(t.locale,B)}},template:`
        <div class="p-8" style="min-height: 240px">
            <M3SplitButton v-bind="args" :menu-label="text.more">
                <M3Icon name="send" />{{ text.send }}
                <template #menu="{ close }">
                    <M3MenuItem @click="close">{{ text.schedule }}</M3MenuItem>
                    <M3MenuItem @click="close">{{ text.draft }}</M3MenuItem>
                </template>
            </M3SplitButton>
        </div>
    `}),parameters:{layout:`centered`}},H={},U={args:{appearance:`elevated`}},W={args:{appearance:`tonal`}},G={args:{appearance:`outlined`}},K={args:{size:`md`}},q={args:{size:`xl`}},J={args:{open:!0}},Y=[`Filled`,`Elevated`,`Tonal`,`Outlined`,`Medium`,`ExtraLarge`,`Open`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'elevated'
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'tonal'
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'outlined'
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'xl'
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    open: true
  }
}`,...J.parameters?.docs?.source}}}})))()}export{K as a,W as c,z as i,X as l,q as n,J as o,H as r,G as s,U as t};