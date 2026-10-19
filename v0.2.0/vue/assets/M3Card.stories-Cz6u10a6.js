import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{B as n,C as r,D as i,E as a,O as o,P as s,S as c,U as l,a as u,b as d,i as f,it as p,lt as m,s as h,tt as g,y as _}from"./iframe-B19RV9Pc.js";import{n as v,t as y}from"./id-VBTJCATG.js";import{i as b,t as x}from"./icon-BVQ8SObm.js";import{n as S,t as C}from"./ripple-CjIDfCgo.js";import{n as w,t as T}from"./icon-button-BbD7efFX.js";import{d as E,n as D,o as O,s as k,t as A}from"./predicates-BWeCcKiY.js";import{n as j,t as M}from"./button-BHBfLLh5.js";var N,P,F,I,L,R,z;function B(){return(B=e((()=>{h(),k(),D(),C(),y(),N=[`id`],P={key:0,class:`m3-card__media`},F={class:`m3-card__content`},I={key:0,class:`m3-card__head`},L=[`id`],R={key:1,class:`m3-card__subheading`},z=o({__name:`M3Card`,props:{id:{type:null,validator:A(E,O),default:void 0},appearance:{type:String,default:`filled`},heading:{type:String,default:``},subheading:{type:String,default:``},interactive:{type:Boolean,default:!1},landscape:{type:Boolean,default:!1}},setup(e,{expose:t}){let o=e,u=v(`m3-card`,_(()=>o.id)),f=g(null),h=g(null),y=g(null);return t({get el(){return f.value}}),(t,o)=>(n(),r(`section`,s({id:p(u),ref_key:`root`,ref:f,class:{"m3-card":!0,[`m3-card_`+e.appearance]:!0,"m3-card_interactive":e.interactive,"m3-card_landscape":e.landscape}},{role:`role`in t.$attrs?void 0:`aria-label`in t.$attrs||`aria-labelledby`in t.$attrs||!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?`region`:void 0,...e.interactive?{tabindex:0}:{},...!(`aria-label`in t.$attrs)&&!(`aria-labelledby`in t.$attrs)&&!(`content`in t.$slots)&&(`heading`in t.$slots||e.heading.length)?{"aria-labelledby":p(u)+`-heading`}:{},...t.$attrs},{onClick:o[0]||=t=>e.interactive?y.value?.activate(t):null}),[e.interactive?(n(),r(`div`,{key:0,ref_key:`state`,ref:h,class:`m3-card__state`},[i(p(S),{ref_key:`ripple`,ref:y,owner:g(h.value)},null,8,[`owner`])],512)):c(``,!0),l(t.$slots,`content`,{},()=>[`media`in t.$slots?(n(),r(`div`,P,[l(t.$slots,`media`)])):c(``,!0),d(`div`,F,[`heading`in t.$slots||`subheading`in t.$slots||e.heading.length||e.subheading.length?(n(),r(`div`,I,[`heading`in t.$slots||e.heading.length?(n(),r(`div`,{key:0,id:p(u)+`-heading`,class:`m3-card__heading`},[l(t.$slots,`heading`,{},()=>[a(m(e.heading),1)])],8,L)):c(``,!0),`subheading`in t.$slots||e.subheading.length?(n(),r(`div`,R,[l(t.$slots,`subheading`,{},()=>[a(m(e.subheading),1)])])):c(``,!0)])):c(``,!0),l(t.$slots,`default`)])])],16,N))}})})))()}var V;function H(){return(H=e((()=>{B(),V=z,z.__docgenInfo=Object.assign({displayName:z.name??z.__name},{exportName:`default`,displayName:`M3Card`,description:``,tags:{},props:[{name:`id`,type:{name:`string | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`appearance`,type:{name:`Appearance`},defaultValue:{func:!1,value:`'filled'`}},{name:`heading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`subheading`,type:{name:`string`},defaultValue:{func:!1,value:`''`}},{name:`interactive`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`landscape`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],slots:[{name:`content`},{name:`media`},{name:`heading`},{name:`subheading`},{name:`default`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/card/M3Card.vue`]})})))()}function U(){return(U=e((()=>{H()})))()}var W=t({AppearanceMatrix:()=>X,Landscape:()=>q,LandscapeWithoutMedia:()=>J,Portrait:()=>Y,__namedExportsOrder:()=>Z,default:()=>K}),G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{M(),U(),x(),T(),f(),G={"en-US":{cardEmphasis:`Card emphasis`,enabled:`Enabled`,header:`Header`,supportingText:`Supporting text for the current card style.`,subhead:`Subhead`,title:`Title`},"ru-RU":{cardEmphasis:`Акцент карточки`,enabled:`Доступно`,header:`Заголовок`,supportingText:`Поясняющий текст для текущего стиля карточки.`,subhead:`Подзаголовок`,title:`Название`}},K={title:`Components/M3Card`,component:V,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]}},args:{appearance:`filled`},render:(e,{globals:t})=>({components:{M3Button:j,M3Card:V},setup(){return{args:e,text:u(t.locale,G)}},template:`
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
    `}),parameters:{layout:`centered`}},q={},J={render:(e,{globals:t})=>({components:{M3Button:j,M3Card:V,M3Icon:b,M3IconButton:w},setup(){return{args:e,text:u(t.locale,G)}},template:`
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
    `})},Y={render:(e,{globals:t})=>({components:{M3Button:j,M3Card:V,M3Icon:b,M3IconButton:w},setup(){return{args:e,text:u(t.locale,G)}},template:`
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
    `})},X={render:(e,{globals:t})=>({components:{M3Card:V},setup(){return{appearances:[`filled`,`elevated`,`outlined`],text:u(t.locale,G)}},template:`
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