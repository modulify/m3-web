import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-DlP_3VDG.js";import{n as i,t as a}from"./icon-BHYZNUrK.js";import{i as o,n as s,t as c}from"./list-CpYq2h_b.js";import{n as l,t as u}from"./divider-B_gcBSia.js";var d=t({InteractiveSelection:()=>v,Segmented:()=>h,Standard:()=>m,SupportingText:()=>_,WithDivider:()=>g,__namedExportsOrder:()=>y,default:()=>p}),f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{u(),a(),c(),r(),f={"en-US":{archive:`Archive`,bluetoothSupport:`Connected to office network`,folders:`Folders`,inbox:`Inbox`,messages:`Messages`,notifications:`Notifications`,planning:`Planning meeting`,planningSupport:`Design sync moved to 15:00. Review the agenda before joining.`,review:`Review updates`,reviewSupport:`Two unread comments in the component review thread.`,privacy:`Privacy`,profile:`Profile`,sent:`Sent`,settings:`Settings`,signOut:`Sign out`,today:`Today`},"ru-RU":{archive:`Архив`,bluetoothSupport:`Подключено к офисной сети`,folders:`Папки`,inbox:`Входящие`,messages:`Сообщения`,notifications:`Уведомления`,planning:`Планирование`,planningSupport:`Синхронизацию по дизайну перенесли на 15:00. Просмотрите повестку перед встречей.`,review:`Обновления ревью`,reviewSupport:`Два непрочитанных комментария в обсуждении компонентов.`,privacy:`Конфиденциальность`,profile:`Профиль`,sent:`Отправленные`,settings:`Настройки`,signOut:`Выйти`,today:`Сегодня`}},p={title:`Components/M3List`,component:o,argTypes:{appearance:{control:`select`,options:[`standard`,`segmented`]}},render:(e,{globals:t})=>({components:{M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,f)}},template:`
        <M3List :aria-label="text.settings" v-bind="args">
            <M3ListItem>
                <template #leading>
                    <M3Icon name="wifi" />
                </template>

                Wi-Fi

                <template #trailing>
                    <M3Icon name="check" />
                </template>
            </M3ListItem>

            <M3ListItem :supporting-text="text.bluetoothSupport">
                <template #leading>
                    <M3Icon name="bluetooth" />
                </template>

                Bluetooth
            </M3ListItem>

            <M3ListItem href="javascript:void(0);">
                <template #leading>
                    <M3Icon name="notifications" />
                </template>

                {{ text.notifications }}

                <template #trailing>
                    <M3Icon name="chevron_right" />
                </template>
            </M3ListItem>
        </M3List>
    `}),parameters:{layout:`centered`}},m={},h={args:{appearance:`segmented`}},g={render:(e,{globals:t})=>({components:{M3Divider:l,M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,f)}},template:`
        <M3List :aria-label="text.settings" appearance="standard" v-bind="args">
            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="account_circle" />
                </template>

                {{ text.profile }}
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="lock" />
                </template>

                {{ text.privacy }}
            </M3ListItem>

            <M3Divider />

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="logout" />
                </template>

                {{ text.signOut }}
            </M3ListItem>
        </M3List>
    `})},_={render:(e,{globals:t})=>({components:{M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,f)}},template:`
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
    `})},v={render:(e,{globals:t})=>({components:{M3Icon:i,M3List:o,M3ListItem:s},setup(){return{args:e,text:n(t.locale,f)}},template:`
        <M3List :aria-label="text.folders" v-bind="args">
            <M3ListItem interactive selected>
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

            <M3ListItem interactive disabled>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                {{ text.archive }}
            </M3ListItem>
        </M3List>
    `})},y=[`Standard`,`Segmented`,`WithDivider`,`SupportingText`,`InteractiveSelection`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'segmented'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Divider,
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
        <M3List :aria-label="text.settings" appearance="standard" v-bind="args">
            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="account_circle" />
                </template>

                {{ text.profile }}
            </M3ListItem>

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="lock" />
                </template>

                {{ text.privacy }}
            </M3ListItem>

            <M3Divider />

            <M3ListItem interactive>
                <template #leading>
                    <M3Icon name="logout" />
                </template>

                {{ text.signOut }}
            </M3ListItem>
        </M3List>
    \`
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
            <M3ListItem interactive selected>
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

            <M3ListItem interactive disabled>
                <template #leading>
                    <M3Icon name="archive" />
                </template>

                {{ text.archive }}
            </M3ListItem>
        </M3List>
    \`
  })
}`,...v.parameters?.docs?.source}}}})))()}export{_ as a,m as i,d as n,g as o,h as r,b as s,v as t};