import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,et as r,i,s as a}from"./iframe-CwdcI8lG.js";import{i as o,t as s}from"./icon-DNAJkfNS.js";import{n as c,t as l}from"./text-field-CUSMIDYr.js";var u=t({MultilineOutlined:()=>g,OutlinedWithLeadingIcon:()=>h,PasswordField:()=>m,TextField:()=>p,__namedExportsOrder:()=>_,default:()=>f}),d,f,p,m,h,g,_;function v(){return(v=e((()=>{a(),s(),l(),i(),d={"en-US":{about:`About`,email:`Email`,password:`Password field`,summary:`Add a short summary`,text:`Text field`},"ru-RU":{about:`О себе`,email:`Электронная почта`,password:`Пароль`,summary:`Добавьте краткое описание`,text:`Текстовое поле`}},f={title:`Components/M3TextField`,component:c,argTypes:{type:{control:`select`,options:[`email`,`number`,`password`,`search`,`tel`,`text`,`url`]}},args:{type:`text`},render:(e,{globals:t})=>({components:{M3TextField:c},setup(){return{args:{...e,label:n(t.locale,d).text},value:r(``)}},template:`
        <M3TextField
            v-model:value="value"
            v-bind="args"
        />
    `}),parameters:{layout:`centered`}},p={args:{type:`text`,label:`Text field`}},m={args:{type:`password`,label:`Password field`}},m.render=(e,{globals:t})=>({components:{M3TextField:c},setup:()=>({args:{...e,label:n(t.locale,d).password},value:r(``)}),template:`<M3TextField v-model:value="value" v-bind="args" />`}),h={args:{type:`email`,label:`Email`,outlined:!0,placeholder:`name@example.com`},render:(e,{globals:t})=>({components:{M3Icon:o,M3TextField:c},setup(){return{args:{...e,label:n(t.locale,d).email},value:r(``)}},template:`
        <M3TextField
            v-model:value="value"
            v-bind="args"
        >
            <template #leading-icon>
                <M3Icon name="mail" />
            </template>
        </M3TextField>
    `})},g={args:{label:`About`,outlined:!0,multiline:!0,placeholder:`Add a short summary`}},g.render=(e,{globals:t})=>{let i=n(t.locale,d);return{components:{M3TextField:c},setup:()=>({args:{...e,label:i.about,placeholder:i.summary},value:r(``)}),template:`<M3TextField v-model:value="value" v-bind="args" />`}},_=[`TextField`,`PasswordField`,`OutlinedWithLeadingIcon`,`MultilineOutlined`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
  args: {
    type: 'email',
    label: 'Email',
    outlined: true,
    placeholder: 'name@example.com'
  },
  render: (args: Record<string, unknown>, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3TextField
    },
    setup() {
      return {
        args: {
          ...args,
          label: localize(globals.locale, labels).email
        },
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'About',
    outlined: true,
    multiline: true,
    placeholder: 'Add a short summary'
  }
}`,...g.parameters?.docs?.source}}}})))()}export{v as n,u as t};