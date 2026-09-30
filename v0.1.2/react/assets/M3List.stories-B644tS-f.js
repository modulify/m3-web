import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-wale67Qv.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{r as a,t as o}from"./icon-qppvVYBr.js";import{i as s,n as c,t as l}from"./list-DDgv9osp.js";var u=t({InteractiveSelection:()=>g,Standard:()=>m,SupportingText:()=>h,__namedExportsOrder:()=>_,default:()=>p}),d,f,p,m,h,g,_;function v(){return(v=e((()=>{o(),l(),r(),d=i(),f={"en-US":{archive:`Archive`,bluetoothSupport:`Connected to office network`,folders:`Folders`,inbox:`Inbox`,messages:`Messages`,notifications:`Notifications`,on:`On`,planning:`Planning meeting`,planningSupport:`Design sync moved to 15:00. Review the agenda before joining.`,review:`Review updates`,reviewSupport:`Two unread comments in the component review thread.`,sent:`Sent`,settings:`Settings`,today:`Today`},"ru-RU":{archive:`Архив`,bluetoothSupport:`Подключено к офисной сети`,folders:`Папки`,inbox:`Входящие`,messages:`Сообщения`,notifications:`Уведомления`,on:`Включено`,planning:`Планирование`,planningSupport:`Синхронизацию по дизайну перенесли на 15:00. Просмотрите повестку перед встречей.`,review:`Обновления ревью`,reviewSupport:`Два непрочитанных комментария в обсуждении компонентов.`,sent:`Отправленные`,settings:`Настройки`,today:`Сегодня`}},p={title:`Components/M3List`,component:s,argTypes:{divided:{control:`boolean`}},args:{divided:!1},render:(e,{globals:t})=>{let r=n(t.locale,f);return(0,d.jsxs)(s,{"aria-label":r.settings,...e,children:[(0,d.jsxs)(c,{children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`wifi`})}),`Wi-Fi`,(0,d.jsx)(c.Trailing,{children:r.on})]}),(0,d.jsxs)(c,{supportingText:r.bluetoothSupport,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`bluetooth`})}),`Bluetooth`]}),(0,d.jsxs)(c,{href:`#notifications`,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`notifications`})}),r.notifications,(0,d.jsx)(c.Trailing,{children:(0,d.jsx)(a,{name:`chevron_right`})})]})]})},parameters:{layout:`centered`}},m={},h={render:(e,{globals:t})=>{let r=n(t.locale,f);return(0,d.jsxs)(s,{"aria-label":r.messages,...e,children:[(0,d.jsxs)(c,{overline:r.today,supportingText:r.planningSupport,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`event`})}),r.planning,(0,d.jsx)(c.Trailing,{children:`14:12`})]}),(0,d.jsxs)(c,{supportingText:r.reviewSupport,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`chat`})}),r.review,(0,d.jsx)(c.Trailing,{children:`09:30`})]})]})}},g={args:{divided:!0},render:(e,{globals:t})=>{let r=n(t.locale,f);return(0,d.jsxs)(s,{"aria-label":r.folders,...e,children:[(0,d.jsxs)(c,{selected:!0,interactive:!0,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`inbox`})}),r.inbox,(0,d.jsx)(c.Trailing,{children:`24`})]}),(0,d.jsxs)(c,{interactive:!0,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`send`})}),r.sent]}),(0,d.jsxs)(c,{disabled:!0,interactive:!0,children:[(0,d.jsx)(c.Leading,{children:(0,d.jsx)(a,{name:`archive`})}),r.archive]})]})}},_=[`Standard`,`SupportingText`,`InteractiveSelection`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3List aria-label={text.messages} {...args}>
      <M3ListItem overline={text.today} supportingText={text.planningSupport}>
        <M3ListItem.Leading>
          <M3Icon name="event" />
        </M3ListItem.Leading>
        {text.planning}
        <M3ListItem.Trailing>
          14:12
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem supportingText={text.reviewSupport}>
        <M3ListItem.Leading>
          <M3Icon name="chat" />
        </M3ListItem.Leading>
        {text.review}
        <M3ListItem.Trailing>
          09:30
        </M3ListItem.Trailing>
      </M3ListItem>
    </M3List>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    divided: true
  },
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3List aria-label={text.folders} {...args}>
      <M3ListItem selected={true} interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="inbox" />
        </M3ListItem.Leading>
        {text.inbox}
        <M3ListItem.Trailing>
          24
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="send" />
        </M3ListItem.Leading>
        {text.sent}
      </M3ListItem>

      <M3ListItem disabled={true} interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="archive" />
        </M3ListItem.Leading>
        {text.archive}
      </M3ListItem>
    </M3List>;
  }
}`,...g.parameters?.docs?.source}}}})))()}export{v as a,h as i,u as n,m as r,g as t};