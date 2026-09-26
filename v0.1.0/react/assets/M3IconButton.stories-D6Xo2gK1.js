import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{d as r,t as i}from"./hooks-CPk-xpjN.js";import{r as a,t as o}from"./icon-qppvVYBr.js";import{n as s,t as c}from"./icon-button-D8Zh6wJc.js";var l=t({AppearanceMatrix:()=>m,Standard:()=>f,Toggleable:()=>p,__namedExportsOrder:()=>h,default:()=>d}),u,d,f,p,m,h;function g(){return(g=e((()=>{o(),c(),i(),u=n(),d={title:`Components/M3IconButton`,component:s,argTypes:{appearance:{control:`select`,options:[`filled`,`outlined`,`standard`,`tonal`]},toggleable:{control:!1},selected:{control:!1},disabled:{control:`boolean`}},args:{appearance:`standard`,disabled:!1},render:e=>(0,u.jsx)(s,{...e,children:(0,u.jsx)(a,{name:`favorite`})}),parameters:{layout:`centered`}},f={},p={render:({toggleable:e,selected:t,onClick:n,...i})=>(0,u.jsx)(()=>{let e=r({selected:!1},[`selected`]);return(0,u.jsx)(s,{toggleable:!0,selected:e.selected,...i,onClick:()=>e.selected=!e.selected,children:(0,u.jsx)(a,{name:`favorite`})})},{})},m={render:()=>{let e={display:`flex`,flexWrap:`wrap`,gap:`16px`},t={display:`grid`,gap:`16px`},n=[`standard`,`filled`,`tonal`,`outlined`];return(0,u.jsxs)(`div`,{style:t,children:[(0,u.jsx)(`div`,{style:e,children:n.map(e=>(0,u.jsx)(s,{appearance:e,"aria-label":e,children:(0,u.jsx)(a,{name:`favorite`})},e))}),(0,u.jsx)(`div`,{style:e,children:n.map(e=>(0,u.jsx)(s,{appearance:e,"aria-label":e+`-disabled`,disabled:!0,children:(0,u.jsx)(a,{name:`favorite`})},e))})]})}},h=[`Standard`,`Toggleable`,`AppearanceMatrix`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: ({
    toggleable: _toggleable,
    selected: _selected,
    onClick: _onClick,
    ...args
  }) => {
    const M3IconButtonToggleable = () => {
      const state = useRecord({
        selected: false
      }, ['selected']);
      return <M3IconButton toggleable={true} selected={state.selected} {...args} onClick={() => state.selected = !state.selected}>
          <M3Icon name="favorite" />
        </M3IconButton>;
    };
    return <M3IconButtonToggleable />;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    const stack = {
      display: 'grid',
      gap: '16px'
    } satisfies CSSProperties;
    const appearances = ['standard', 'filled', 'tonal', 'outlined'] as const;
    return <div style={stack}>
        <div style={row}>
          {appearances.map(appearance => <M3IconButton key={appearance} appearance={appearance} aria-label={appearance}>
              <M3Icon name="favorite" />
            </M3IconButton>)}
        </div>

        <div style={row}>
          {appearances.map(appearance => <M3IconButton key={appearance} appearance={appearance} aria-label={appearance + '-disabled'} disabled={true}>
              <M3Icon name="favorite" />
            </M3IconButton>)}
        </div>
      </div>;
  }
}`,...m.parameters?.docs?.source}}}})))()}export{g as n,l as t};