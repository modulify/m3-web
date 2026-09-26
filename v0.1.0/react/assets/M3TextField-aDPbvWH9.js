import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{E as n,T as r,c as i,o as a,s as o}from"./blocks-NwLwj9yT.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{r as c,t as l}from"./icon-qppvVYBr.js";import{n as u,t as d}from"./text-field-BuKOTzpw.js";import{n as f,t as p}from"./M3TextField.stories-h3fkYusQ.js";var m,h,g;function _(){return(_=e((()=>{m=t(),l(),d(),h=s(),g=()=>{let[e,t]=(0,m.useState)(``),[n,r]=(0,m.useState)(``),[i,a]=(0,m.useState)(``),[o,s]=(0,m.useState)(``);return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`div`,{style:{marginBottom:`16px`},children:(0,h.jsx)(u,{value:e,label:`E-mail`,onUpdate:t,children:(0,h.jsx)(u.LeadingIcon,{children:(0,h.jsx)(c,{name:`mail`})})})}),(0,h.jsx)(`div`,{style:{marginBottom:`16px`},children:(0,h.jsx)(u,{value:n,label:`E-mail`,outlined:!0,onUpdate:r,children:(0,h.jsx)(u.LeadingIcon,{children:(0,h.jsx)(c,{name:`mail`})})})}),(0,h.jsx)(`div`,{style:{marginBottom:`16px`},children:(0,h.jsx)(u,{value:i,label:`About`,multiline:!0,onUpdate:a})}),(0,h.jsx)(`div`,{children:(0,h.jsx)(u,{value:o,label:`About`,multiline:!0,outlined:!0,onUpdate:s})})]})},g.__docgenInfo={description:``,methods:[],displayName:`TextFieldExamples`}})))()}function v(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(a,{of:p}),`
`,(0,b.jsx)(t.h1,{id:`text-fields`,children:`Text fields`}),`
`,(0,b.jsx)(t.p,{children:`Text fields capture short or medium-length textual input. Material 3 uses them as a flexible foundation for plain entry, assisted entry, password input, and multiline editing.`}),`
`,(0,b.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,b.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),`
`,(0,b.jsxs)(t.p,{children:[`Use `,(0,b.jsx)(t.code,{children:`M3TextField`}),` for direct text entry, searchable fields, passwords, and compact multiline notes. If the value must come from a predefined list, prefer `,(0,b.jsx)(t.code,{children:`M3Select`}),` or autocomplete patterns instead of asking users to type and validate manually.`]}),`
`,(0,b.jsx)(t.h3,{id:`common-forms`,children:`Common forms`}),`
`,(0,b.jsx)(t.p,{children:`This workspace supports several Material 3 text-field patterns:`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:`filled and outlined presentation`}),`
`,(0,b.jsx)(t.li,{children:`leading icons`}),`
`,(0,b.jsx)(t.li,{children:`password fields`}),`
`,(0,b.jsx)(t.li,{children:`multiline input`}),`
`]}),`
`,(0,b.jsx)(t.h3,{id:`support-text-and-validation`,children:`Support text and validation`}),`
`,(0,b.jsx)(t.p,{children:`Labels, support text, and validation messages should work together. The field alone rarely communicates enough context for successful data entry.`}),`
`,(0,b.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[`Provide a persistent text label (`,(0,b.jsx)(t.code,{children:`label`}),` prop or explicit aria-labelledby).`]}),`
`,(0,b.jsxs)(t.li,{children:[`Use `,(0,b.jsx)(t.code,{children:`aria-invalid`}),` together with helper/support text for validation feedback.`]}),`
`,(0,b.jsxs)(t.li,{children:[`For long-form input, prefer multiline mode (`,(0,b.jsx)(t.code,{children:`textarea`}),`) with the same labeling strategy.`]}),`
`]}),`
`,(0,b.jsx)(o,{children:(0,b.jsx)(g,{})}),`
`,(0,b.jsx)(t.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3textfield--text-field`,children:`Text Field`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3textfield--password-field`,children:`Password Field`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3textfield--outlined-with-leading-icon`,children:`Outlined With Leading Icon`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`?path=/story/components-m3textfield--multiline-outlined`,children:`Multiline Outlined`})}),`
`]}),`
`,(0,b.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,b.jsx)(t.h3,{id:`keep-labels-persistent`,children:`Keep labels persistent`}),`
`,(0,b.jsx)(t.p,{children:`A placeholder is not a replacement for a label. Users need the field purpose to stay visible while typing and when returning to the form later.`}),`
`,(0,b.jsx)(t.h3,{id:`match-type-to-expected-content`,children:`Match type to expected content`}),`
`,(0,b.jsxs)(t.p,{children:[`Use semantic input types like `,(0,b.jsx)(t.code,{children:`email`}),`, `,(0,b.jsx)(t.code,{children:`tel`}),`, or `,(0,b.jsx)(t.code,{children:`password`}),` whenever possible so browsers and assistive technologies can help users enter data correctly.`]}),`
`,(0,b.jsx)(t.h2,{id:`code-example`,children:`Code example`}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-tsx`,children:`<M3TextField
  value={value}
  label="Email"
  type="email"
  onUpdate={setValue}
/>
`})}),`
`,(0,b.jsx)(t.h2,{id:`resources`,children:`Resources`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`https://m3.material.io/components/text-fields/overview`,rel:`nofollow`,children:`M3 Text fields overview`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`https://m3.material.io/components/text-fields/guidelines`,rel:`nofollow`,children:`M3 Text fields guidelines`})}),`
`,(0,b.jsx)(t.li,{children:(0,b.jsx)(t.a,{href:`https://www.w3.org/WAI/tutorials/forms/labels/`,rel:`nofollow`,children:`WAI Tutorials: Form Labels`})}),`
`]})]})}function y(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=s(),r(),i(),_(),f()})))()}x();export{y as default};