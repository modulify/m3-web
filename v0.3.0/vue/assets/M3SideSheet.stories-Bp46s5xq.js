import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,F as i,O as a,P as o,S as s,V as c,W as l,X as ee,Y as u,Z as d,a as f,at as p,b as m,i as h,nt as g,q as te,s as _,st as ne,x as re,y as v}from"./iframe-DlP_3VDG.js";import{n as ie,t as y}from"./animation-CD0k-O-z.js";import{n as b,t as x}from"./id-DkFC80RS.js";import{n as S,t as C}from"./timing-W3FZiEgd.js";import{n as w,t as T}from"./button-DcVEi8uC.js";import{n as E,t as D}from"./icon-BHYZNUrK.js";import{d as O,n as k,o as A,s as j,t as M}from"./predicates-BWeCcKiY.js";import{r as N,t as P}from"./values-Crncwu8i.js";import{n as ae,t as F}from"./surface-BQpxBvQH.js";import{n as I,t as L}from"./scroll-rail-hgoZxSSH.js";var R,z,B,V,H,U;function W(){return(W=e((()=>{_(),j(),k(),N(),T(),L(),F(),y(),x(),C(),R={key:0,class:`m3-side-sheet__affordance`},z=[`id`],B={class:`m3-side-sheet__affordance`},V={class:`m3-side-sheet__content`},H={key:0,class:`m3-side-sheet__footer`},U=a({__name:`M3SideSheet`,props:{id:{type:String,validator:M(O,A),default:void 0},shown:{type:Boolean,default:!1},docked:{type:Boolean,default:!1}},emits:[`update:shown`],setup(e,{emit:t}){let a=P.long2,f=P[`extra-long2`],h=e,_=t,y=te(),x=u(),C=b(`m3-side-sheet`,v(()=>h.id)),T=g(h.shown),E=g(`idle`),D=ie(),O=S(()=>E.value=`idle`,a),k=S(()=>{T.value=!1,E.value=`idle`},f),A=v(()=>({"m3-side-sheet":!0,"m3-side-sheet_docked":h.docked,"m3-transition-slide-right-enter":E.value===`pre-enter`,"m3-transition-slide-right-leave-to":E.value===`exiting`})),j=v(()=>({"m3-side-sheet__header":!0,"m3-side-sheet__header_has-leading-affordance":`affordance`in x})),M=v(()=>!h.docked&&h.shown&&E.value!==`pre-enter`),N=v(()=>({...y,...`aria-label`in y||`aria-labelledby`in y?{}:{"aria-labelledby":C.value+`-title`},...`aria-modal`in y||!h.docked?{}:{"aria-modal":`false`}}));function F(){D.cancel(),O.cancel(),k.cancel()}async function L(){F(),T.value=!0,E.value=`pre-enter`,await i(),D.request(()=>{E.value=`entering`,O.schedule()})}async function U(){if(!T.value){E.value=`idle`;return}F(),E.value=`pre-exit`,await i(),D.request(()=>{E.value=`exiting`,k.schedule()})}return ee(()=>h.shown,e=>{e?L():U()},{immediate:!0}),(t,i)=>T.value?(c(),re(p(ae),o({key:0,id:p(C),shown:!0,"scrim-shown":M.value,"fill-width":!1,"fill-height":!0,width:e.docked?256:void 0,"min-width":e.docked?256:320,"max-width":e.docked?256:400,"rounding-top-left":e.docked?0:16,"rounding-bottom-left":e.docked?0:16,"rounding-top-right":0,"rounding-bottom-right":0,"transition-ms":p(a),elevation:0,class:A.value,role:`dialog`,tag:`div`,mode:`modal`,anchor:`end`,overflow:`hidden`,variant:`surface-container-low`},N.value,{"onUpdate:shown":i[1]||=e=>_(`update:shown`,e)}),{default:d(()=>[m(`header`,{class:ne(j.value)},[`affordance`in t.$slots?(c(),n(`div`,R,[l(t.$slots,`affordance`)])):s(``,!0),m(`div`,{id:p(C)+`-title`,class:`m3-side-sheet__title`},[l(t.$slots,`title`)],8,z),m(`div`,B,[r(p(w),{appearance:`standard`,width:`medium`,onClick:i[0]||=e=>_(`update:shown`,!1)},{default:d(()=>[l(t.$slots,`close-icon`)]),_:3})])],2),m(`div`,V,[r(p(I)),l(t.$slots,`default`)]),`footer`in t.$slots?(c(),n(`footer`,H,[l(t.$slots,`footer`)])):s(``,!0)]),_:3},16,[`id`,`scrim-shown`,`width`,`min-width`,`max-width`,`rounding-top-left`,`rounding-bottom-left`,`transition-ms`,`class`])):s(``,!0)}})})))()}var G;function K(){return(K=e((()=>{W(),G=U,U.__docgenInfo=Object.assign({displayName:U.name??U.__name},{exportName:`default`,displayName:`M3SideSheet`,description:``,tags:{},props:[{name:`id`,type:{name:`string`},defaultValue:{func:!1,value:`undefined`}},{name:`shown`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`docked`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],events:[{name:`update:shown`}],slots:[{name:`affordance`},{name:`title`},{name:`close-icon`},{name:`default`},{name:`footer`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/side-sheet/M3SideSheet.vue`]})})))()}function q(){return(q=e((()=>{K()})))()}var oe=t({Docked:()=>Z,Standard:()=>X,__namedExportsOrder:()=>Q,default:()=>Y}),J,Y,X,Z,Q;function $(){return($=e((()=>{_(),T(),D(),q(),h(),J=`
    <M3Button @click="shown = true">
        {{ text.open }}
    </M3Button>

    <M3SideSheet
        v-bind="args"
        :shown="shown"
        @update:shown="shown = $event"
    >
        <template #title>
            {{ text.filter }}
        </template>

        <template #close-icon>
            <M3Icon name="close" />
        </template>

        <p class="m-4">{{ text.body }}</p>

        <template #footer>
            <div class="p-4">{{ text.footer }}</div>
        </template>
    </M3SideSheet>
`,Y={title:`Components/M3SideSheet`,component:G,argTypes:{shown:{control:!1}},args:{docked:!1},render:(e,{globals:t})=>({components:{M3Button:w,M3Icon:E,M3SideSheet:G},setup(){return{args:e,shown:g(!1),text:f(t.locale,{"en-US":{body:`Choose filters and apply changes.`,filter:`Filters`,footer:`Footer actions`,open:`Open side sheet`},"ru-RU":{body:`Выберите фильтры и примените изменения.`,filter:`Фильтры`,footer:`Действия`,open:`Открыть боковую панель`}})}},template:J}),parameters:{layout:`centered`}},X={},Z={args:{docked:!0}},Q=[`Standard`,`Docked`],X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    docked: true
  }
}`,...Z.parameters?.docs?.source}}}})))()}export{$ as n,oe as t};