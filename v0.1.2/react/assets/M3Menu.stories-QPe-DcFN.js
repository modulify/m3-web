import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./button-Bg5IbSnS.js";import{r as c,t as l}from"./icon-qppvVYBr.js";import{i as u,n as d,t as f}from"./menu-CbcBHuJt.js";var p=t({Standard:()=>y,WithLeadingAndTrailingContent:()=>b,__namedExportsOrder:()=>x,default:()=>v}),m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{m=n(),s(),l(),f(),i(),h=a(),g={"en-US":{archive:`Archive`,editProfile:`Edit profile`,favorite:`Favorite`,items:[`Item 1`,`Item 2`,`Item 3`],open:`Open menu`,selected:`Selected`},"ru-RU":{archive:`Архивировать`,editProfile:`Изменить профиль`,favorite:`Избранное`,items:[`Пункт 1`,`Пункт 2`,`Пункт 3`],open:`Открыть меню`,selected:`Выбрано`}},_=({locale:e,target:t,...n})=>{let[i,a]=(0,m.useState)(null),s=r(e,g),c=(0,m.useCallback)(e=>(a(e),()=>{a(t=>t===e?null:t)}),[]);return(0,h.jsxs)(`div`,{style:{minHeight:`220px`,minWidth:`240px`},children:[(0,h.jsx)(o,{effects:[c],children:s.open}),(0,h.jsxs)(u,{target:i,...n,children:[(0,h.jsx)(d,{children:s.items[0]}),(0,h.jsx)(d,{selected:!0,children:s.items[1]}),(0,h.jsx)(d,{children:s.items[2]})]})]})},v={title:`Components/M3Menu`,component:u,args:{target:null},argTypes:{target:{control:!1},shown:{control:!1},onToggle:{control:!1},onShow:{control:!1},onHide:{control:!1},onDispose:{control:!1}},render:(e,{globals:t})=>(0,h.jsx)(_,{locale:t.locale,...e}),parameters:{layout:`centered`}},y={args:{target:null}},b={args:{target:null},render:({target:e,...t},{globals:n})=>{let[i,a]=(0,m.useState)(null),s=r(n.locale,g),l=(0,m.useCallback)(e=>(a(e),()=>{a(t=>t===e?null:t)}),[]);return(0,h.jsxs)(`div`,{style:{minHeight:`220px`,minWidth:`280px`},children:[(0,h.jsx)(o,{effects:[l],children:s.open}),(0,h.jsxs)(u,{target:i,...t,children:[(0,h.jsxs)(d,{children:[(0,h.jsx)(d.Leading,{children:(0,h.jsx)(c,{name:`edit`})}),s.editProfile]}),(0,h.jsxs)(d,{selected:!0,children:[(0,h.jsx)(d.Leading,{children:(0,h.jsx)(c,{name:`favorite`})}),s.favorite,(0,h.jsx)(d.Trailing,{children:(0,h.jsx)(`span`,{style:{fontSize:`12px`},children:s.selected})})]}),(0,h.jsx)(d,{disabled:!0,children:s.archive})]})]})}},x=[`Standard`,`WithLeadingAndTrailingContent`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    target: null
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
        <M3Button effects={[bindTarget]}>
          {text.open}
        </M3Button>

        <M3Menu target={target} {...args}>
          <M3MenuItem>
            <M3MenuItem.Leading>
              <M3Icon name="edit" />
            </M3MenuItem.Leading>
            {text.editProfile}
          </M3MenuItem>

          <M3MenuItem selected={true}>
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
}`,...b.parameters?.docs?.source}}}})))()}export{S as i,y as n,b as r,p as t};