import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{r as i,t as a}from"./icon-qppvVYBr.js";import{n as o,t as s}from"./icon-button-D8Zh6wJc.js";import{n as c,t as l}from"./fab-button-gcQJwemO.js";import{i as u,n as d,o as f,t as p}from"./navigation-ChEsr25Y.js";var m=t({ModalNavigationDrawer:()=>b,NavigationDrawer:()=>v,NavigationRail:()=>y,__namedExportsOrder:()=>x,default:()=>_}),h,g,_,v,y,b,x;function S(){return(S=e((()=>{h=n(),l(),a(),s(),p(),g=r(),_={title:`Components/M3Navigation`,component:u,argTypes:{appearance:{control:`select`,options:[`auto`,`bar`,`drawer`,`rail`]},alignment:{control:`select`,options:[`top`,`middle`,`bottom`]}},args:{appearance:`auto`,alignment:`top`},render:({expanded:e,onToggle:t,...n})=>{let[r,a]=(0,h.useState)(!1);return(0,g.jsxs)(u,{expanded:r,...n,onToggle:a,children:[(0,g.jsxs)(u.Top,{children:[(0,g.jsx)(o,{"aria-label":`Open menu`,onClick:()=>a(!0),children:(0,g.jsx)(i,{name:`menu`})}),(0,g.jsx)(c,{variant:`tertiary`,children:(0,g.jsx)(i,{name:`edit`})})]}),(0,g.jsx)(u.Header,{children:`Mail`}),(0,g.jsxs)(d,{label:`Inbox`,active:!0,children:[(0,g.jsx)(i,{name:`inbox`}),(0,g.jsx)(d.Badge,{children:`24`})]}),(0,g.jsx)(d,{label:`Outbox`,children:(0,g.jsx)(i,{name:`send`})}),(0,g.jsx)(d,{label:`Favorites`,children:(0,g.jsx)(i,{name:`favorite`})}),(0,g.jsx)(d,{label:`Trash`,children:(0,g.jsx)(i,{name:`delete`})}),(0,g.jsxs)(f,{children:[(0,g.jsx)(f.Header,{children:`Personal folders`}),(0,g.jsx)(d,{label:`Family`,children:(0,g.jsx)(i,{name:`folder`})}),(0,g.jsx)(d,{label:`Wedding`,children:(0,g.jsx)(i,{name:`folder`})})]})]})},parameters:{layout:`centered`}},v={args:{appearance:`drawer`}},y={args:{appearance:`rail`}},b={render:({expanded:e,onToggle:t,...n})=>{let[r,a]=(0,h.useState)(!0);return(0,g.jsxs)(u,{expanded:r,...n,onToggle:a,children:[(0,g.jsx)(u.Top,{children:(0,g.jsx)(o,{"aria-label":`Close menu`,onClick:()=>a(!1),children:(0,g.jsx)(i,{name:`menu`})})}),(0,g.jsx)(u.Header,{children:`Mail`}),(0,g.jsx)(d,{label:`Inbox`,active:!0,children:(0,g.jsx)(i,{name:`inbox`})}),(0,g.jsx)(d,{label:`Drafts`,children:(0,g.jsx)(i,{name:`mail`})}),(0,g.jsx)(d,{label:`Trash`,children:(0,g.jsx)(i,{name:`delete`})})]})},args:{appearance:`drawer`}},x=[`NavigationDrawer`,`NavigationRail`,`ModalNavigationDrawer`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'drawer'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'rail'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: ({
    expanded: _expanded,
    onToggle: _onToggle,
    ...args
  }) => {
    const [expanded, setExpanded] = useState(true);
    return <M3Navigation expanded={expanded} {...args} onToggle={setExpanded}>
        <M3Navigation.Top>
          <M3IconButton aria-label="Close menu" onClick={() => setExpanded(false)}>
            <M3Icon name="menu" />
          </M3IconButton>
        </M3Navigation.Top>

        <M3Navigation.Header>
          Mail
        </M3Navigation.Header>

        <M3NavigationTab label="Inbox" active>
          <M3Icon name="inbox" />
        </M3NavigationTab>

        <M3NavigationTab label="Drafts">
          <M3Icon name="mail" />
        </M3NavigationTab>

        <M3NavigationTab label="Trash">
          <M3Icon name="delete" />
        </M3NavigationTab>
      </M3Navigation>;
  },
  args: {
    appearance: 'drawer'
  }
}`,...b.parameters?.docs?.source}}}})))()}export{S as n,m as t};