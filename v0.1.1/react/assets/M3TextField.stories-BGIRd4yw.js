import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{r as o,t as s}from"./icon-qppvVYBr.js";import{n as c,t as l}from"./text-field-wTly4MSw.js";var u=t({MultilineOutlined:()=>y,OutlinedWithLeadingIcon:()=>v,PasswordField:()=>_,TextField:()=>g,__namedExportsOrder:()=>x,default:()=>h}),d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{d=n(),s(),l(),i(),f=a(),p={"en-US":{about:`About`,email:`Email`,password:`Password field`,summary:`Add a short summary`,text:`Text field`},"ru-RU":{about:`О себе`,email:`Электронная почта`,password:`Пароль`,summary:`Добавьте краткое описание`,text:`Текстовое поле`}},m=({value:e,onUpdate:t,...n})=>{let[r,i]=(0,d.useState)(``);return(0,f.jsx)(`div`,{style:{width:`320px`},children:(0,f.jsx)(c,{value:r,...n,onUpdate:i})})},h={title:`Components/M3TextField`,component:c,argTypes:{type:{control:`select`,options:[`email`,`number`,`password`,`search`,`tel`,`text`,`url`]},onInput:{control:!1},onChange:{control:!1},onUpdate:{control:!1}},args:{type:`text`,label:`Text field`},render:(e,{globals:t})=>(0,f.jsx)(m,{...e,label:r(t.locale,p).text}),parameters:{layout:`centered`}},g={args:{type:`text`,label:`Text field`}},_={args:{type:`password`,label:`Password field`}},_.render=(e,{globals:t})=>(0,f.jsx)(m,{...e,label:r(t.locale,p).password}),v={render:(e,{globals:t})=>(0,f.jsx)(`div`,{style:{width:`320px`},children:(0,f.jsx)(b,{...e,label:r(t.locale,p).email})}),args:{type:`email`,label:`Email`,outlined:!0,placeholder:`name@example.com`}},y={args:{label:`About`,outlined:!0,multiline:!0,placeholder:`Add a short summary`}},y.render=(e,{globals:t})=>{let n=r(t.locale,p);return(0,f.jsx)(m,{...e,label:n.about,placeholder:n.summary})},b=({value:e,onUpdate:t,...n})=>{let[r,i]=(0,d.useState)(``);return(0,f.jsx)(c,{value:r,...n,onUpdate:i,children:(0,f.jsx)(c.LeadingIcon,{children:(0,f.jsx)(o,{name:`mail`})})})},x=[`TextField`,`PasswordField`,`OutlinedWithLeadingIcon`,`MultilineOutlined`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'text',
    label: 'Text field'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'password',
    label: 'Password field'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => <div style={{
    width: '320px'
  }}>
      <M3TextFieldStoryWithLeadingIcon {...{
      ...args,
      label: localize(globals.locale, labels).email
    }} />
    </div>,
  args: {
    type: 'email',
    label: 'Email',
    outlined: true,
    placeholder: 'name@example.com'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'About',
    outlined: true,
    multiline: true,
    placeholder: 'Add a short summary'
  }
}`,...y.parameters?.docs?.source}}}})))()}export{S as n,u as t};