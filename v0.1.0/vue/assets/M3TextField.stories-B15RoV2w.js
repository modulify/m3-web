import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{Y as n,n as r}from"./iframe-DqoEP6-3.js";import{i,t as a}from"./icon-BzqhEXMj.js";import{n as o,t as s}from"./text-field-D7Fww2as.js";var c=t({MultilineOutlined:()=>p,OutlinedWithLeadingIcon:()=>f,PasswordField:()=>d,TextField:()=>u,__namedExportsOrder:()=>m,default:()=>l}),l,u,d,f,p,m;function h(){return(h=e((()=>{r(),a(),s(),l={title:`Components/M3TextField`,component:o,argTypes:{type:{control:`select`,options:[`email`,`number`,`password`,`search`,`tel`,`text`,`url`]}},args:{type:`text`},render:e=>({components:{M3TextField:o},setup(){return{args:e,value:n(``)}},template:`
        <M3TextField
            v-model:value="value"
            v-bind="args"
        />
    `}),parameters:{layout:`centered`}},u={args:{type:`text`,label:`Text field`}},d={args:{type:`password`,label:`Password field`}},f={args:{type:`email`,label:`Email`,outlined:!0,placeholder:`name@example.com`},render:e=>({components:{M3Icon:i,M3TextField:o},setup(){return{args:e,value:n(``)}},template:`
        <M3TextField
            v-model:value="value"
            v-bind="args"
        >
            <template #leading-icon>
                <M3Icon name="mail" />
            </template>
        </M3TextField>
    `})},p={args:{label:`About`,outlined:!0,multiline:!0,placeholder:`Add a short summary`}},m=[`TextField`,`PasswordField`,`OutlinedWithLeadingIcon`,`MultilineOutlined`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'text',
    label: 'Text field'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'password',
    label: 'Password field'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'email',
    label: 'Email',
    outlined: true,
    placeholder: 'name@example.com'
  },
  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3TextField
    },
    setup() {
      return {
        args,
        value: ref('')
      };
    },
    template: \`
        <M3TextField
            v-model:value="value"
            v-bind="args"
        >
            <template #leading-icon>
                <M3Icon name="mail" />
            </template>
        </M3TextField>
    \`
  })
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'About',
    outlined: true,
    multiline: true,
    placeholder: 'Add a short summary'
  }
}`,...p.parameters?.docs?.source}}}})))()}export{h as n,c as t};