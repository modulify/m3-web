import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{r as o,t as s}from"./icon-qppvVYBr.js";import{n as c,t as l}from"./icon-button-D8Zh6wJc.js";import{n as u,t as d}from"./fab-button-gcQJwemO.js";import{i as f,n as p,o as m,t as h}from"./navigation-DG8AtNrZ.js";var g=t({ModalNavigationDrawer:()=>C,NavigationDrawer:()=>x,NavigationRail:()=>S,__namedExportsOrder:()=>w,default:()=>b}),_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{_=n(),d(),s(),l(),h(),i(),v=a(),y={"en-US":{close:`Close menu`,drafts:`Drafts`,family:`Family`,favorites:`Favorites`,inbox:`Inbox`,mail:`Mail`,open:`Open menu`,outbox:`Outbox`,personalFolders:`Personal folders`,trash:`Trash`,wedding:`Wedding`},"ru-RU":{close:`Закрыть меню`,drafts:`Черновики`,family:`Семья`,favorites:`Избранное`,inbox:`Входящие`,mail:`Почта`,open:`Открыть меню`,outbox:`Исходящие`,personalFolders:`Личные папки`,trash:`Корзина`,wedding:`Свадьба`}},b={title:`Components/M3Navigation`,component:f,argTypes:{appearance:{control:`select`,options:[`auto`,`bar`,`drawer`,`rail`]},alignment:{control:`select`,options:[`top`,`middle`,`bottom`]}},args:{appearance:`auto`,alignment:`top`},render:({expanded:e,onToggle:t,...n},{globals:i})=>{let[a,s]=(0,_.useState)(!1),l=r(i.locale,y);return(0,v.jsxs)(f,{expanded:a,...n,onToggle:s,children:[(0,v.jsxs)(f.Top,{children:[(0,v.jsx)(c,{"aria-label":l.open,onClick:()=>s(!0),children:(0,v.jsx)(o,{name:`menu`})}),(0,v.jsx)(u,{variant:`tertiary`,children:(0,v.jsx)(o,{name:`edit`})})]}),(0,v.jsx)(f.Header,{children:l.mail}),(0,v.jsxs)(p,{label:l.inbox,active:!0,children:[(0,v.jsx)(o,{name:`inbox`}),(0,v.jsx)(p.Badge,{children:`24`})]}),(0,v.jsx)(p,{label:l.outbox,children:(0,v.jsx)(o,{name:`send`})}),(0,v.jsx)(p,{label:l.favorites,children:(0,v.jsx)(o,{name:`favorite`})}),(0,v.jsx)(p,{label:l.trash,children:(0,v.jsx)(o,{name:`delete`})}),(0,v.jsxs)(m,{children:[(0,v.jsx)(m.Header,{children:l.personalFolders}),(0,v.jsx)(p,{label:l.family,children:(0,v.jsx)(o,{name:`folder`})}),(0,v.jsx)(p,{label:l.wedding,children:(0,v.jsx)(o,{name:`folder`})})]})]})},parameters:{layout:`centered`}},x={args:{appearance:`drawer`}},S={args:{appearance:`rail`}},C={render:({expanded:e,onToggle:t,...n},{globals:i})=>{let[a,s]=(0,_.useState)(!0),l=r(i.locale,y);return(0,v.jsxs)(f,{expanded:a,...n,onToggle:s,children:[(0,v.jsx)(f.Top,{children:(0,v.jsx)(c,{"aria-label":l.close,onClick:()=>s(!1),children:(0,v.jsx)(o,{name:`menu`})})}),(0,v.jsx)(f.Header,{children:l.mail}),(0,v.jsx)(p,{label:l.inbox,active:!0,children:(0,v.jsx)(o,{name:`inbox`})}),(0,v.jsx)(p,{label:l.drafts,children:(0,v.jsx)(o,{name:`mail`})}),(0,v.jsx)(p,{label:l.trash,children:(0,v.jsx)(o,{name:`delete`})})]})},args:{appearance:`drawer`}},w=[`NavigationDrawer`,`NavigationRail`,`ModalNavigationDrawer`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'drawer'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'rail'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: ({
    expanded: _expanded,
    onToggle: _onToggle,
    ...args
  }, {
    globals
  }) => {
    const [expanded, setExpanded] = useState(true);
    const text = localize(globals.locale, messages);
    return <M3Navigation expanded={expanded} {...args} onToggle={setExpanded}>
        <M3Navigation.Top>
          <M3IconButton aria-label={text.close} onClick={() => setExpanded(false)}>
            <M3Icon name="menu" />
          </M3IconButton>
        </M3Navigation.Top>

        <M3Navigation.Header>
          {text.mail}
        </M3Navigation.Header>

        <M3NavigationTab label={text.inbox} active>
          <M3Icon name="inbox" />
        </M3NavigationTab>

        <M3NavigationTab label={text.drafts}>
          <M3Icon name="mail" />
        </M3NavigationTab>

        <M3NavigationTab label={text.trash}>
          <M3Icon name="delete" />
        </M3NavigationTab>
      </M3Navigation>;
  },
  args: {
    appearance: 'drawer'
  }
}`,...C.parameters?.docs?.source}}}})))()}export{T as n,g as t};