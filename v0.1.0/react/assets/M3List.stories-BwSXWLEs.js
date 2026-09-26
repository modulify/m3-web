import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{r,t as i}from"./icon-qppvVYBr.js";import{i as a,n as o,t as s}from"./list-DDgv9osp.js";var c=t({InteractiveSelection:()=>p,Standard:()=>d,SupportingText:()=>f,__namedExportsOrder:()=>m,default:()=>u}),l,u,d,f,p,m;function h(){return(h=e((()=>{i(),s(),l=n(),u={title:`Components/M3List`,component:a,argTypes:{divided:{control:`boolean`}},args:{divided:!1},render:e=>(0,l.jsxs)(a,{"aria-label":`Settings`,...e,children:[(0,l.jsxs)(o,{children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`wifi`})}),`Wi-Fi`,(0,l.jsx)(o.Trailing,{children:`On`})]}),(0,l.jsxs)(o,{supportingText:`Connected to office network`,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`bluetooth`})}),`Bluetooth`]}),(0,l.jsxs)(o,{href:`#notifications`,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`notifications`})}),`Notifications`,(0,l.jsx)(o.Trailing,{children:(0,l.jsx)(r,{name:`chevron_right`})})]})]}),parameters:{layout:`centered`}},d={},f={render:e=>(0,l.jsxs)(a,{"aria-label":`Messages`,...e,children:[(0,l.jsxs)(o,{overline:`Today`,supportingText:`Design sync moved to 15:00. Review the agenda before joining.`,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`event`})}),`Planning meeting`,(0,l.jsx)(o.Trailing,{children:`14:12`})]}),(0,l.jsxs)(o,{supportingText:`Two unread comments in the component review thread.`,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`chat`})}),`Review updates`,(0,l.jsx)(o.Trailing,{children:`09:30`})]})]})},p={args:{divided:!0},render:e=>(0,l.jsxs)(a,{"aria-label":`Folders`,...e,children:[(0,l.jsxs)(o,{selected:!0,interactive:!0,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`inbox`})}),`Inbox`,(0,l.jsx)(o.Trailing,{children:`24`})]}),(0,l.jsxs)(o,{interactive:!0,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`send`})}),`Sent`]}),(0,l.jsxs)(o,{disabled:!0,interactive:!0,children:[(0,l.jsx)(o.Leading,{children:(0,l.jsx)(r,{name:`archive`})}),`Archive`]})]})},m=[`Standard`,`SupportingText`,`InteractiveSelection`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <M3List aria-label="Messages" {...args}>
      <M3ListItem overline="Today" supportingText="Design sync moved to 15:00. Review the agenda before joining.">
        <M3ListItem.Leading>
          <M3Icon name="event" />
        </M3ListItem.Leading>
        Planning meeting
        <M3ListItem.Trailing>
          14:12
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem supportingText="Two unread comments in the component review thread.">
        <M3ListItem.Leading>
          <M3Icon name="chat" />
        </M3ListItem.Leading>
        Review updates
        <M3ListItem.Trailing>
          09:30
        </M3ListItem.Trailing>
      </M3ListItem>
    </M3List>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    divided: true
  },
  render: args => <M3List aria-label="Folders" {...args}>
      <M3ListItem selected={true} interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="inbox" />
        </M3ListItem.Leading>
        Inbox
        <M3ListItem.Trailing>
          24
        </M3ListItem.Trailing>
      </M3ListItem>

      <M3ListItem interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="send" />
        </M3ListItem.Leading>
        Sent
      </M3ListItem>

      <M3ListItem disabled={true} interactive={true}>
        <M3ListItem.Leading>
          <M3Icon name="archive" />
        </M3ListItem.Leading>
        Archive
      </M3ListItem>
    </M3List>
}`,...p.parameters?.docs?.source}}}})))()}export{h as a,f as i,c as n,d as r,p as t};