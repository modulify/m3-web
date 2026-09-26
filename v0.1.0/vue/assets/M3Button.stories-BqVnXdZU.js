import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{n,o as r,s as i,t as a}from"./button-C5ZOfJIb.js";import{i as o,t as s}from"./icon-BzqhEXMj.js";var c=t({AppearanceMatrix:()=>f,DisabledStates:()=>p,WithLeadingIcon:()=>d,WithTextOnly:()=>u,__namedExportsOrder:()=>m,default:()=>l}),l,u,d,f,p,m;function h(){return(h=e((()=>{a(),s(),i(),l={title:`Components/M3Button`,component:n,argTypes:{appearance:{control:`select`,options:r},disabled:{control:`boolean`}},args:{appearance:`filled`,disabled:!1},render:e=>({components:{M3Button:n},setup(){return{args:e}},template:`<M3Button v-bind="args">Share</M3Button>`}),parameters:{layout:`centered`}},u={},d={render:e=>({components:{M3Button:n,M3Icon:o},setup(){return{args:e}},template:`
        <M3Button v-bind="args">
            <M3Icon name="share" />
            Share
        </M3Button>
    `})},f={render:()=>({components:{M3Button:n,M3Icon:o},setup(){return{appearances:r}},template:`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'text-' + appearance"
                    :appearance="appearance"
                >
                    Share
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'icon-' + appearance"
                    :appearance="appearance"
                >
                    <M3Icon name="share" />
                    Share
                </M3Button>
            </div>
        </div>
    `})},p={render:()=>({components:{M3Button:n},setup(){return{appearances:r}},template:`
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            <M3Button
                v-for="appearance in appearances"
                :key="appearance"
                :appearance="appearance"
                disabled
            >
                Share
            </M3Button>
        </div>
    `})},m=[`WithTextOnly`,`WithLeadingIcon`,`AppearanceMatrix`,`DisabledStates`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
    components: {
      M3Button,
      M3Icon
    },
    setup() {
      return {
        args
      };
    },
    template: \`
        <M3Button v-bind="args">
            <M3Icon name="share" />
            Share
        </M3Button>
    \`
  })
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      M3Button,
      M3Icon
    },
    setup() {
      return {
        appearances: values.appearances
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
                    Share
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button
                    v-for="appearance in appearances"
                    :key="'icon-' + appearance"
                    :appearance="appearance"
                >
                    <M3Icon name="share" />
                    Share
                </M3Button>
            </div>
        </div>
    \`
  })
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      M3Button
    },
    setup() {
      return {
        appearances: values.appearances
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
                Share
            </M3Button>
        </div>
    \`
  })
}`,...p.parameters?.docs?.source}}}})))()}export{h as n,c as t};