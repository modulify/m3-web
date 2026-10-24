import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,E as i,O as a,P as o,S as s,V as c,W as l,a as u,at as d,b as f,i as p,nt as m,s as h,ut as g,y as _}from"./iframe-DlP_3VDG.js";import{n as v,t as y}from"./id-DkFC80RS.js";import{n as b,t as x}from"./ripple-CmuynTA7.js";import{n as S,t as C}from"./button-DcVEi8uC.js";import{n as w,t as T}from"./icon-BHYZNUrK.js";import{d as E,n as D,o as O,s as k,t as A}from"./predicates-BWeCcKiY.js";var j,M,N,P,F,I,L;function R(){return(R=e((()=>{h(),k(),D(),x(),y(),j=[`id`],M={key:0,class:`m3-card__media`},N={class:`m3-card__content`},P={key:0,class:`m3-card__head`},F=[`id`],I={key:1,class:`m3-card__subheading`},L=a({__name:`M3Card`,props:{id:{type:null,validator:A(E,O),default:void 0},appearance:{type:String,default:`filled`},heading:{type:String,default:``},subheading:{type:String,default:``},interactive:{type:Boolean,default:!1},landscape:{type:Boolean,default:!1}},setup(e,{expose:t}){let a=e,u=v(`m3-card`,_(()=>a.id)),p=m(null),h=m(null),y=m(null);return t({get el(){return p.value}}),(t,a)=>(c(),n(`section`,o({id:d(u),ref_key:`root`,ref:p,class:{"m3-card":!0,[`m3-card_`+e.appearance]:!0,"m3-card_interactive":e.interactive,"m3-card_landscape":e.landscape}},{role:`role`in t.$attrs?void 0:`aria-label`in t.$attrs||`aria-labelledby`in t.$attrs||!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?`region`:void 0,...e.interactive?{tabindex:0}:{},...!(`aria-label`in t.$attrs)&&!(`aria-labelledby`in t.$attrs)&&!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?{"aria-labelledby":d(u)+`-heading`}:{},...t.$attrs},{onClick:a[0]||=t=>e.interactive?y.value?.activate(t):null}),[e.interactive?(c(),n(`div`,{key:0,ref_key:`state`,ref:h,class:`m3-card__state`},[r(d(b),{ref_key:`ripple`,ref:y,owner:m(h.value)},null,8,[`owner`])],512)):s(``,!0),l(t.$slots,`content`,{},()=>[`media`in t.$slots?(c(),n(`div`,M,[l(t.$slots,`media`)])):s(``,!0),f(`div`,N,[`heading`in t.$slots||`subheading`in t.$slots||e.heading.length||e.subheading.length?(c(),n(`div`,P,[`heading`in t.$slots||e.heading.length?(c(),n(`div`,{key:0,id:d(u)+`-heading`,class:`m3-card__heading`},[l(t.$slots,`heading`,{},()=>[i(g(e.heading),1)])],8,F)):s(``,!0),`subheading`in t.$slots||e.subheading.length?(c(),n(`div`,I,[l(t.$slots,`subheading`,{},()=>[i(g(e.subheading),1)])])):s(``,!0)])):s(``,!0),l(t.$slots,`default`)])])],16,j))}})})))()}var z;function B(){return(B=e((()=>{R(),z=L,L.__docgenInfo=Object.assign({displayName:L.name??L.__name},{exportName:`default`,displayName:`M3Card`,description:``,tags:{},props:[{name:`id`,type:{name:`string | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`appearance`,type:{name:`Appearance`},defaultValue:{func:!1,value:`'filled'`}},{name:`heading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`subheading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`interactive`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`landscape`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],slots:[{name:`content`},{name:`media`},{name:`heading`},{name:`subheading`},{name:`default`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/card/M3Card.vue`]})})))()}function V(){return(V=e((()=>{B()})))()}var H=t({AppearanceMatrix:()=>J,Landscape:()=>G,LandscapeWithoutMedia:()=>K,Portrait:()=>q,__namedExportsOrder:()=>Y,default:()=>W}),U,W,G,K,q,J,Y;function X(){return(X=e((()=>{C(),V(),T(),p(),U={"en-US":{cardEmphasis:`Card emphasis`,enabled:`Enabled`,header:`Header`,supportingText:`Supporting text for the current card style.`,subhead:`Subhead`,title:`Title`},"ru-RU":{cardEmphasis:`Акцент карточки`,enabled:`Доступно`,header:`Заголовок`,supportingText:`Поясняющий текст для текущего стиля карточки.`,subhead:`Подзаголовок`,title:`Название`}},W={title:`Components/M3Card`,component:z,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]}},args:{appearance:`filled`},render:(e,{globals:t})=>({components:{M3Button:S,M3Card:z},setup(){return{args:e,text:u(t.locale,U)}},template:`
        <M3Card v-bind="args" landscape>
            <template #media>
                <img alt="" src="/assets/image-80x80.png">
            </template>

            <template #heading>
                {{ text.header }}
            </template>

            <template #subheading>
                {{ text.subhead }}
            </template>
        </M3Card>
    `}),parameters:{layout:`centered`}},G={},K={render:(e,{globals:t})=>({components:{M3Button:S,M3Card:z,M3Icon:w},setup(){return{args:e,text:u(t.locale,U)}},template:`
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">{{ text.header }}</div>
                <div class="m3-card__subheading">{{ text.subhead }}</div>
            </div>

            <M3Button width="medium" appearance="standard" class="ml-auto">
                <M3Icon name="more_vert" />
            </M3Button>
        </M3Card>
    `})},q={render:(e,{globals:t})=>({components:{M3Button:S,M3Card:z,M3Icon:w},setup(){return{args:e,text:u(t.locale,U)}},template:`
        <M3Card v-bind="args">
            <template #media>
                <img alt="" src="/assets/image-720x376.png">
            </template>

            <template #heading>
                {{ text.title }}
            </template>

            <template #subheading>
                {{ text.subhead }}
            </template>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

            <div style="display: flex; justify-content: flex-end; gap: 8px; width: 100%;">
                <M3Button appearance="outlined">
                    {{ text.enabled }}
                </M3Button>

                <M3Button>{{ text.enabled }}</M3Button>
            </div>
        </M3Card>
    `})},J={render:(e,{globals:t})=>({components:{M3Card:z},setup(){return{appearances:[`filled`,`elevated`,`outlined`],text:u(t.locale,U)}},template:`
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
                    {{ text.cardEmphasis }}
                </template>

                {{ text.supportingText }}
            </M3Card>
        </div>
    `})},Y=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon
    },
    setup() {
      return {
        args,
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">{{ text.header }}</div>
                <div class="m3-card__subheading">{{ text.subhead }}</div>
            </div>

            <M3Button width="medium" appearance="standard" class="ml-auto">
                <M3Icon name="more_vert" />
            </M3Button>
        </M3Card>
    \`
  })
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon
    },
    setup() {
      return {
        args,
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <M3Card v-bind="args">
            <template #media>
                <img alt="" src="/assets/image-720x376.png">
            </template>

            <template #heading>
                {{ text.title }}
            </template>

            <template #subheading>
                {{ text.subhead }}
            </template>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

            <div style="display: flex; justify-content: flex-end; gap: 8px; width: 100%;">
                <M3Button appearance="outlined">
                    {{ text.enabled }}
                </M3Button>

                <M3Button>{{ text.enabled }}</M3Button>
            </div>
        </M3Card>
    \`
  })
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Card
    },
    setup() {
      return {
        appearances: ['filled', 'elevated', 'outlined'],
        text: localize(globals.locale, messages)
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
                    {{ text.cardEmphasis }}
                </template>

                {{ text.supportingText }}
            </M3Card>
        </div>
    \`
  })
}`,...J.parameters?.docs?.source}}}})))()}export{B as a,z as i,X as n,V as r,H as t};