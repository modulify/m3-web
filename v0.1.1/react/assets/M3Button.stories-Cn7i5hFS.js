import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./button-Bg5IbSnS.js";import{r as c,t as l}from"./icon-qppvVYBr.js";var u;function d(){return(d=e((()=>{u=[`elevated`,`filled`,`outlined`,`text`,`tonal`]})))()}var f=t({AppearanceMatrix:()=>v,DisabledStates:()=>y,WithLeadingIcon:()=>_,WithTextOnly:()=>g,__namedExportsOrder:()=>b,default:()=>h}),p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),s(),l(),d(),i(),p=a(),m={"en-US":{share:`Share`},"ru-RU":{share:`Поделиться`}},h={title:`Components/M3Button`,component:o,argTypes:{appearance:{control:`select`,options:u},href:{control:`text`},disabled:{control:`boolean`}},args:{appearance:`filled`,disabled:!1},render:(e,{globals:t})=>(0,p.jsx)(o,{...e,children:r(t.locale,m).share}),parameters:{layout:`centered`}},g={},_={render:(e,{globals:t})=>(0,p.jsxs)(o,{...e,children:[(0,p.jsx)(c,{name:`share`}),` `,r(t.locale,m).share]})},v={render:(e,{globals:t})=>{let n=r(t.locale,m),i={display:`grid`,gap:`16px`},a={display:`flex`,flexWrap:`wrap`,gap:`16px`};return(0,p.jsxs)(`div`,{style:i,children:[(0,p.jsx)(`div`,{style:a,children:u.map(e=>(0,p.jsx)(o,{appearance:e,children:n.share},e))}),(0,p.jsx)(`div`,{style:a,children:u.map(e=>(0,p.jsxs)(o,{appearance:e,children:[(0,p.jsx)(c,{name:`share`}),` `,n.share]},e))})]})}},y={render:(e,{globals:t})=>{let n=r(t.locale,m);return(0,p.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`},children:u.map(e=>(0,p.jsx)(o,{appearance:e,disabled:!0,children:n.share},e))})}},b=[`WithTextOnly`,`WithLeadingIcon`,`AppearanceMatrix`,`DisabledStates`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => <M3Button {...args}>
      <M3Icon name="share" /> {localize(globals.locale, messages).share}
    </M3Button>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const stack = {
      display: 'grid',
      gap: '16px'
    } satisfies CSSProperties;
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    return <div style={stack}>
        <div style={row}>
          {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance}>
              {text.share}
            </M3Button>)}
        </div>

        <div style={row}>
          {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance}>
              <M3Icon name="share" /> {text.share}
            </M3Button>)}
        </div>
      </div>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    return <div style={row}>
        {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance} disabled={true}>
            {text.share}
          </M3Button>)}
      </div>;
  }
}`,...y.parameters?.docs?.source}}}})))()}export{x as n,f as t};