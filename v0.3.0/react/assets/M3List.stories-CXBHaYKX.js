import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-D8ji4XVX.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{r as a,t as o}from"./icon-4W1iC_Ck.js";import{i as s,n as c,t as l}from"./list-CJ1-0UU1.js";import{n as u,t as d}from"./divider-DovCy4jE.js";var f=t({InteractiveSelection:()=>b,Segmented:()=>_,Standard:()=>g,SupportingText:()=>y,WithDivider:()=>v,__namedExportsOrder:()=>x,default:()=>h}),p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{d(),o(),l(),r(),p=i(),m={"en-US":{archive:`Archive`,bluetoothSupport:`Connected to office network`,folders:`Folders`,inbox:`Inbox`,messages:`Messages`,notifications:`Notifications`,planning:`Planning meeting`,planningSupport:`Design sync moved to 15:00. Review the agenda before joining.`,review:`Review updates`,reviewSupport:`Two unread comments in the component review thread.`,privacy:`Privacy`,profile:`Profile`,sent:`Sent`,settings:`Settings`,signOut:`Sign out`,today:`Today`},"ru-RU":{archive:`Архив`,bluetoothSupport:`Подключено к офисной сети`,folders:`Папки`,inbox:`Входящие`,messages:`Сообщения`,notifications:`Уведомления`,planning:`Планирование`,planningSupport:`Синхронизацию по дизайну перенесли на 15:00. Просмотрите повестку перед встречей.`,review:`Обновления ревью`,reviewSupport:`Два непрочитанных комментария в обсуждении компонентов.`,privacy:`Конфиденциальность`,profile:`Профиль`,sent:`Отправленные`,settings:`Настройки`,signOut:`Выйти`,today:`Сегодня`}},h={title:`Components/M3List`,component:s,argTypes:{appearance:{control:`select`,options:[`standard`,`segmented`]}},render:(e,{globals:t})=>{let r=n(t.locale,m);return(0,p.jsxs)(s,{"aria-label":r.settings,...e,children:[(0,p.jsxs)(c,{children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`wifi`})}),`Wi-Fi`,(0,p.jsx)(c.Trailing,{children:(0,p.jsx)(a,{name:`check`})})]}),(0,p.jsxs)(c,{supportingText:r.bluetoothSupport,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`bluetooth`})}),`Bluetooth`]}),(0,p.jsxs)(c,{href:`javascript:void(0);`,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`notifications`})}),r.notifications,(0,p.jsx)(c.Trailing,{children:(0,p.jsx)(a,{name:`chevron_right`})})]})]})},parameters:{layout:`centered`}},g={},_={args:{appearance:`segmented`}},v={render:(e,{globals:t})=>{let r=n(t.locale,m),i={...e,appearance:`standard`};return(0,p.jsxs)(s,{"aria-label":r.settings,...i,children:[(0,p.jsxs)(c,{interactive:!0,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`account_circle`})}),r.profile]}),(0,p.jsxs)(c,{interactive:!0,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`lock`})}),r.privacy]}),(0,p.jsx)(u,{}),(0,p.jsxs)(c,{interactive:!0,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`logout`})}),r.signOut]})]})}},y={render:(e,{globals:t})=>{let r=n(t.locale,m);return(0,p.jsxs)(s,{"aria-label":r.messages,...e,children:[(0,p.jsxs)(c,{overline:r.today,supportingText:r.planningSupport,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`event`})}),r.planning,(0,p.jsx)(c.Trailing,{children:`14:12`})]}),(0,p.jsxs)(c,{supportingText:r.reviewSupport,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`chat`})}),r.review,(0,p.jsx)(c.Trailing,{children:`09:30`})]})]})}},b={render:(e,{globals:t})=>{let r=n(t.locale,m);return(0,p.jsxs)(s,{"aria-label":r.folders,...e,children:[(0,p.jsxs)(c,{interactive:!0,selected:!0,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`inbox`})}),r.inbox,(0,p.jsx)(c.Trailing,{children:`24`})]}),(0,p.jsxs)(c,{interactive:!0,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`send`})}),r.sent]}),(0,p.jsxs)(c,{interactive:!0,disabled:!0,children:[(0,p.jsx)(c.Leading,{children:(0,p.jsx)(a,{name:`archive`})}),r.archive]})]})}},x=[`Standard`,`Segmented`,`WithDivider`,`SupportingText`,`InteractiveSelection`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'segmented'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const listProps = {
      ...args,
      appearance: 'standard' as const
    };
    return <M3List aria-label={text.settings} {...listProps}>
      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="account_circle" />
        </M3ListItem.Leading>
        {text.profile}
      </M3ListItem>

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="lock" />
        </M3ListItem.Leading>
        {text.privacy}
      </M3ListItem>

      <M3Divider />

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="logout" />
        </M3ListItem.Leading>
        {text.signOut}
      </M3ListItem>
    </M3List>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3List aria-label={text.folders} {...args}>
      <M3ListItem interactive={true} selected={true}>
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

      <M3ListItem interactive={true} disabled={true}>
        <M3ListItem.Leading>
          <M3Icon name="archive" />
        </M3ListItem.Leading>
        {text.archive}
      </M3ListItem>
    </M3List>;
  }
}`,...b.parameters?.docs?.source}}}})))()}export{y as a,g as i,f as n,v as o,_ as r,S as s,b as t};