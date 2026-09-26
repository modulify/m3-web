import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{B as n,C as r,H as ee,L as i,O as te,P as a,Q as o,S as s,U as ne,W as c,Y as l,_ as u,et as d,g as re,h as f,k as p,m,n as h,v as g}from"./iframe-DqoEP6-3.js";import{n as ie,t as _}from"./animation-CYOvLf6R.js";import{n as v,t as y}from"./button-C5ZOfJIb.js";import{i as b,t as x}from"./icon-BzqhEXMj.js";import{d as S,n as C,o as w,s as T,t as E}from"./predicates-Fn35WtiC.js";import{n as ae,t as D}from"./id-8ELSJK95.js";import{n as O,t as k}from"./icon-button-DfGrghLx.js";import{c as A,n as oe,o as se,t as j}from"./surface-JSn1WMio.js";import{n as M,t as N}from"./timing-BO2_JGQX.js";import{n as P,t as F}from"./scroll-rail-6re0x3ry.js";var I,L,R,z,B,V,H;function U(){return(U=e((()=>{h(),T(),C(),A(),k(),F(),j(),_(),D(),N(),I={key:0,class:`m3-side-sheet__affordance`},L=[`id`],R={class:`m3-side-sheet__affordance`},z={class:`m3-side-sheet__content`},B={key:0,class:`m3-side-sheet__footer`},V=1e3,H=r({__name:`M3SideSheet`,props:{id:{type:String,validator:E(S,w),default:void 0},shown:{type:Boolean,default:!1},docked:{type:Boolean,default:!1}},emits:[`update:shown`],setup(e,{emit:t}){let r=se[`extra-long2`],h=e,_=t,v=n(),y=ee(),b=ae(`m3-side-sheet`,m(()=>h.id)),x=l(h.shown),S=l(`idle`),C=ie(),w=M(()=>S.value=`idle`,r),T=M(()=>{x.value=!1,S.value=`idle`},r),E=m(()=>({"m3-side-sheet":!0,"m3-side-sheet_docked":h.docked,"m3-transition-slide-right-enter":S.value===`pre-enter`||S.value===`entering`,"m3-transition-slide-right-enter-active":S.value===`entering`,"m3-transition-slide-right-leave-active":S.value===`pre-exit`||S.value===`exiting`,"m3-transition-slide-right-leave-to":S.value===`exiting`})),D=m(()=>({"m3-side-sheet__header":!0,"m3-side-sheet__header_has-leading-affordance":`affordance`in y})),k=m(()=>!h.docked&&h.shown&&S.value!==`pre-enter`),A=m(()=>({...v,...`aria-label`in v||`aria-labelledby`in v?{}:{"aria-labelledby":b.value+`-title`},...`aria-modal`in v||!h.docked?{}:{"aria-modal":`false`}}));function j(){C.cancel(),w.cancel(),T.cancel()}async function N(){j(),x.value=!0,S.value=`pre-enter`,await p(),C.request(()=>{S.value=`entering`,w.schedule()})}async function F(){if(!x.value){S.value=`idle`;return}j(),S.value=`pre-exit`,await p(),C.request(()=>{S.value=`exiting`,T.schedule()})}return ne(()=>h.shown,e=>{e?N():F()},{immediate:!0}),(t,n)=>x.value?(a(),re(o(oe),te({key:0,id:o(b),shown:!0,"scrim-shown":k.value,"fill-width":!1,"fill-height":!0,width:e.docked?256:void 0,"min-width":e.docked?256:320,"max-width":e.docked?256:400,"z-index":V,"rounding-top-left":e.docked?0:16,"rounding-bottom-left":e.docked?0:16,"rounding-top-right":0,"rounding-bottom-right":0,elevation:0,class:E.value,role:`dialog`,tag:`div`,mode:`modal`,anchor:`end`,overflow:`hidden`,variant:`surface-container-low`},A.value,{"onUpdate:shown":n[1]||=e=>_(`update:shown`,e)}),{default:c(()=>[f(`header`,{class:d(D.value)},[`affordance`in t.$slots?(a(),g(`div`,I,[i(t.$slots,`affordance`)])):u(``,!0),f(`div`,{id:o(b)+`-title`,class:`m3-side-sheet__title`},[i(t.$slots,`title`)],8,L),f(`div`,R,[s(o(O),{onClick:n[0]||=e=>_(`update:shown`,!1)},{default:c(()=>[i(t.$slots,`close-icon`)]),_:3})])],2),f(`div`,z,[s(o(P)),i(t.$slots,`default`)]),`footer`in t.$slots?(a(),g(`footer`,B,[i(t.$slots,`footer`)])):u(``,!0)]),_:3},16,[`id`,`scrim-shown`,`width`,`min-width`,`max-width`,`rounding-top-left`,`rounding-bottom-left`,`class`])):u(``,!0)}})})))()}var W;function G(){return(G=e((()=>{U(),W=H,H.__docgenInfo=Object.assign({displayName:H.name??H.__name},{exportName:`default`,displayName:`M3SideSheet`,description:``,tags:{},props:[{name:`id`,type:{name:`string`},defaultValue:{func:!1,value:`undefined`}},{name:`shown`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`docked`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],events:[{name:`update:shown`}],slots:[{name:`affordance`},{name:`title`},{name:`close-icon`},{name:`default`},{name:`footer`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/side-sheet/M3SideSheet.vue`]})})))()}function K(){return(K=e((()=>{G()})))()}var q=t({Docked:()=>Z,Standard:()=>X,__namedExportsOrder:()=>Q,default:()=>Y}),J,Y,X,Z,Q;function $(){return($=e((()=>{h(),y(),x(),K(),J=`
    <M3Button @click="shown = true">
        Open side sheet
    </M3Button>

    <M3SideSheet
        v-bind="args"
        :shown="shown"
        @update:shown="shown = $event"
    >
        <template #title>
            Filters
        </template>

        <template #close-icon>
            <M3Icon name="close" />
        </template>

        <p class="m-4">Choose filters and apply changes.</p>

        <template #footer>
            <div class="p-4">Footer actions</div>
        </template>
    </M3SideSheet>
`,Y={title:`Components/M3SideSheet`,component:W,argTypes:{shown:{control:!1}},args:{docked:!1},render:e=>({components:{M3Button:v,M3Icon:b,M3SideSheet:W},setup(){return{args:e,shown:l(!1)}},template:J}),parameters:{layout:`centered`}},X={},Z={args:{docked:!0}},Q=[`Standard`,`Docked`],X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    docked: true
  }
}`,...Z.parameters?.docs?.source}}}})))()}export{$ as n,q as t};