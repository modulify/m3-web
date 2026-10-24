import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r,nt as i,s as a}from"./iframe-DlP_3VDG.js";import{n as o,t as s}from"./button-DcVEi8uC.js";import{n as c,t as l}from"./icon-BHYZNUrK.js";import{n as u,t as d}from"./divider-B_gcBSia.js";import{i as f,n as p,t as m}from"./menu-O0SEVzFG.js";var h=t({Standard:()=>v,Submenu:()=>x,Vibrant:()=>y,WithLeadingAndTrailingContent:()=>b,__namedExportsOrder:()=>S,default:()=>_}),g,_,v,y,b,x,S;function C(){return(C=e((()=>{a(),s(),d(),l(),m(),r(),g={"en-US":{open:`Open menu`,first:`Edit profile`,second:`Favorite`,third:`Archive`,more:`More actions`},"ru-RU":{open:`Открыть меню`,first:`Изменить профиль`,second:`Избранное`,third:`Архивировать`,more:`Другие действия`}},_={title:`Components/M3Menu`,component:f,args:{target:()=>null},argTypes:{target:{control:!1},shown:{control:!1},color:{control:`select`,options:[`standard`,`vibrant`]},density:{control:`select`,options:[0,-1,-2,-3]}},render:(e,{globals:t})=>({components:{M3Button:o,M3Menu:f,M3MenuItem:p,M3Divider:u},setup(){let r=i(null);return{args:e,trigger:r,open:i(!1),target:()=>r.value?.el??null,text:n(t.locale,g)}},template:`
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>{{ text.first }}</M3MenuItem>
                <M3MenuItem selection="single" selected>{{ text.second }}</M3MenuItem>
                <M3Divider role="separator" />
                <M3MenuItem disabled>{{ text.third }}</M3MenuItem>
            </M3Menu>
        </div>
    `}),parameters:{layout:`centered`}},v={},y={args:{color:`vibrant`}},b={render:(e,{globals:t})=>({components:{M3Button:o,M3Icon:c,M3Menu:f,M3MenuItem:p},setup(){let r=i(null);return{args:e,trigger:r,open:i(!1),target:()=>r.value?.el??null,text:n(t.locale,g)}},template:`
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>
                    <template #leading><M3Icon name="edit" /></template>
                    {{ text.first }}
                    <template #trailing><M3Icon name="chevron_right" /></template>
                </M3MenuItem>
                <M3MenuItem>
                    <template #leading><M3Icon name="favorite" /></template>
                    {{ text.second }}
                </M3MenuItem>
            </M3Menu>
        </div>
    `})},x={render:(e,{globals:t})=>({components:{M3Button:o,M3Menu:f,M3MenuItem:p},setup(){let r=i(null);return{args:e,trigger:r,open:i(!1),target:()=>r.value?.el??null,text:n(t.locale,g)}},template:`
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>{{ text.first }}</M3MenuItem>
                <M3MenuItem>
                    {{ text.more }}
                    <template #submenu>
                        <M3MenuItem>{{ text.second }}</M3MenuItem>
                        <M3MenuItem>{{ text.third }}</M3MenuItem>
                    </template>
                </M3MenuItem>
            </M3Menu>
        </div>
    `})},S=[`Standard`,`Vibrant`,`WithLeadingAndTrailingContent`,`Submenu`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    color: 'vibrant'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Icon,
      M3Menu,
      M3MenuItem
    },
    setup() {
      const trigger = ref<ElementReference | null>(null);
      return {
        args,
        trigger,
        open: ref(false),
        target: () => trigger.value?.el ?? null,
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>
                    <template #leading><M3Icon name="edit" /></template>
                    {{ text.first }}
                    <template #trailing><M3Icon name="chevron_right" /></template>
                </M3MenuItem>
                <M3MenuItem>
                    <template #leading><M3Icon name="favorite" /></template>
                    {{ text.second }}
                </M3MenuItem>
            </M3Menu>
        </div>
    \`
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Menu,
      M3MenuItem
    },
    setup() {
      const trigger = ref<ElementReference | null>(null);
      return {
        args,
        trigger,
        open: ref(false),
        target: () => trigger.value?.el ?? null,
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <div style="min-height: 260px; min-width: 360px">
            <M3Button ref="trigger" aria-haspopup="menu" :aria-expanded="open">{{ text.open }}</M3Button>
            <M3Menu v-bind="args" :target="target" v-model:shown="open">
                <M3MenuItem>{{ text.first }}</M3MenuItem>
                <M3MenuItem>
                    {{ text.more }}
                    <template #submenu>
                        <M3MenuItem>{{ text.second }}</M3MenuItem>
                        <M3MenuItem>{{ text.third }}</M3MenuItem>
                    </template>
                </M3MenuItem>
            </M3Menu>
        </div>
    \`
  })
}`,...x.parameters?.docs?.source}}}})))()}export{C as a,b as i,v as n,y as r,h as t};