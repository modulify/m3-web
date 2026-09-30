import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-wale67Qv.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{d as a,t as o}from"./hooks-CPk-xpjN.js";import{r as s,t as c}from"./icon-qppvVYBr.js";import{n as l,t as u}from"./icon-button-D8Zh6wJc.js";var d=t({AppearanceMatrix:()=>_,Standard:()=>h,Toggleable:()=>g,__namedExportsOrder:()=>v,default:()=>m}),f,p,m,h,g,_,v;function y(){return(y=e((()=>{c(),u(),o(),r(),f=i(),p={"en-US":{favorite:`Favorite`,favoriteDisabled:`Favorite, disabled`},"ru-RU":{favorite:`Избранное`,favoriteDisabled:`Избранное, недоступно`}},m={title:`Components/M3IconButton`,component:l,argTypes:{appearance:{control:`select`,options:[`filled`,`outlined`,`standard`,`tonal`]},toggleable:{control:!1},selected:{control:!1},disabled:{control:`boolean`}},args:{appearance:`standard`,disabled:!1},render:(e,{globals:t})=>(0,f.jsx)(l,{"aria-label":n(t.locale,p).favorite,...e,children:(0,f.jsx)(s,{name:`favorite`})}),parameters:{layout:`centered`}},h={},g={render:({toggleable:e,selected:t,onClick:r,...i},{globals:o})=>(0,f.jsx)(()=>{let e=a({selected:!1},[`selected`]);return(0,f.jsx)(l,{toggleable:!0,selected:e.selected,"aria-label":n(o.locale,p).favorite,...i,onClick:()=>e.selected=!e.selected,children:(0,f.jsx)(s,{name:`favorite`})})},{})},_={render:(e,{globals:t})=>{let r=n(t.locale,p),i={display:`flex`,flexWrap:`wrap`,gap:`16px`},a={display:`grid`,gap:`16px`},o=[`standard`,`filled`,`tonal`,`outlined`];return(0,f.jsxs)(`div`,{style:a,children:[(0,f.jsx)(`div`,{style:i,children:o.map(e=>(0,f.jsx)(l,{appearance:e,"aria-label":r.favorite,children:(0,f.jsx)(s,{name:`favorite`})},e))}),(0,f.jsx)(`div`,{style:i,children:o.map(e=>(0,f.jsx)(l,{appearance:e,"aria-label":r.favoriteDisabled,disabled:!0,children:(0,f.jsx)(s,{name:`favorite`})},e))})]})}},v=[`Standard`,`Toggleable`,`AppearanceMatrix`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: ({
    toggleable: _toggleable,
    selected: _selected,
    onClick: _onClick,
    ...args
  }, {
    globals
  }) => {
    const M3IconButtonToggleable = () => {
      const state = useRecord({
        selected: false
      }, ['selected']);
      return <M3IconButton toggleable={true} selected={state.selected} aria-label={localize(globals.locale, messages).favorite} {...args} onClick={() => state.selected = !state.selected}>
          <M3Icon name="favorite" />
        </M3IconButton>;
    };
    return <M3IconButtonToggleable />;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
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
          {appearances.map(appearance => <M3IconButton key={appearance} appearance={appearance} aria-label={text.favorite}>
              <M3Icon name="favorite" />
            </M3IconButton>)}
        </div>

        <div style={row}>
          {appearances.map(appearance => <M3IconButton key={appearance} appearance={appearance} aria-label={text.favoriteDisabled} disabled={true}>
              <M3Icon name="favorite" />
            </M3IconButton>)}
        </div>
      </div>;
  }
}`,..._.parameters?.docs?.source}}}})))()}export{y as n,d as t};