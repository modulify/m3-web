import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,E as i,H as a,N as o,O as s,S as c,a as l,b as u,et as d,i as f,rt as p,s as m,st as h,y as g,z as _}from"./iframe-hIq0EEjR.js";import{n as v,t as y}from"./ripple-vFigACnV.js";import{n as b,t as x}from"./button-B4RKEk47.js";import{i as S,t as C}from"./icon-Bv7HR_mB.js";import{d as w,n as T,o as E,s as D,t as O}from"./predicates-Fn35WtiC.js";import{n as k,t as A}from"./id-Nxxsyh-m.js";import{n as j,t as M}from"./icon-button-CH1XkFcG.js";var N,P,F,I,L,R,z;function B(){return(B=e((()=>{m(),D(),T(),y(),A(),N=[`id`],P={key:0,class:`m3-card__media`},F={class:`m3-card__content`},I={key:0,class:`m3-card__head`},L=[`id`],R={key:1,class:`m3-card__subheading`},z=s({__name:`M3Card`,props:{id:{type:null,validator:O(w,E),default:void 0},appearance:{type:String,default:`filled`},heading:{type:String,default:``},subheading:{type:String,default:``},interactive:{type:Boolean,default:!1},landscape:{type:Boolean,default:!1}},setup(e,{expose:t}){let s=e,l=k(`m3-card`,g(()=>s.id)),f=d(null),m=d(null),y=d(null);return t({get el(){return f.value}}),(t,s)=>(_(),n(`section`,o({id:p(l),ref_key:`root`,ref:f,class:{"m3-card":!0,[`m3-card_`+e.appearance]:!0,"m3-card_interactive":e.interactive,"m3-card_landscape":e.landscape}},{role:`role`in t.$attrs?void 0:`aria-label`in t.$attrs||`aria-labelledby`in t.$attrs||!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?`region`:void 0,...e.interactive?{tabindex:0}:{},...!(`aria-label`in t.$attrs)&&!(`aria-labelledby`in t.$attrs)&&!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?{"aria-labelledby":p(l)+`-heading`}:{},...t.$attrs},{onClick:s[0]||=t=>e.interactive?y.value?.activate(t):null}),[e.interactive?(_(),n(`div`,{key:0,ref_key:`state`,ref:m,class:`m3-card__state`},[r(p(v),{ref_key:`ripple`,ref:y,owner:d(m.value)},null,8,[`owner`])],512)):c(``,!0),a(t.$slots,`content`,{},()=>[`media`in t.$slots?(_(),n(`div`,P,[a(t.$slots,`media`)])):c(``,!0),u(`div`,F,[`heading`in t.$slots||`subheading`in t.$slots||e.heading.length||e.subheading.length?(_(),n(`div`,I,[`heading`in t.$slots||e.heading.length?(_(),n(`div`,{key:0,id:p(l)+`-heading`,class:`m3-card__heading`},[a(t.$slots,`heading`,{},()=>[i(h(e.heading),1)])],8,L)):c(``,!0),`subheading`in t.$slots||e.subheading.length?(_(),n(`div`,R,[a(t.$slots,`subheading`,{},()=>[i(h(e.subheading),1)])])):c(``,!0)])):c(``,!0),a(t.$slots,`default`)])])],16,N))}})})))()}var V;function H(){return(H=e((()=>{B(),V=z,z.__docgenInfo=Object.assign({displayName:z.name??z.__name},{exportName:`default`,displayName:`M3Card`,description:``,tags:{},props:[{name:`id`,type:{name:`string | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`appearance`,type:{name:`Appearance`},defaultValue:{func:!1,value:`'filled'`}},{name:`heading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`subheading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`interactive`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`landscape`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],slots:[{name:`content`},{name:`media`},{name:`heading`},{name:`subheading`},{name:`default`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/card/M3Card.vue`]})})))()}function U(){return(U=e((()=>{H()})))()}var W=t({AppearanceMatrix:()=>X,Landscape:()=>q,LandscapeWithoutMedia:()=>J,Portrait:()=>Y,__namedExportsOrder:()=>Z,default:()=>K}),G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{x(),U(),C(),M(),f(),G={"en-US":{cardEmphasis:`Card emphasis`,enabled:`Enabled`,header:`Header`,supportingText:`Supporting text for the current card style.`,subhead:`Subhead`,title:`Title`},"ru-RU":{cardEmphasis:`Акцент карточки`,enabled:`Доступно`,header:`Заголовок`,supportingText:`Поясняющий текст для текущего стиля карточки.`,subhead:`Подзаголовок`,title:`Название`}},K={title:`Components/M3Card`,component:V,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]}},args:{appearance:`filled`},render:(e,{globals:t})=>({components:{M3Button:b,M3Card:V},setup(){return{args:e,text:l(t.locale,G)}},template:`
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
    `}),parameters:{layout:`centered`}},q={},J={render:(e,{globals:t})=>({components:{M3Button:b,M3Card:V,M3Icon:S,M3IconButton:j},setup(){return{args:e,text:l(t.locale,G)}},template:`
        <M3Card v-bind="args" landscape>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#6750A4"/>
            </svg>

            <div class="m3-card__head">
                <div class="m3-card__heading">{{ text.header }}</div>
                <div class="m3-card__subheading">{{ text.subhead }}</div>
            </div>

            <M3IconButton class="ml-auto">
                <M3Icon name="more_vert" />
            </M3IconButton>
        </M3Card>
    `})},Y={render:(e,{globals:t})=>({components:{M3Button:b,M3Card:V,M3Icon:S,M3IconButton:j},setup(){return{args:e,text:l(t.locale,G)}},template:`
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
    `})},X={render:(e,{globals:t})=>({components:{M3Card:V},setup(){return{appearances:[`filled`,`elevated`,`outlined`],text:l(t.locale,G)}},template:`
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
    `})},Z=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton
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

            <M3IconButton class="ml-auto">
                <M3Icon name="more_vert" />
            </M3IconButton>
        </M3Card>
    \`
  })
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Card,
      M3Icon,
      M3IconButton
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}}})))()}export{H as a,V as i,Q as n,U as r,W as t};