import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./button-Bg5IbSnS.js";import{r as o,t as s}from"./icon-qppvVYBr.js";var c;function l(){return(l=e((()=>{c=[`elevated`,`filled`,`outlined`,`text`,`tonal`]})))()}var u=t({AppearanceMatrix:()=>h,DisabledStates:()=>g,WithLeadingIcon:()=>m,WithTextOnly:()=>p,__namedExportsOrder:()=>_,default:()=>f}),d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),a(),s(),l(),d=r(),f={title:`Components/M3Button`,component:i,argTypes:{appearance:{control:`select`,options:c},href:{control:`text`},disabled:{control:`boolean`}},args:{appearance:`filled`,disabled:!1},render:e=>(0,d.jsx)(i,{...e,children:`Share`}),parameters:{layout:`centered`}},p={},m={render:e=>(0,d.jsxs)(i,{...e,children:[(0,d.jsx)(o,{name:`share`}),` Share`]})},h={render:()=>{let e={display:`grid`,gap:`16px`},t={display:`flex`,flexWrap:`wrap`,gap:`16px`};return(0,d.jsxs)(`div`,{style:e,children:[(0,d.jsx)(`div`,{style:t,children:c.map(e=>(0,d.jsx)(i,{appearance:e,children:`Share`},e))}),(0,d.jsx)(`div`,{style:t,children:c.map(e=>(0,d.jsxs)(i,{appearance:e,children:[(0,d.jsx)(o,{name:`share`}),` Share`]},e))})]})}},g={render:()=>(0,d.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`},children:c.map(e=>(0,d.jsx)(i,{appearance:e,disabled:!0,children:`Share`},e))})},_=[`WithTextOnly`,`WithLeadingIcon`,`AppearanceMatrix`,`DisabledStates`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <M3Button {...args}>
      <M3Icon name="share" /> Share
    </M3Button>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
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
              Share
            </M3Button>)}
        </div>

        <div style={row}>
          {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance}>
              <M3Icon name="share" /> Share
            </M3Button>)}
        </div>
      </div>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    return <div style={row}>
        {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance} disabled={true}>
            Share
          </M3Button>)}
      </div>;
  }
}`,...g.parameters?.docs?.source}}}})))()}export{v as n,u as t};