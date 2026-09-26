import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{r as i,t as a}from"./icon-qppvVYBr.js";import{n as o,t as s}from"./text-field-BuKOTzpw.js";var c=t({MultilineOutlined:()=>g,OutlinedWithLeadingIcon:()=>h,PasswordField:()=>m,TextField:()=>p,__namedExportsOrder:()=>v,default:()=>f}),l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{l=n(),a(),s(),u=r(),d=({value:e,onUpdate:t,...n})=>{let[r,i]=(0,l.useState)(``);return(0,u.jsx)(`div`,{style:{width:`320px`},children:(0,u.jsx)(o,{value:r,...n,onUpdate:i})})},f={title:`Components/M3TextField`,component:o,argTypes:{type:{control:`select`,options:[`email`,`number`,`password`,`search`,`tel`,`text`,`url`]},onInput:{control:!1},onChange:{control:!1},onUpdate:{control:!1}},args:{type:`text`,label:`Text field`},render:e=>(0,u.jsx)(d,{...e}),parameters:{layout:`centered`}},p={args:{type:`text`,label:`Text field`}},m={args:{type:`password`,label:`Password field`}},h={render:e=>(0,u.jsx)(`div`,{style:{width:`320px`},children:(0,u.jsx)(_,{...e})}),args:{type:`email`,label:`Email`,outlined:!0,placeholder:`name@example.com`}},g={args:{label:`About`,outlined:!0,multiline:!0,placeholder:`Add a short summary`}},_=({value:e,onUpdate:t,...n})=>{let[r,a]=(0,l.useState)(``);return(0,u.jsx)(o,{value:r,...n,onUpdate:a,children:(0,u.jsx)(o.LeadingIcon,{children:(0,u.jsx)(i,{name:`mail`})})})},v=[`TextField`,`PasswordField`,`OutlinedWithLeadingIcon`,`MultilineOutlined`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'text',
    label: 'Text field'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'password',
    label: 'Password field'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: '320px'
  }}>
      <M3TextFieldStoryWithLeadingIcon {...args} />
    </div>,
  args: {
    type: 'email',
    label: 'Email',
    outlined: true,
    placeholder: 'name@example.com'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'About',
    outlined: true,
    multiline: true,
    placeholder: 'Add a short summary'
  }
}`,...g.parameters?.docs?.source}}}})))()}export{y as n,c as t};