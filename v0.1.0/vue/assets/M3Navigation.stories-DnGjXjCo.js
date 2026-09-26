import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{Y as n,n as r}from"./iframe-DqoEP6-3.js";import{i,t as a}from"./icon-BzqhEXMj.js";import{n as o,t as s}from"./icon-button-DfGrghLx.js";import{n as c,t as l}from"./fab-button-DMmR1Uz2.js";import{i as u,n as d,o as f,t as p}from"./navigation-BL1fF58x.js";var m=t({ModalNavigationDrawer:()=>v,NavigationDrawer:()=>g,NavigationRail:()=>_,__namedExportsOrder:()=>y,default:()=>h}),h,g,_,v,y;function b(){return(b=e((()=>{r(),l(),a(),s(),p(),h={title:`Components/M3Navigation`,component:u,argTypes:{appearance:{control:`select`,options:[`auto`,`bar`,`drawer`,`rail`]},alignment:{control:`select`,options:[`top`,`middle`,`bottom`]}},args:{appearance:`auto`,alignment:`top`},render:e=>({name:`M3NavigationStory`,components:{M3FabButton:c,M3Icon:i,M3IconButton:o,M3Navigation:u,M3NavigationSection:f,M3NavigationTab:d},setup(){return{args:e,expanded:n(!1)}},template:`
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    aria-label="Open menu"
                    @click="expanded = true"
                >
                    <M3Icon name="menu" />
                </M3IconButton>

                <M3FabButton variant="tertiary">
                    <M3Icon name="edit" />
                </M3FabButton>
            </template>

            <template #header>
                Mail
            </template>

            <M3NavigationTab label="Inbox" active>
                <M3Icon name="inbox" />

                <template #badge>
                    24
                </template>
            </M3NavigationTab>

            <M3NavigationTab label="Outbox">
                <M3Icon name="send" />
            </M3NavigationTab>

            <M3NavigationTab label="Favorites">
                <M3Icon name="favorite" />
            </M3NavigationTab>

            <M3NavigationTab label="Trash">
                <M3Icon name="delete" />
            </M3NavigationTab>

            <template #sections>
                <M3NavigationSection>
                    <template #header>
                        Personal folders
                    </template>

                    <M3NavigationTab label="Family">
                        <M3Icon name="folder" />
                    </M3NavigationTab>

                    <M3NavigationTab label="Wedding">
                        <M3Icon name="folder" />
                    </M3NavigationTab>
                </M3NavigationSection>
            </template>
        </M3Navigation>
    `}),parameters:{layout:`centered`}},g={args:{appearance:`drawer`}},_={args:{appearance:`rail`}},v={render:e=>({name:`M3ModalNavigationDrawerStory`,components:{M3Icon:i,M3IconButton:o,M3Navigation:u,M3NavigationTab:d},setup(){return{args:e,expanded:n(!0)}},template:`
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    aria-label="Close menu"
                    @click="expanded = false"
                >
                    <M3Icon name="menu" />
                </M3IconButton>
            </template>

            <template #header>
                Mail
            </template>

            <M3NavigationTab label="Inbox" active>
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab label="Drafts">
                <M3Icon name="mail" />
            </M3NavigationTab>

            <M3NavigationTab label="Trash">
                <M3Icon name="delete" />
            </M3NavigationTab>
        </M3Navigation>
    `}),args:{appearance:`drawer`}},y=[`NavigationDrawer`,`NavigationRail`,`ModalNavigationDrawer`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'drawer'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'rail'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
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
        expanded: ref(true)
      };
    },
    template: \`
        <M3Navigation
            v-model:expanded="expanded"
            v-bind="args"
        >
            <template #top>
                <M3IconButton
                    aria-label="Close menu"
                    @click="expanded = false"
                >
                    <M3Icon name="menu" />
                </M3IconButton>
            </template>

            <template #header>
                Mail
            </template>

            <M3NavigationTab label="Inbox" active>
                <M3Icon name="inbox" />
            </M3NavigationTab>

            <M3NavigationTab label="Drafts">
                <M3Icon name="mail" />
            </M3NavigationTab>

            <M3NavigationTab label="Trash">
                <M3Icon name="delete" />
            </M3NavigationTab>
        </M3Navigation>
    \`
  }),
  args: {
    appearance: 'drawer'
  }
}`,...v.parameters?.docs?.source}}}})))()}export{b as n,m as t};