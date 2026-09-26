import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{r as i,t as a}from"./icon-qppvVYBr.js";import{n as o,t as s}from"./fab-button-gcQJwemO.js";var c,l;function u(){return(u=e((()=>{c=[`sm`,`md`,`lg`],l=[`primary`,`secondary`,`surface`,`tertiary`]})))()}var d=t({Extended:()=>h,SizeMatrix:()=>_,Standard:()=>m,VariantMatrix:()=>g,__namedExportsOrder:()=>v,default:()=>p}),f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),s(),a(),u(),f=r(),p={title:`Components/M3FabButton`,component:o,argTypes:{variant:{control:`select`,options:l},size:{control:`select`,options:c},disabled:{control:`boolean`}},args:{variant:`primary`,size:`md`,disabled:!1},render:e=>(0,f.jsx)(o,{"aria-label":`Edit`,...e,children:(0,f.jsx)(i,{name:`edit`})}),parameters:{layout:`centered`}},m={},h={render:e=>(0,f.jsxs)(o,{...e,children:[(0,f.jsx)(i,{name:`edit`,"aria-hidden":`true`}),` Edit`]})},g={render:()=>{let e={display:`grid`,gap:`16px`},t={display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`center`};return(0,f.jsxs)(`div`,{style:e,children:[(0,f.jsx)(`div`,{style:t,children:l.map(e=>(0,f.jsx)(o,{variant:e,"aria-label":e,children:(0,f.jsx)(i,{name:`edit`})},e))}),(0,f.jsx)(`div`,{style:t,children:l.map(e=>(0,f.jsxs)(o,{variant:e,children:[(0,f.jsx)(i,{name:`edit`}),` New task`]},e))})]})}},_={render:()=>(0,f.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`center`},children:c.map(e=>(0,f.jsx)(o,{size:e,"aria-label":e,children:(0,f.jsx)(i,{name:`edit`})},e))})},v=[`Standard`,`Extended`,`VariantMatrix`,`SizeMatrix`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <M3FabButton {...args}>
      <M3Icon name="edit" aria-hidden="true" /> Edit
    </M3FabButton>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const stack = {
      display: 'grid',
      gap: '16px'
    } satisfies CSSProperties;
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center'
    } satisfies CSSProperties;
    return <div style={stack}>
        <div style={row}>
          {values.variants.map(variant => <M3FabButton key={variant} variant={variant} aria-label={variant}>
              <M3Icon name="edit" />
            </M3FabButton>)}
        </div>

        <div style={row}>
          {values.variants.map(variant => <M3FabButton key={variant} variant={variant}>
              <M3Icon name="edit" /> New task
            </M3FabButton>)}
        </div>
      </div>;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center'
    } satisfies CSSProperties;
    return <div style={row}>
        {values.sizes.map(size => <M3FabButton key={size} size={size} aria-label={size}>
            <M3Icon name="edit" />
          </M3FabButton>)}
      </div>;
  }
}`,..._.parameters?.docs?.source}}}})))()}export{y as n,d as t};