import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{i as n,t as r}from"./icon-BzqhEXMj.js";import{c as i,l as a,n as o,s,t as c}from"./fab-button-DMmR1Uz2.js";var l=t({Extended:()=>f,SizeMatrix:()=>m,Standard:()=>d,VariantMatrix:()=>p,__namedExportsOrder:()=>h,default:()=>u}),u,d,f,p,m,h;function g(){return(g=e((()=>{c(),r(),s(),u={title:`Components/M3FabButton`,component:o,argTypes:{variant:{control:`select`,options:a},size:{control:`select`,options:i},disabled:{control:`boolean`}},args:{variant:`primary`,size:`md`,disabled:!1},render:e=>({components:{M3FabButton:o,M3Icon:n},setup(){return{args:e}},template:`
        <M3FabButton v-bind="args" aria-label="Edit">
            <M3Icon name="edit" />
        </M3FabButton>
    `}),parameters:{layout:`centered`}},d={},f={render:e=>({components:{M3FabButton:o,M3Icon:n},setup(){return{args:e}},template:`
        <M3FabButton v-bind="args">
            <M3Icon name="edit" aria-hidden="true" /> Edit
        </M3FabButton>
    `})},p={render:()=>({components:{M3FabButton:o,M3Icon:n},setup(){return{variants:a}},template:`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                <M3FabButton
                    v-for="variant in variants"
                    :key="'icon-' + variant"
                    :variant="variant"
                    :aria-label="variant"
                >
                    <M3Icon name="edit" />
                </M3FabButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                <M3FabButton
                    v-for="variant in variants"
                    :key="'text-' + variant"
                    :variant="variant"
                >
                    <M3Icon name="edit" /> New task
                </M3FabButton>
            </div>
        </div>
    `})},m={render:()=>({components:{M3FabButton:o,M3Icon:n},setup(){return{sizes:i}},template:`
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <M3FabButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="size"
            >
                <M3Icon name="edit" />
            </M3FabButton>
        </div>
    `})},h=[`Standard`,`Extended`,`VariantMatrix`,`SizeMatrix`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: (args: unknown) => ({
    components: {
      M3FabButton,
      M3Icon
    },
    setup() {
      return {
        args
      };
    },
    template: \`
        <M3FabButton v-bind="args">
            <M3Icon name="edit" aria-hidden="true" /> Edit
        </M3FabButton>
    \`
  })
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      M3FabButton,
      M3Icon
    },
    setup() {
      return {
        variants
      };
    },
    template: \`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                <M3FabButton
                    v-for="variant in variants"
                    :key="'icon-' + variant"
                    :variant="variant"
                    :aria-label="variant"
                >
                    <M3Icon name="edit" />
                </M3FabButton>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                <M3FabButton
                    v-for="variant in variants"
                    :key="'text-' + variant"
                    :variant="variant"
                >
                    <M3Icon name="edit" /> New task
                </M3FabButton>
            </div>
        </div>
    \`
  })
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      M3FabButton,
      M3Icon
    },
    setup() {
      return {
        sizes
      };
    },
    template: \`
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <M3FabButton
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="size"
            >
                <M3Icon name="edit" />
            </M3FabButton>
        </div>
    \`
  })
}`,...m.parameters?.docs?.source}}}})))()}export{g as n,l as t};