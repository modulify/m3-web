import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,et as r,i,s as a}from"./iframe-CwdcI8lG.js";import{i as o,t as s}from"./icon-DNAJkfNS.js";import{n as c,t as l}from"./icon-button-B4Oa6UDY.js";var u=t({AppearanceMatrix:()=>h,Standard:()=>p,Toggleable:()=>m,__namedExportsOrder:()=>g,default:()=>f}),d,f,p,m,h,g;function _(){return(_=e((()=>{a(),s(),l(),i(),d={"en-US":{favorite:`Favorite`,favoriteDisabled:`Favorite, disabled`},"ru-RU":{favorite:`Избранное`,favoriteDisabled:`Избранное, недоступно`}},f={title:`Components/M3IconButton`,component:c,argTypes:{appearance:{control:`select`,options:[`filled`,`outlined`,`standard`,`tonal`]},toggleable:{control:!1},selected:{control:!1},disabled:{control:`boolean`}},args:{appearance:`standard`,disabled:!1},render:(e,{globals:t})=>({components:{M3Icon:o,M3IconButton:c},setup(){return{args:e,label:n(t.locale,d).favorite}},template:`
        <M3IconButton v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3IconButton>
    `}),parameters:{layout:`centered`}},p={},m={render:(e,{globals:t})=>({components:{M3Icon:o,M3IconButton:c},setup(){let i=r(!1);return{args:e,label:n(t.locale,d).favorite,selected:i}},template:`
        <M3IconButton
            :selected="selected"
            v-bind="args"
            :aria-label="label"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3IconButton>
    `})},h={render:(e,{globals:t})=>({components:{M3Icon:o,M3IconButton:c},setup(){return{appearances:[`standard`,`filled`,`tonal`,`outlined`],text:n(t.locale,d)}},template:`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="text.favorite"
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="text.favoriteDisabled"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>
        </div>
    `})},g=[`Standard`,`Toggleable`,`AppearanceMatrix`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3IconButton
    },
    setup() {
      const selected = ref(false);
      return {
        args,
        label: localize(globals.locale, messages).favorite,
        selected
      };
    },
    template: \`
        <M3IconButton
            :selected="selected"
            v-bind="args"
            :aria-label="label"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3IconButton>
    \`
  })
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3IconButton
    },
    setup() {
      return {
        appearances: ['standard', 'filled', 'tonal', 'outlined'],
        text: localize(globals.locale, messages)
      };
    },
    template: \`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="text.favorite"
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="text.favoriteDisabled"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>
        </div>
    \`
  })
}`,...h.parameters?.docs?.source}}}})))()}export{_ as n,u as t};