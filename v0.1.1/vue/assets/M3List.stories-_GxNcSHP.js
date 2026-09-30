import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-CwdcI8lG.js";import{i,t as a}from"./icon-DNAJkfNS.js";import{i as o,n as s,t as c}from"./list-ChFYA5qH.js";var l=t({InteractiveSelection:()=>m,Standard:()=>f,SupportingText:()=>p,__namedExportsOrder:()=>h,default:()=>d}),u,d,f,p,m,h;function g(){return(g=e((()=>{a(),c(),r(),u={"en-US":{archive:`Archive`,bluetoothSupport:`Connected to office network`,folders:`Folders`,inbox:`Inbox`,messages:`Messages`,notifications:`Notifications`,on:`On`,planning:`Planning meeting`,planningSupport:`Design sync moved to 15:00. Review the agenda before joining.`,review:`Review updates`,reviewSupport:`Two unread comments in the component review thread.`,sent:`Sent`,settings:`Settings`,today:`Today`},"ru-RU":{archive:`Архив`,bluetoothSupport:`Подключено к офисной сети`,folders:`Папки`,inbox:`Входящие`,messages:`Сообщения`,notifications:`Уведомления`,on:`Включено`,planning:`Планирование`,planningSupport:`Синхронизацию по дизайну перенесли на 15:00. Просмотрите повестку перед встречей.`,review:`Обновления ревью`,reviewSupport:`Два непрочитанных комментария в обсуждении компонентов.`,sent:`Отправленные`,settings:`Настройки`,today:`Сегодня`}},d={title:`Components/M3List`,component:o,argTypes:{divided:{control:`boolean`}},args:{divided:!1},render:(e,{globals:t})=>({components:{M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,u)}},template:`
        <M3List :aria-label="text.settings" v-bind="args">
            <M3ListItem>
                <template #leading>
                    <M3Icon name="wifi" />
                </template>

                Wi-Fi

                <template #trailing>
                    {{ text.on }}
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.bluetoothSupport">
                <template #leading>
                    <M3Icon name="bluetooth" />
                </template>

                Bluetooth
            </M3ListItem>

            <M3ListItem href="#notifications">
                <template #leading>
                    <M3Icon name="notifications" />
                </template>

                {{ text.notifications }}

                <template #trailing>
                    <M3Icon name="chevron_right" />
                </template>
            </M3ListItem>
        </M3List>
    `}),parameters:{layout:`centered`}},f={},p={render:(e,{globals:t})=>({components:{M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,u)}},template:`
        <M3List :aria-label="text.messages" v-bind="args">
            <M3ListItem
                :overline="text.today"
                :supporting-text="text.planningSupport"
            >
                <template #leading>
                    <M3Icon name="event" />
                </template>

                {{ text.planning }}

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.reviewSupport">
                <template #leading>
                    <M3Icon name="chat" />
                </template>

                {{ text.review }}

                <template #trailing>
                    09:30
                </template>
            </M3ListItem>
        </M3List>
    `})},m={args:{divided:!0},render:(e,{globals:t})=>({components:{M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,u)}},template:`
        <M3List :aria-label="text.folders" v-bind="args">
            <M3ListItem selected interactive>
                <template #leading>
                    <M3Icon name="inbox" />
                </template>

                {{ text.inbox }}

                <template #trailing>
                    24
                </template>
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="send" />
                </template>

                {{ text.sent }}
            </M3ListItem>

            <M3ListItem disabled interactive>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                {{ text.archive }}
            </M3ListItem>
        </M3List>
    `})},h=[`Standard`,`SupportingText`,`InteractiveSelection`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem
    },
    setup() {
      return {
        args,
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <M3List :aria-label="text.messages" v-bind="args">
            <M3ListItem
                :overline="text.today"
                :supporting-text="text.planningSupport"
            >
                <template #leading>
                    <M3Icon name="event" />
                </template>

                {{ text.planning }}

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.reviewSupport">
                <template #leading>
                    <M3Icon name="chat" />
                </template>

                {{ text.review }}

                <template #trailing>
                    09:30
                </template>
            </M3ListItem>
        </M3List>
    \`
  })
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    divided: true
  },
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3List,
      M3ListItem
    },
    setup() {
      return {
        args,
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <M3List :aria-label="text.folders" v-bind="args">
            <M3ListItem selected interactive>
                <template #leading>
                    <M3Icon name="inbox" />
                </template>

                {{ text.inbox }}

                <template #trailing>
                    24
                </template>
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="send" />
                </template>

                {{ text.sent }}
            </M3ListItem>

            <M3ListItem disabled interactive>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                {{ text.archive }}
            </M3ListItem>
        </M3List>
    \`
  })
}`,...m.parameters?.docs?.source}}}})))()}export{g as a,p as i,l as n,f as r,m as t};