import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,L as r,O as i,P as a,Q as o,S as s,Y as c,_ as l,h as u,m as d,n as f,nt as p,v as m,x as h}from"./iframe-DqoEP6-3.js";import{n as g,t as _}from"./ripple-axkc_TDH.js";import{n as v,t as y}from"./button-C5ZOfJIb.js";import{i as b,t as x}from"./icon-BzqhEXMj.js";import{d as S,n as C,o as w,s as T,t as E}from"./predicates-Fn35WtiC.js";import{n as D,t as O}from"./id-8ELSJK95.js";import{n as k,t as A}from"./icon-button-DfGrghLx.js";var j,M,N,P,F,I,L;function R(){return(R=e((()=>{f(),T(),C(),_(),O(),j=[`id`],M={key:0,class:`m3-card__media`},N={class:`m3-card__content`},P={key:0,class:`m3-card__head`},F=[`id`],I={key:1,class:`m3-card__subheading`},L=n({__name:`M3Card`,props:{id:{type:null,validator:E(S,w),default:void 0},appearance:{type:String,default:`filled`},heading:{type:String,default:``},subheading:{type:String,default:``},interactive:{type:Boolean,default:!1},landscape:{type:Boolean,default:!1}},setup(e,{expose:t}){let n=e,f=D(`m3-card`,d(()=>n.id)),_=c(null),v=c(null),y=c(null);return t({get el(){return _.value}}),(t,n)=>(a(),m(`section`,i({id:o(f),ref_key:`root`,ref:_,class:{"m3-card":!0,[`m3-card_`+e.appearance]:!0,"m3-card_interactive":e.interactive,"m3-card_landscape":e.landscape}},{role:`region`,...e.interactive?{tabindex:0}:{},...!(`aria-label`in t.$attrs)&&!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?{"aria-labelledby":o(f)+`-heading`}:{},...t.$attrs},{onClick:n[0]||=t=>e.interactive?y.value?.activate(t):null}),[e.interactive?(a(),m(`div`,{key:0,ref_key:`state`,ref:v,class:`m3-card__state`},[s(o(g),{ref_key:`ripple`,ref:y,owner:c(v.value)},null,8,[`owner`])],512)):l(``,!0),r(t.$slots,`content`,{},()=>[`media`in t.$slots?(a(),m(`div`,M,[r(t.$slots,`media`)])):l(``,!0),u(`div`,N,[`heading`in t.$slots||`subheading`in t.$slots||e.heading.length||e.subheading.length?(a(),m(`div`,P,[`heading`in t.$slots||e.heading.length?(a(),m(`div`,{key:0,id:o(f)+`-heading`,class:`m3-card__heading`},[r(t.$slots,`heading`,{},()=>[h(p(e.heading),1)])],8,F)):l(``,!0),`subheading`in t.$slots||e.subheading.length?(a(),m(`div`,I,[r(t.$slots,`subheading`,{},()=>[h(p(e.subheading),1)])])):l(``,!0)])):l(``,!0),r(t.$slots,`default`)])])],16,j))}})})))()}var z;function B(){return(B=e((()=>{R(),z=L,L.__docgenInfo=Object.assign({displayName:L.name??L.__name},{exportName:`default`,displayName:`M3Card`,description:``,tags:{},props:[{name:`id`,type:{name:`string | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`appearance`,type:{name:`Appearance`},defaultValue:{func:!1,value:`'filled'`}},{name:`heading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`subheading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`interactive`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`landscape`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],slots:[{name:`content`},{name:`media`},{name:`heading`},{name:`subheading`},{name:`default`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/card/M3Card.vue`]})})))()}function V(){return(V=e((()=>{B()})))()}var H=t({AppearanceMatrix:()=>q,Landscape:()=>W,LandscapeWithoutMedia:()=>G,Portrait:()=>K,__namedExportsOrder:()=>J,default:()=>U}),U,W,G,K,q,J;function Y(){return(Y=e((()=>{y(),V(),x(),A(),U={title:`Components/M3Card`,component:z,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]}},args:{appearance:`filled`},render:e=>({components:{M3Button:v,M3Card:z},setup(){return{args:e}},template:`
        <M3Card v-bind="args" landscape>
            <template #media>
                <img alt="" src="/assets/image-80x80.png">
            </template>

            <template #heading>
                Header
            </template>

            <template #subheading>
                Subhead
            </template>
        </M3Card>
    `}),parameters:{layout:`centered`}},W={},G={render:e=>({components:{M3Button:v,M3Card:z,M3Icon:b,M3IconButton:k},setup(){return{args:e}},template:`
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">Header</div>
                <div class="m3-card__subheading">Subhead</div>
            </div>

            <M3IconButton class="ml-auto">
                <M3Icon name="more_vert" />
            </M3IconButton>
        </M3Card>
    `})},K={render:e=>({components:{M3Button:v,M3Card:z,M3Icon:b,M3IconButton:k},setup(){return{args:e}},template:`
        <M3Card v-bind="args">
            <template #media>
                <img alt="" src="/assets/image-720x376.png">
            </template>

            <template #heading>
                Title
            </template>

            <template #subheading>
                Subhead
            </template>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

            <div style="display: flex; justify-content: flex-end; gap: 8px; width: 100%;">
                <M3Button appearance="outlined">
                    Enabled
                </M3Button>

                <M3Button>Enabled</M3Button>
            </div>
        </M3Card>
    `})},q={render:()=>({components:{M3Card:z},setup(){return{appearances:[`filled`,`elevated`,`outlined`]}},template:`
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
            <M3Card
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                style="width: 220px;"
            >
                <template #heading>
                    {{ appearance }}
                </template>

                <template #subheading>
                    Card emphasis
                </template>

                Supporting text for the current card style.
            </M3Card>
        </div>
    `})},J=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton
    },
    setup() {
      return {
        args
      };
    },
    template: \`
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">Header</div>
                <div class="m3-card__subheading">Subhead</div>
            </div>

            <M3IconButton class="ml-auto">
                <M3Icon name="more_vert" />
            </M3IconButton>
        </M3Card>
    \`
  })
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton
    },
    setup() {
      return {
        args
      };
    },
    template: \`
        <M3Card v-bind="args">
            <template #media>
                <img alt="" src="/assets/image-720x376.png">
            </template>

            <template #heading>
                Title
            </template>

            <template #subheading>
                Subhead
            </template>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

            <div style="display: flex; justify-content: flex-end; gap: 8px; width: 100%;">
                <M3Button appearance="outlined">
                    Enabled
                </M3Button>

                <M3Button>Enabled</M3Button>
            </div>
        </M3Card>
    \`
  })
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      M3Card
    },
    setup() {
      return {
        appearances: ['filled', 'elevated', 'outlined']
      };
    },
    template: \`
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;">
            <M3Card
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                style="width: 220px;"
            >
                <template #heading>
                    {{ appearance }}
                </template>

                <template #subheading>
                    Card emphasis
                </template>

                Supporting text for the current card style.
            </M3Card>
        </div>
    \`
  })
}`,...q.parameters?.docs?.source}}}})))()}export{B as a,z as i,Y as n,V as r,H as t};