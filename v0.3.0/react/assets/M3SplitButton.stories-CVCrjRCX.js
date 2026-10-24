import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-D8ji4XVX.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{B as o,N as s,T as c,V as l,t as u}from"./hooks-C8H38iP7.js";import{n as d,t as f}from"./styling-6Blru8yv.js";import{r as p,t as m}from"./icon-4W1iC_Ck.js";import{n as h,t as g}from"./button-wQR3CB3H.js";import{i as _,n as v,t as y}from"./menu-DOCR--sG.js";var b,x,S;function C(){return(C=e((()=>{b=n(),g(),m(),y(),l(),f(),u(),x=a(),S=o(function({ref:e,id:t,appearance:n=`filled`,size:r=`sm`,disabled:i=!1,menuLabel:a,menu:o,open:l,onToggle:u=()=>{},onAction:f=()=>{},className:m=``,children:g,...v},{expose:y}){let S=(0,b.useRef)(null),C=(0,b.useRef)(null),[w,T]=(0,b.useState)(null),[E,D]=(0,b.useState)(l??!1),O=c(t,`m3-split-button`),k=O+`-menu`,A=!i&&E;(0,b.useEffect)(()=>{l!==void 0&&D(l)},[l]);let j=(0,b.useCallback)(e=>{T(t=>t===e?.el?t:e?.el??null)},[]);y(s(S));let M=e=>{D(e),u(e)};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(`div`,{ref:S,id:O,role:`group`,className:d([m,`m3-split-button`,`m3-split-button_${r}`,{"m3-split-button_open":A}]),...v,children:[(0,x.jsx)(`span`,{className:`m3-split-button__segment`,onClick:e=>{e.target===e.currentTarget&&!i&&C.current?.click()},children:(0,x.jsx)(h,{ref:C,className:`m3-split-button__main`,appearance:n,size:r,disabled:i,onClick:f,children:g})}),(0,x.jsx)(`span`,{className:`m3-split-button__segment`,onClick:e=>{e.target===e.currentTarget&&!i&&w?.click()},children:(0,x.jsx)(h,{ref:j,className:`m3-split-button__trailing`,appearance:n,size:r,disabled:i,"aria-label":a,"aria-expanded":A,"aria-haspopup":`menu`,"aria-controls":k,children:(0,x.jsx)(p,{name:`expand_more`})})})]}),(0,x.jsx)(_,{id:k,target:w,shown:A,disabled:i,placement:`bottom-end`,offsetMainAxis:4,onToggle:M,children:typeof o==`function`?o({close:()=>M(!1)}):o})]})})})))()}function w(){return(w=e((()=>{C()})))()}var T=t({Elevated:()=>A,ExtraLarge:()=>P,Filled:()=>k,Medium:()=>N,Open:()=>F,Outlined:()=>M,Tonal:()=>j,__namedExportsOrder:()=>I,default:()=>O}),E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{m(),y(),w(),i(),E=a(),D={"en-US":{send:`Send`,more:`More sending options`,schedule:`Schedule send`,draft:`Save draft`},"ru-RU":{send:`Отправить`,more:`Другие варианты отправки`,schedule:`Запланировать отправку`,draft:`Сохранить черновик`}},O={title:`Components/M3SplitButton`,component:S,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`tonal`,`outlined`,`standard`,`text`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},menu:{control:!1},open:{control:!1},onToggle:{control:!1},onAction:{control:!1}},args:{appearance:`filled`,size:`sm`,menuLabel:`More sending options`,menu:null},render:(e,{globals:t})=>{let n=r(t.locale,D),i={...e,menuLabel:n.more,menu:({close:e})=>(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(v,{onClick:e,children:n.schedule}),(0,E.jsx)(v,{onClick:e,children:n.draft})]})};return(0,E.jsx)(`div`,{className:`p-8`,style:{minHeight:240},children:(0,E.jsxs)(S,{...i,children:[(0,E.jsx)(p,{name:`send`}),n.send]})})},parameters:{layout:`centered`}},k={},A={args:{appearance:`elevated`}},j={args:{appearance:`tonal`}},M={args:{appearance:`outlined`}},N={args:{size:`md`}},P={args:{size:`xl`}},F={args:{open:!0}},I=[`Filled`,`Elevated`,`Tonal`,`Outlined`,`Medium`,`ExtraLarge`,`Open`],k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'elevated'
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'tonal'
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'outlined'
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'xl'
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    open: true
  }
}`,...F.parameters?.docs?.source}}}})))()}export{N as a,j as c,T as i,L as l,P as n,F as o,k as r,M as s,A as t};