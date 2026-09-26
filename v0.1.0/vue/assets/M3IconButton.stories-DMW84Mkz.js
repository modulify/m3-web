import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{Y as n,n as r}from"./iframe-DqoEP6-3.js";import{i,t as a}from"./icon-BzqhEXMj.js";import{n as o,t as s}from"./icon-button-DfGrghLx.js";var c=t({AppearanceMatrix:()=>f,Standard:()=>u,Toggleable:()=>d,__namedExportsOrder:()=>p,default:()=>l}),l,u,d,f,p;function m(){return(m=e((()=>{r(),a(),s(),l={title:`Components/M3IconButton`,component:o,argTypes:{appearance:{control:`select`,options:[`filled`,`outlined`,`standard`,`tonal`]},toggleable:{control:!1},selected:{control:!1},disabled:{control:`boolean`}},args:{appearance:`standard`,disabled:!1},render:e=>({components:{M3Icon:i,M3IconButton:o},setup(){return{args:e}},template:`
        <M3IconButton v-bind="args">
            <M3Icon name="favorite" />
        </M3IconButton>
    `}),parameters:{layout:`centered`}},u={},d={render:e=>({components:{M3Icon:i,M3IconButton:o},setup(){return{args:e,selected:n(!1)}},template:`
        <M3IconButton
            :selected="selected"
            v-bind="args"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3IconButton>
    `})},f={render:()=>({components:{M3Icon:i,M3IconButton:o},setup(){return{appearances:[`standard`,`filled`,`tonal`,`outlined`]}},template:`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="appearance"
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="appearance + '-disabled'"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>
        </div>
    `})},p=[`Standard`,`Toggleable`,`AppearanceMatrix`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
    components: {
      M3Icon,
      M3IconButton
    },
    setup() {
      const selected = ref(false);
      return {
        args,
        selected
      };
    },
    template: \`
        <M3IconButton
            :selected="selected"
            v-bind="args"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3IconButton>
    \`
  })
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      M3Icon,
      M3IconButton
    },
    setup() {
      return {
        appearances: ['standard', 'filled', 'tonal', 'outlined']
      };
    },
    template: \`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="appearance"
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3IconButton
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="appearance + '-disabled'"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3IconButton>
            </div>
        </div>
    \`
  })
}`,...f.parameters?.docs?.source}}}})))()}export{m as n,c as t};