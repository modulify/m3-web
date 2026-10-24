import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-D8ji4XVX.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{r as o,t as s}from"./icon-4W1iC_Ck.js";import{n as c,t as l}from"./button-wQR3CB3H.js";import{n as u,t as d}from"./divider-DovCy4jE.js";import{i as f,n as p,t as m}from"./menu-DOCR--sG.js";var h=t({GroupedWithSubmenu:()=>C,Standard:()=>x,Vibrant:()=>S,WithLeadingAndTrailingContent:()=>w,__namedExportsOrder:()=>T,default:()=>b}),g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{g=n(),l(),d(),s(),m(),i(),_=a(),v={"en-US":{archive:`Archive`,editProfile:`Edit profile`,favorite:`Favorite`,items:[`Item 1`,`Item 2`,`Item 3`],open:`Open menu`,selected:`Selected`,more:`More actions`},"ru-RU":{archive:`Архивировать`,editProfile:`Изменить профиль`,favorite:`Избранное`,items:[`Пункт 1`,`Пункт 2`,`Пункт 3`],open:`Открыть меню`,selected:`Выбрано`,more:`Другие действия`}},y=({locale:e,target:t,...n})=>{let[i,a]=(0,g.useState)(null),[o,s]=(0,g.useState)(!1),l=r(e,v),u=(0,g.useCallback)(e=>(a(e),()=>{a(t=>t===e?null:t)}),[]);return(0,_.jsxs)(`div`,{style:{minHeight:`220px`,minWidth:`240px`},children:[(0,_.jsx)(c,{effects:[u],"aria-haspopup":`menu`,"aria-expanded":o,children:l.open}),(0,_.jsxs)(f,{target:i,...n,onToggle:s,children:[(0,_.jsx)(p,{children:l.items[0]}),(0,_.jsx)(p,{selection:`single`,selected:!0,children:l.items[1]}),(0,_.jsx)(p,{children:l.items[2]})]})]})},b={title:`Components/M3Menu`,component:f,args:{target:null},argTypes:{target:{control:!1},shown:{control:!1},onToggle:{control:!1},onShow:{control:!1},onHide:{control:!1},onDispose:{control:!1}},render:(e,{globals:t})=>(0,_.jsx)(y,{locale:t.locale,...e}),parameters:{layout:`centered`}},x={args:{target:null}},S={args:{target:null,color:`vibrant`}},C={args:{target:null},render:({target:e,...t},{globals:n})=>{let[i,a]=(0,g.useState)(null),[o,s]=(0,g.useState)(!1),l=r(n.locale,v),d=(0,g.useCallback)(e=>(a(e),()=>a(t=>t===e?null:t)),[]);return(0,_.jsxs)(`div`,{style:{minHeight:`260px`,minWidth:`360px`},children:[(0,_.jsx)(c,{effects:[d],"aria-haspopup":`menu`,"aria-expanded":o,children:l.open}),(0,_.jsxs)(f,{target:i,...t,onToggle:s,children:[(0,_.jsx)(p,{children:l.editProfile}),(0,_.jsxs)(p,{children:[l.more,(0,_.jsxs)(p.Submenu,{children:[(0,_.jsx)(p,{children:l.favorite}),(0,_.jsx)(p,{children:l.archive})]})]}),(0,_.jsx)(u,{role:`separator`}),(0,_.jsx)(p,{disabled:!0,children:l.archive})]})]})}},w={args:{target:null},render:({target:e,...t},{globals:n})=>{let[i,a]=(0,g.useState)(null),[s,l]=(0,g.useState)(!1),u=r(n.locale,v),d=(0,g.useCallback)(e=>(a(e),()=>{a(t=>t===e?null:t)}),[]);return(0,_.jsxs)(`div`,{style:{minHeight:`220px`,minWidth:`280px`},children:[(0,_.jsx)(c,{effects:[d],"aria-haspopup":`menu`,"aria-expanded":s,children:u.open}),(0,_.jsxs)(f,{target:i,...t,onToggle:l,children:[(0,_.jsxs)(p,{children:[(0,_.jsx)(p.Leading,{children:(0,_.jsx)(o,{name:`edit`})}),u.editProfile]}),(0,_.jsxs)(p,{selection:`single`,selected:!0,children:[(0,_.jsx)(p.Leading,{children:(0,_.jsx)(o,{name:`favorite`})}),u.favorite,(0,_.jsx)(p.Trailing,{children:(0,_.jsx)(`span`,{style:{fontSize:`12px`},children:u.selected})})]}),(0,_.jsx)(p,{disabled:!0,children:u.archive})]})]})}},T=[`Standard`,`Vibrant`,`GroupedWithSubmenu`,`WithLeadingAndTrailingContent`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    target: null
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    target: null,
    color: 'vibrant'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    target: null
  },
  render: ({
    target: _target,
    ...args
  }, {
    globals
  }) => {
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);
    const text = localize(globals.locale, messages);
    const bindTarget = useCallback((el: HTMLElement) => {
      setTarget(el);
      return () => setTarget(current => current === el ? null : current);
    }, []);
    return <div style={{
      minHeight: '260px',
      minWidth: '360px'
    }}>
      <M3Button effects={[bindTarget]} aria-haspopup="menu" aria-expanded={open}>{text.open}</M3Button>
      <M3Menu target={target} {...args} onToggle={setOpen}>
        <M3MenuItem>{text.editProfile}</M3MenuItem>
        <M3MenuItem>
          {text.more}
          <M3MenuItem.Submenu>
            <M3MenuItem>{text.favorite}</M3MenuItem>
            <M3MenuItem>{text.archive}</M3MenuItem>
          </M3MenuItem.Submenu>
        </M3MenuItem>
        <M3Divider role="separator" />
        <M3MenuItem disabled>{text.archive}</M3MenuItem>
      </M3Menu>
    </div>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    target: null
  },
  render: ({
    target: _target,
    ...args
  }, {
    globals
  }) => {
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);
    const text = localize(globals.locale, messages);
    const bindTarget = useCallback((el: HTMLElement) => {
      setTarget(el);
      return () => {
        setTarget(current => current === el ? null : current);
      };
    }, []);
    return <div style={{
      minHeight: '220px',
      minWidth: '280px'
    }}>
        <M3Button effects={[bindTarget]} aria-haspopup="menu" aria-expanded={open}>
          {text.open}
        </M3Button>

        <M3Menu target={target} {...args} onToggle={setOpen}>
          <M3MenuItem>
            <M3MenuItem.Leading>
              <M3Icon name="edit" />
            </M3MenuItem.Leading>
            {text.editProfile}
          </M3MenuItem>

          <M3MenuItem selection="single" selected={true}>
            <M3MenuItem.Leading>
              <M3Icon name="favorite" />
            </M3MenuItem.Leading>
            {text.favorite}
            <M3MenuItem.Trailing>
              <span style={{
              fontSize: '12px'
            }}>{text.selected}</span>
            </M3MenuItem.Trailing>
          </M3MenuItem>

          <M3MenuItem disabled={true}>
            {text.archive}
          </M3MenuItem>
        </M3Menu>
      </div>;
  }
}`,...w.parameters?.docs?.source}}}})))()}export{E as a,w as i,x as n,S as r,h as t};