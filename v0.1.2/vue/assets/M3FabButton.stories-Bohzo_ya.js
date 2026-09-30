import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-hIq0EEjR.js";import{i,t as a}from"./icon-Bv7HR_mB.js";import{c as o,l as s,n as c,s as l,t as u}from"./fab-button-CN2px-TE.js";var d=t({Extended:()=>h,SizeMatrix:()=>_,Standard:()=>m,VariantMatrix:()=>g,__namedExportsOrder:()=>v,default:()=>p}),f,p,m,h,g,_,v;function y(){return(y=e((()=>{u(),a(),l(),r(),f={"en-US":{edit:`Edit`,newTask:`New task`},"ru-RU":{edit:`Редактировать`,newTask:`Новая задача`}},p={title:`Components/M3FabButton`,component:c,argTypes:{variant:{control:`select`,options:s},size:{control:`select`,options:o},disabled:{control:`boolean`}},args:{variant:`primary`,size:`md`,disabled:!1},render:(e,{globals:t})=>({components:{M3FabButton:c,M3Icon:i},setup(){return{args:e,label:n(t.locale,f).edit}},template:`
        <M3FabButton v-bind="args" :aria-label="label">
            <M3Icon name="edit" />
        </M3FabButton>
    `}),parameters:{layout:`centered`}},m={},h={render:(e,{globals:t})=>({components:{M3FabButton:c,M3Icon:i},setup(){return{args:e,label:n(t.locale,f).edit}},template:`
        <M3FabButton v-bind="args">
            <M3Icon name="edit" aria-hidden="true" /> {{ label }}
        </M3FabButton>
    `})},g={render:(e,{globals:t})=>({components:{M3FabButton:c,M3Icon:i},setup(){return{variants:s,label:n(t.locale,f).newTask}},template:`
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
                    <M3Icon name="edit" /> {{ label }}
                </M3FabButton>
            </div>
        </div>
    `})},_={render:()=>({components:{M3FabButton:c,M3Icon:i},setup(){return{sizes:o}},template:`
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
    `})},v=[`Standard`,`Extended`,`VariantMatrix`,`SizeMatrix`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3FabButton,
      M3Icon
    },
    setup() {
      return {
        args,
        label: localize(globals.locale, messages).edit
      };
    },
    template: \`
        <M3FabButton v-bind="args">
            <M3Icon name="edit" aria-hidden="true" /> {{ label }}
        </M3FabButton>
    \`
  })
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3FabButton,
      M3Icon
    },
    setup() {
      return {
        variants,
        label: localize(globals.locale, messages).newTask
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
                    <M3Icon name="edit" /> {{ label }}
                </M3FabButton>
            </div>
        </div>
    \`
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}}})))()}export{y as n,d as t};