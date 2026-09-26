import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./button-Bg5IbSnS.js";import{r as o,t as s}from"./icon-qppvVYBr.js";import{i as c,n as l,t as u}from"./menu-CbcBHuJt.js";var d=t({Standard:()=>g,WithLeadingAndTrailingContent:()=>_,__namedExportsOrder:()=>v,default:()=>h}),f,p,m,h,g,_,v;function y(){return(y=e((()=>{f=n(),a(),s(),u(),p=r(),m=({target:e,...t})=>{let[n,r]=(0,f.useState)(null),a=(0,f.useCallback)(e=>(r(e),()=>{r(t=>t===e?null:t)}),[]);return(0,p.jsxs)(`div`,{style:{minHeight:`220px`,minWidth:`240px`},children:[(0,p.jsx)(i,{effects:[a],children:`Open menu`}),(0,p.jsxs)(c,{target:n,...t,children:[(0,p.jsx)(l,{children:`Item 1`}),(0,p.jsx)(l,{selected:!0,children:`Item 2`}),(0,p.jsx)(l,{children:`Item 3`})]})]})},h={title:`Components/M3Menu`,component:c,args:{target:null},argTypes:{target:{control:!1},shown:{control:!1},onToggle:{control:!1},onShow:{control:!1},onHide:{control:!1},onDispose:{control:!1}},render:e=>(0,p.jsx)(m,{...e}),parameters:{layout:`centered`}},g={args:{target:null}},_={args:{target:null},render:({target:e,...t})=>{let[n,r]=(0,f.useState)(null),a=(0,f.useCallback)(e=>(r(e),()=>{r(t=>t===e?null:t)}),[]);return(0,p.jsxs)(`div`,{style:{minHeight:`220px`,minWidth:`280px`},children:[(0,p.jsx)(i,{effects:[a],children:`Open menu`}),(0,p.jsxs)(c,{target:n,...t,children:[(0,p.jsxs)(l,{children:[(0,p.jsx)(l.Leading,{children:(0,p.jsx)(o,{name:`edit`})}),`Edit profile`]}),(0,p.jsxs)(l,{selected:!0,children:[(0,p.jsx)(l.Leading,{children:(0,p.jsx)(o,{name:`favorite`})}),`Favorite`,(0,p.jsx)(l.Trailing,{children:(0,p.jsx)(`span`,{style:{fontSize:`12px`},children:`Selected`})})]}),(0,p.jsx)(l,{disabled:!0,children:`Archive`})]})]})}},v=[`Standard`,`WithLeadingAndTrailingContent`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    target: null
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    target: null
  },
  render: ({
    target: _target,
    ...args
  }) => {
    const [target, setTarget] = useState<HTMLElement | null>(null);
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
          Open menu
        </M3Button>

        <M3Menu target={target} {...args}>
          <M3MenuItem>
            <M3MenuItem.Leading>
              <M3Icon name="edit" />
            </M3MenuItem.Leading>
            Edit profile
          </M3MenuItem>

          <M3MenuItem selected={true}>
            <M3MenuItem.Leading>
              <M3Icon name="favorite" />
            </M3MenuItem.Leading>
            Favorite
            <M3MenuItem.Trailing>
              <span style={{
              fontSize: '12px'
            }}>Selected</span>
            </M3MenuItem.Trailing>
          </M3MenuItem>

          <M3MenuItem disabled={true}>
            Archive
          </M3MenuItem>
        </M3Menu>
      </div>;
  }
}`,..._.parameters?.docs?.source}}}})))()}export{y as i,g as n,_ as r,d as t};