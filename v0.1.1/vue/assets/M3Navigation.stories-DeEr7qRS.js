import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,et as r,i,s as a}from"./iframe-CwdcI8lG.js";import{i as o,t as s}from"./icon-DNAJkfNS.js";import{n as c,t as l}from"./icon-button-B4Oa6UDY.js";import{n as u,t as d}from"./fab-button-0gVsytWo.js";import{i as f,n as p,o as m,t as h}from"./navigation-06SHLix6.js";var g=t({ModalNavigationDrawer:()=>x,NavigationDrawer:()=>y,NavigationRail:()=>b,__namedExportsOrder:()=>S,default:()=>v}),_,v,y,b,x,S;function C(){return(C=e((()=>{a(),d(),s(),l(),h(),i(),_={"en-US":{close:`Close menu`,drafts:`Drafts`,family:`Family`,favorites:`Favorites`,inbox:`Inbox`,mail:`Mail`,open:`Open menu`,outbox:`Outbox`,personalFolders:`Personal folders`,trash:`Trash`,wedding:`Wedding`},"ru-RU":{close:`Закрыть меню`,drafts:`Черновики`,family:`Семья`,favorites:`Избранное`,inbox:`Входящие`,mail:`Почта`,open:`Открыть меню`,outbox:`Исходящие`,personalFolders:`Личные папки`,trash:`Корзина`,wedding:`Свадьба`}},v={title:`Components/M3Navigation`,component:f,argTypes:{appearance:{control:`select`,options:[`auto`,`bar`,`drawer`,`rail`]},alignment:{control:`select`,options:[`top`,`middle`,`bottom`]}},args:{appearance:`auto`,alignment:`top`},render:(e,{globals:t})=>({name:`M3NavigationStory`,components:{M3FabButton:u,M3Icon:o,M3IconButton:c,M3Navigation:f,M3NavigationSection:m,M3NavigationTab:p},setup(){return{args:e,expanded:r(!1),text:n(t.locale,_)}},template:`
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    :aria-label="text.open"
                    @click="expanded = true"
                >
                    <M3Icon name="menu" />
                </M3IconButton>

                <M3FabButton variant="tertiary">
                    <M3Icon name="edit" />
                </M3FabButton>
            </template>

            <template #header>
                {{ text.mail }}
            </template>

            <M3NavigationTab :label="text.inbox" active>
                <M3Icon name="inbox" />

                <template #badge>
                    24
                </template>
            </M3NavigationTab>

            <M3NavigationTab :label="text.outbox">
                <M3Icon name="send" />
            </M3NavigationTab>

            <M3NavigationTab :label="text.favorites">
                <M3Icon name="favorite" />
            </M3NavigationTab>

            <M3NavigationTab :label="text.trash">
                <M3Icon name="delete" />
            </M3NavigationTab>

            <template #sections>
                <M3NavigationSection>
                    <template #header>
                        {{ text.personalFolders }}
                    </template>

                    <M3NavigationTab :label="text.family">
                        <M3Icon name="folder" />
                    </M3NavigationTab>

                    <M3NavigationTab :label="text.wedding">
                        <M3Icon name="folder" />
                    </M3NavigationTab>
                </M3NavigationSection>
            </template>
        </M3Navigation>
    `}),parameters:{layout:`centered`}},y={args:{appearance:`drawer`}},b={args:{appearance:`rail`}},x={render:(e,{globals:t})=>({name:`M3ModalNavigationDrawerStory`,components:{M3Icon:o,M3IconButton:c,M3Navigation:f,M3NavigationTab:p},setup(){return{args:e,expanded:r(!0),text:n(t.locale,_)}},template:`
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    :aria-label="text.close"
                    @click="expanded = false"
                >
                    <M3Icon name="menu" />
                </M3IconButton>
            </template>

            <template #header>
                {{ text.mail }}
            </template>

            <M3NavigationTab :label="text.inbox" active>
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab :label="text.drafts">
                <M3Icon name="mail" />
            </M3NavigationTab>

            <M3NavigationTab :label="text.trash">
                <M3Icon name="delete" />
            </M3NavigationTab>
        </M3Navigation>
    `}),args:{appearance:`drawer`}},S=[`NavigationDrawer`,`NavigationRail`,`ModalNavigationDrawer`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'drawer'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'rail'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    name: 'M3ModalNavigationDrawerStory',
    components: {
      M3Icon,
      M3IconButton,
      M3Navigation,
      M3NavigationTab
    },
    setup() {
      return {
        args,
        expanded: ref(true),
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    :aria-label="text.close"
                    @click="expanded = false"
                >
                    <M3Icon name="menu" />
                </M3IconButton>
            </template>

            <template #header>
                {{ text.mail }}
            </template>

            <M3NavigationTab :label="text.inbox" active>
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab :label="text.drafts">
                <M3Icon name="mail" />
            </M3NavigationTab>

            <M3NavigationTab :label="text.trash">
                <M3Icon name="delete" />
            </M3NavigationTab>
        </M3Navigation>
    \`
  }),
  args: {
    appearance: 'drawer'
  }
}`,...x.parameters?.docs?.source}}}})))()}export{C as n,g as t};