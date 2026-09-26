import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{i as n,t as r}from"./icon-BzqhEXMj.js";import{i,n as a,t as o}from"./list-kKpzxVE6.js";var s=t({InteractiveSelection:()=>d,Standard:()=>l,SupportingText:()=>u,__namedExportsOrder:()=>f,default:()=>c}),c,l,u,d,f;function p(){return(p=e((()=>{r(),o(),c={title:`Components/M3List`,component:i,argTypes:{divided:{control:`boolean`}},args:{divided:!1},render:e=>({components:{M3Icon:n,M3List:i,M3ListItem:a},setup(){return{args:e}},template:`
        <M3List v-bind="args" aria-label="Settings">
            <M3ListItem>
                <template #leading>
                    <M3Icon name="wifi" />
                </template>

                Wi-Fi

                <template #trailing>
                    On
                </template>
            </M3ListItem>

            <M3ListItem supporting-text="Connected to office network">
                <template #leading>
                    <M3Icon name="bluetooth" />
                </template>

                Bluetooth
            </M3ListItem>

            <M3ListItem href="#notifications">
                <template #leading>
                    <M3Icon name="notifications" />
                </template>

                Notifications

                <template #trailing>
                    <M3Icon name="chevron_right" />
                </template>
            </M3ListItem>
        </M3List>
    `}),parameters:{layout:`centered`}},l={},u={render:e=>({components:{M3Icon:n,M3List:i,M3ListItem:a},setup(){return{args:e}},template:`
        <M3List v-bind="args" aria-label="Messages">
            <M3ListItem
                overline="Today"
                supporting-text="Design sync moved to 15:00. Review the agenda before joining."
            >
                <template #leading>
                    <M3Icon name="event" />
                </template>

                Planning meeting

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>

            <M3ListItem supporting-text="Two unread comments in the component review thread.">
                <template #leading>
                    <M3Icon name="chat" />
                </template>

                Review updates

                <template #trailing>
                    09:30
                </template>
            </M3ListItem>
        </M3List>
    `})},d={args:{divided:!0},render:e=>({components:{M3Icon:n,M3List:i,M3ListItem:a},setup(){return{args:e}},template:`
        <M3List v-bind="args" aria-label="Folders">
            <M3ListItem selected interactive>
                <template #leading>
                    <M3Icon name="inbox" />
                </template>

                Inbox

                <template #trailing>
                    24
                </template>
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="send" />
                </template>

                Sent
            </M3ListItem>

            <M3ListItem disabled interactive>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                Archive
            </M3ListItem>
        </M3List>
    `})},f=[`Standard`,`SupportingText`,`InteractiveSelection`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem
    },
    setup() {
      return {
        args
      };
    },
    template: \`
        <M3List v-bind="args" aria-label="Messages">
            <M3ListItem
                overline="Today"
                supporting-text="Design sync moved to 15:00. Review the agenda before joining."
            >
                <template #leading>
                    <M3Icon name="event" />
                </template>

                Planning meeting

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>

            <M3ListItem supporting-text="Two unread comments in the component review thread.">
                <template #leading>
                    <M3Icon name="chat" />
                </template>

                Review updates

                <template #trailing>
                    09:30
                </template>
            </M3ListItem>
        </M3List>
    \`
  })
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    divided: true
  },
  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem
    },
    setup() {
      return {
        args
      };
    },
    template: \`
        <M3List v-bind="args" aria-label="Folders">
            <M3ListItem selected interactive>
                <template #leading>
                    <M3Icon name="inbox" />
                </template>

                Inbox

                <template #trailing>
                    24
                </template>
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="send" />
                </template>

                Sent
            </M3ListItem>

            <M3ListItem disabled interactive>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                Archive
            </M3ListItem>
        </M3List>
    \`
  })
}`,...d.parameters?.docs?.source}}}})))()}export{p as a,u as i,s as n,l as r,d as t};