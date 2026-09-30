import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{r as o,t as s}from"./icon-qppvVYBr.js";import{n as c,t as l}from"./fab-button-gcQJwemO.js";var u,d;function f(){return(f=e((()=>{u=[`sm`,`md`,`lg`],d=[`primary`,`secondary`,`surface`,`tertiary`]})))()}var p=t({Extended:()=>v,SizeMatrix:()=>b,Standard:()=>_,VariantMatrix:()=>y,__namedExportsOrder:()=>x,default:()=>g}),m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),l(),s(),f(),i(),m=a(),h={"en-US":{edit:`Edit`,newTask:`New task`},"ru-RU":{edit:`Редактировать`,newTask:`Новая задача`}},g={title:`Components/M3FabButton`,component:c,argTypes:{variant:{control:`select`,options:d},size:{control:`select`,options:u},disabled:{control:`boolean`}},args:{variant:`primary`,size:`md`,disabled:!1},render:(e,{globals:t})=>(0,m.jsx)(c,{"aria-label":r(t.locale,h).edit,...e,children:(0,m.jsx)(o,{name:`edit`})}),parameters:{layout:`centered`}},_={},v={render:(e,{globals:t})=>(0,m.jsxs)(c,{...e,children:[(0,m.jsx)(o,{name:`edit`,"aria-hidden":`true`}),` `,r(t.locale,h).edit]})},y={render:(e,{globals:t})=>{let n=r(t.locale,h),i={display:`grid`,gap:`16px`},a={display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`center`};return(0,m.jsxs)(`div`,{style:i,children:[(0,m.jsx)(`div`,{style:a,children:d.map(e=>(0,m.jsx)(c,{variant:e,"aria-label":e,children:(0,m.jsx)(o,{name:`edit`})},e))}),(0,m.jsx)(`div`,{style:a,children:d.map(e=>(0,m.jsxs)(c,{variant:e,children:[(0,m.jsx)(o,{name:`edit`}),` `,n.newTask]},e))})]})}},b={render:()=>(0,m.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`center`},children:u.map(e=>(0,m.jsx)(c,{size:e,"aria-label":e,children:(0,m.jsx)(o,{name:`edit`})},e))})},x=[`Standard`,`Extended`,`VariantMatrix`,`SizeMatrix`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => <M3FabButton {...args}>
      <M3Icon name="edit" aria-hidden="true" /> {localize(globals.locale, messages).edit}
    </M3FabButton>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
              <M3Icon name="edit" /> {text.newTask}
            </M3FabButton>)}
        </div>
      </div>;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}}})))()}export{S as n,p as t};