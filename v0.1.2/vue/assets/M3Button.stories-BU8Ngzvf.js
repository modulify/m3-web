import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-hIq0EEjR.js";import{n as i,o as a,s as o,t as s}from"./button-B4RKEk47.js";import{i as c,t as l}from"./icon-Bv7HR_mB.js";var u=t({AppearanceMatrix:()=>h,DisabledStates:()=>g,WithLeadingIcon:()=>m,WithTextOnly:()=>p,__namedExportsOrder:()=>_,default:()=>f}),d,f,p,m,h,g,_;function v(){return(v=e((()=>{s(),l(),o(),r(),d={"en-US":{share:`Share`},"ru-RU":{share:`Поделиться`}},f={title:`Components/M3Button`,component:i,argTypes:{appearance:{control:`select`,options:a},disabled:{control:`boolean`}},args:{appearance:`filled`,disabled:!1},render:(e,{globals:t})=>({components:{M3Button:i},setup(){return{args:e,label:n(t.locale,d).share}},template:`<M3Button v-bind="args">{{ label }}</M3Button>`}),parameters:{layout:`centered`}},p={},m={render:(e,{globals:t})=>({components:{M3Button:i,M3Icon:c},setup(){return{args:e,label:n(t.locale,d).share}},template:`
        <M3Button v-bind="args">
            <M3Icon name="share" />
            {{ label }}
        </M3Button>
    `})},h={render:(e,{globals:t})=>({components:{M3Button:i,M3Icon:c},setup(){return{appearances:a,label:n(t.locale,d).share}},template:`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'text-' + appearance"
                    :appearance="appearance"
                >
                    {{ label }}
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'icon-' + appearance"
                    :appearance="appearance"
                >
                    <M3Icon name="share" />
                    {{ label }}
                </M3Button>
            </div>
        </div>
    `})},g={render:(e,{globals:t})=>({components:{M3Button:i},setup(){return{appearances:a,label:n(t.locale,d).share}},template:`
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            <M3Button
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                disabled
            >
                {{ label }}
            </M3Button>
        </div>
    `})},_=[`WithTextOnly`,`WithLeadingIcon`,`AppearanceMatrix`,`DisabledStates`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Icon
    },
    setup() {
      return {
        args,
        label: localize(globals.locale, messages).share
      };
    },
    template: \`
        <M3Button v-bind="args">
            <M3Icon name="share" />
            {{ label }}
        </M3Button>
    \`
  })
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Icon
    },
    setup() {
      return {
        appearances: values.appearances,
        label: localize(globals.locale, messages).share
      };
    },
    template: \`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'text-' + appearance"
                    :appearance="appearance"
                >
                    {{ label }}
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'icon-' + appearance"
                    :appearance="appearance"
                >
                    <M3Icon name="share" />
                    {{ label }}
                </M3Button>
            </div>
        </div>
    \`
  })
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Button
    },
    setup() {
      return {
        appearances: values.appearances,
        label: localize(globals.locale, messages).share
      };
    },
    template: \`
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            <M3Button
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                disabled
            >
                {{ label }}
            </M3Button>
        </div>
    \`
  })
}`,...g.parameters?.docs?.source}}}})))()}export{v as n,u as t};