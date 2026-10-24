import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r,nt as i,s as a}from"./iframe-DlP_3VDG.js";import{c as o,l as s,n as c,o as l,s as u,t as d}from"./button-DcVEi8uC.js";import{n as f,t as p}from"./icon-BHYZNUrK.js";var m=t({AppearanceMatrix:()=>C,DisabledStates:()=>w,IconAppearanceMatrix:()=>A,IconOnly:()=>y,IconSizeMatrix:()=>D,IconSquare:()=>E,IconStandard:()=>T,IconToggleable:()=>k,IconWidthMatrix:()=>O,SizeMatrix:()=>S,Square:()=>b,Toggleable:()=>x,WithLeadingIcon:()=>v,WithTextOnly:()=>_,__namedExportsOrder:()=>j,default:()=>g}),h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{a(),d(),p(),u(),r(),h={"en-US":{share:`Share`,favorite:`Favorite`,favoriteDisabled:`Favorite, disabled`},"ru-RU":{share:`Поделиться`,favorite:`Избранное`,favoriteDisabled:`Избранное, недоступно`}},g={title:`Components/M3Button`,component:c,argTypes:{appearance:{control:`select`,options:l},size:{control:`select`,options:s},rounding:{control:`select`,options:o},width:{control:`select`,options:[`auto`,`narrow`,`medium`,`wide`]},toggleable:{control:`boolean`},selected:{control:`boolean`},disabled:{control:`boolean`}},args:{appearance:`filled`,size:`sm`,rounding:`round`,width:`auto`,toggleable:!1,selected:!1,disabled:!1},render:(e,{globals:t})=>({components:{M3Button:c},setup(){return{args:e,label:n(t.locale,h).share}},template:`<M3Button v-bind="args">{{ label }}</M3Button>`}),parameters:{layout:`centered`}},_={},v={render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{args:e,label:n(t.locale,h).share}},template:`
        <M3Button v-bind="args">
            <M3Icon name="share" />
            {{ label }}
        </M3Button>
    `})},y={args:{width:`medium`},render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{args:e,label:n(t.locale,h).share}},template:`
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="share" />
        </M3Button>
    `})},b={args:{rounding:`square`}},x={render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{args:e,selected:i(!1),label:n(t.locale,{"en-US":`Favorite`,"ru-RU":`Избранное`})}},template:`<M3Button v-bind="args" appearance="tonal" toggleable :selected="selected" @click="selected = !selected"><M3Icon name="favorite" />{{ label }}</M3Button>`})},S={render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{sizes:s,label:n(t.locale,h).share}},template:`<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 16px;"><M3Button v-for="size in sizes" :key="size" :size="size"><M3Icon name="share" />{{ label }}</M3Button></div>`})},C={render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{appearances:l,label:n(t.locale,h).share}},template:`
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
    `})},w={render:(e,{globals:t})=>({components:{M3Button:c},setup(){return{appearances:l,label:n(t.locale,h).share}},template:`
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
    `})},T={args:{width:`medium`,appearance:`standard`},render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{args:e,label:n(t.locale,h).favorite}},template:`
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3Button>
    `})},E={args:{width:`medium`,rounding:`square`},render:(e,{globals:t})=>({components:{M3Button:c,M3Icon:f},setup(){return{args:e,label:n(t.locale,h).favorite}},template:`
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3Button>
    `})},D={render:(e,{globals:t})=>({components:{M3Icon:f,M3Button:c},setup(){return{sizes:[`xs`,`sm`,`md`,`lg`,`xl`],label:n(t.locale,h).favorite}},template:`
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <M3Button
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="label"
                appearance="tonal"
                width="medium"
            >
                <M3Icon name="favorite" />
            </M3Button>
        </div>
    `})},O={render:(e,{globals:t})=>({components:{M3Icon:f,M3Button:c},setup(){return{widths:[`narrow`,`medium`,`wide`],label:n(t.locale,h).favorite}},template:`
        <div style="display: flex; gap: 16px; align-items: center;">
            <M3Button
                v-for="width in widths"
                :key="width"
                :width="width"
                :aria-label="label"
                appearance="tonal"
            >
                <M3Icon name="favorite" />
            </M3Button>
        </div>
    `})},k={args:{width:`medium`},argTypes:{toggleable:{control:!1},selected:{control:!1}},render:(e,{globals:t})=>({components:{M3Icon:f,M3Button:c},setup(){let r=i(!1);return{args:e,label:n(t.locale,h).favorite,selected:r}},template:`
        <M3Button
            v-bind="args"
            :selected="selected"
            :aria-label="label"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3Button>
    `})},A={render:(e,{globals:t})=>({components:{M3Icon:f,M3Button:c},setup(){return{appearances:[`standard`,`filled`,`tonal`,`outlined`],text:n(t.locale,h)}},template:`
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button width="medium"
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="text.favorite"
                >
                    <M3Icon name="favorite" />
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button width="medium"
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="text.favoriteDisabled"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3Button>
            </div>
        </div>
    `})},j=[`WithTextOnly`,`WithLeadingIcon`,`IconOnly`,`Square`,`Toggleable`,`SizeMatrix`,`AppearanceMatrix`,`DisabledStates`,`IconStandard`,`IconSquare`,`IconSizeMatrix`,`IconWidthMatrix`,`IconToggleable`,`IconAppearanceMatrix`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium'
  },
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
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="share" />
        </M3Button>
    \`
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    rounding: 'square'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Icon
    },
    setup() {
      const selected = ref(false);
      return {
        args,
        selected,
        label: localize(globals.locale, {
          'en-US': 'Favorite',
          'ru-RU': 'Избранное'
        })
      };
    },
    template: '<M3Button v-bind="args" appearance="tonal" toggleable :selected="selected" @click="selected = !selected"><M3Icon name="favorite" />{{ label }}</M3Button>'
  })
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Button,
      M3Icon
    },
    setup() {
      return {
        sizes: values.sizes,
        label: localize(globals.locale, messages).share
      };
    },
    template: '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 16px;"><M3Button v-for="size in sizes" :key="size" :size="size"><M3Icon name="share" />{{ label }}</M3Button></div>'
  })
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium',
    appearance: 'standard'
  },
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
        label: localize(globals.locale, messages).favorite
      };
    },
    template: \`
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3Button>
    \`
  })
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium',
    rounding: 'square'
  },
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
        label: localize(globals.locale, messages).favorite
      };
    },
    template: \`
        <M3Button v-bind="args" :aria-label="label">
            <M3Icon name="favorite" />
        </M3Button>
    \`
  })
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3Button
    },
    setup() {
      return {
        sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
        label: localize(globals.locale, messages).favorite
      };
    },
    template: \`
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
            <M3Button
                v-for="size in sizes"
                :key="size"
                :size="size"
                :aria-label="label"
                appearance="tonal"
                width="medium"
            >
                <M3Icon name="favorite" />
            </M3Button>
        </div>
    \`
  })
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3Button
    },
    setup() {
      return {
        widths: ['narrow', 'medium', 'wide'],
        label: localize(globals.locale, messages).favorite
      };
    },
    template: \`
        <div style="display: flex; gap: 16px; align-items: center;">
            <M3Button
                v-for="width in widths"
                :key="width"
                :width="width"
                :aria-label="label"
                appearance="tonal"
            >
                <M3Icon name="favorite" />
            </M3Button>
        </div>
    \`
  })
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium'
  },
  argTypes: {
    toggleable: {
      control: false
    },
    selected: {
      control: false
    }
  },
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3Button
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
        <M3Button
            v-bind="args"
            :selected="selected"
            :aria-label="label"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3Button>
    \`
  })
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3Button
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
                <M3Button width="medium"
                    v-for="appearance in appearances"
                    :key="appearance"
                    :appearance="appearance"
                    :aria-label="text.favorite"
                >
                    <M3Icon name="favorite" />
                </M3Button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <M3Button width="medium"
                    v-for="appearance in appearances"
                    :key="appearance + '-disabled'"
                    :appearance="appearance"
                    :aria-label="text.favoriteDisabled"
                    disabled
                >
                    <M3Icon name="favorite" />
                </M3Button>
            </div>
        </div>
    \`
  })
}`,...A.parameters?.docs?.source}}}})))()}export{M as n,m as t};