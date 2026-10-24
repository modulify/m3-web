import{a as e,n as t,r as n}from"./rolldown-runtime-DkW27tQK.js";import{t as r}from"./react-Q1GcV6wX.js";import{a as i,i as a}from"./iframe-D8ji4XVX.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{r as s,t as c}from"./icon-4W1iC_Ck.js";import{n as l,t as u}from"./button-wQR3CB3H.js";var d,f,p;function m(){return(m=t((()=>{d=[`elevated`,`filled`,`outlined`,`standard`,`text`,`tonal`],f=[`xs`,`sm`,`md`,`lg`,`xl`],p=[`round`,`square`]})))()}var h=n({AppearanceMatrix:()=>E,DisabledStates:()=>D,IconAppearanceMatrix:()=>N,IconOnly:()=>S,IconSizeMatrix:()=>A,IconSquare:()=>k,IconStandard:()=>O,IconToggleable:()=>M,IconWidthMatrix:()=>j,SizeMatrix:()=>T,Square:()=>C,Toggleable:()=>w,WithLeadingIcon:()=>x,WithTextOnly:()=>b,__namedExportsOrder:()=>P,default:()=>y}),g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=t((()=>{g=e(r(),1),u(),c(),m(),a(),_=o(),v={"en-US":{share:`Share`,favorite:`Favorite`,favoriteDisabled:`Favorite, disabled`},"ru-RU":{share:`Поделиться`,favorite:`Избранное`,favoriteDisabled:`Избранное, недоступно`}},y={title:`Components/M3Button`,component:l,argTypes:{appearance:{control:`select`,options:d},size:{control:`select`,options:f},rounding:{control:`select`,options:p},width:{control:`select`,options:[`auto`,`narrow`,`medium`,`wide`]},toggleable:{control:`boolean`},selected:{control:`boolean`},href:{control:`text`},disabled:{control:`boolean`}},args:{appearance:`filled`,size:`sm`,rounding:`round`,width:`auto`,toggleable:!1,selected:!1,disabled:!1},render:(e,{globals:t})=>(0,_.jsx)(l,{...e,children:i(t.locale,v).share}),parameters:{layout:`centered`}},b={},x={render:(e,{globals:t})=>(0,_.jsxs)(l,{...e,children:[(0,_.jsx)(s,{name:`share`}),` `,i(t.locale,v).share]})},S={args:{width:`medium`},render:(e,{globals:t})=>(0,_.jsx)(l,{"aria-label":i(t.locale,v).share,...e,children:(0,_.jsx)(s,{name:`share`})})},C={args:{rounding:`square`}},w={render:(e,{globals:t})=>(0,_.jsx)(()=>{let[n,r]=(0,g.useState)(!1),a={...e,appearance:`tonal`,toggleable:!0,selected:n};return(0,_.jsxs)(l,{...a,onClick:()=>r(!n),children:[(0,_.jsx)(s,{name:`favorite`}),` `,i(t.locale,{"en-US":`Favorite`,"ru-RU":`Избранное`})]})},{})},T={render:(e,{globals:t})=>(0,_.jsx)(`div`,{className:`flex-row flex-wrap gap-4`,children:f.map(e=>(0,_.jsxs)(l,{size:e,children:[(0,_.jsx)(s,{name:`share`}),` `,i(t.locale,v).share]},e))})},E={render:(e,{globals:t})=>{let n=i(t.locale,v),r={display:`grid`,gap:`16px`},a={display:`flex`,flexWrap:`wrap`,gap:`16px`};return(0,_.jsxs)(`div`,{style:r,children:[(0,_.jsx)(`div`,{style:a,children:d.map(e=>(0,_.jsx)(l,{appearance:e,children:n.share},e))}),(0,_.jsx)(`div`,{style:a,children:d.map(e=>(0,_.jsxs)(l,{appearance:e,children:[(0,_.jsx)(s,{name:`share`}),` `,n.share]},e))})]})}},D={render:(e,{globals:t})=>{let n=i(t.locale,v);return(0,_.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`},children:d.map(e=>(0,_.jsx)(l,{appearance:e,disabled:!0,children:n.share},e))})}},O={args:{width:`medium`,appearance:`standard`},render:(e,{globals:t})=>(0,_.jsx)(l,{"aria-label":i(t.locale,v).favorite,...e,children:(0,_.jsx)(s,{name:`favorite`})})},k={args:{width:`medium`,rounding:`square`},render:(e,{globals:t})=>(0,_.jsx)(l,{"aria-label":i(t.locale,v).favorite,...e,children:(0,_.jsx)(s,{name:`favorite`})})},A={render:(e,{globals:t})=>(0,_.jsx)(`div`,{className:`flex-row flex-wrap gap-4`,children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,_.jsx)(l,{size:e,appearance:`tonal`,"aria-label":i(t.locale,v).favorite,width:`medium`,children:(0,_.jsx)(s,{name:`favorite`})},e))})},j={render:(e,{globals:t})=>(0,_.jsx)(`div`,{className:`flex-row gap-4`,children:[`narrow`,`medium`,`wide`].map(e=>(0,_.jsx)(l,{width:e,appearance:`tonal`,"aria-label":i(t.locale,v).favorite,children:(0,_.jsx)(s,{name:`favorite`})},e))})},M={args:{width:`medium`},argTypes:{toggleable:{control:!1},selected:{control:!1}},render:({toggleable:e,selected:t,onClick:n,...r},{globals:a})=>(0,_.jsx)(()=>{let[e,t]=(0,g.useState)(!1),n={...r,toggleable:!0,selected:e,"aria-label":i(a.locale,v).favorite};return(0,_.jsx)(l,{...n,onClick:()=>t(e=>!e),children:(0,_.jsx)(s,{name:`favorite`})})},{})},N={render:(e,{globals:t})=>{let n=i(t.locale,v),r={display:`flex`,flexWrap:`wrap`,gap:`16px`},a={display:`grid`,gap:`16px`},o=[`standard`,`filled`,`tonal`,`outlined`];return(0,_.jsxs)(`div`,{style:a,children:[(0,_.jsx)(`div`,{style:r,children:o.map(e=>(0,_.jsx)(l,{appearance:e,"aria-label":n.favorite,width:`medium`,children:(0,_.jsx)(s,{name:`favorite`})},e))}),(0,_.jsx)(`div`,{style:r,children:o.map(e=>(0,_.jsx)(l,{appearance:e,"aria-label":n.favoriteDisabled,disabled:!0,width:`medium`,children:(0,_.jsx)(s,{name:`favorite`})},e))})]})}},P=[`WithTextOnly`,`WithLeadingIcon`,`IconOnly`,`Square`,`Toggleable`,`SizeMatrix`,`AppearanceMatrix`,`DisabledStates`,`IconStandard`,`IconSquare`,`IconSizeMatrix`,`IconWidthMatrix`,`IconToggleable`,`IconAppearanceMatrix`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => <M3Button {...args}>
      <M3Icon name="share" /> {localize(globals.locale, messages).share}
    </M3Button>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium'
  },
  render: (args, {
    globals
  }) => <M3Button aria-label={localize(globals.locale, messages).share} {...args}>
      <M3Icon name="share" />
    </M3Button>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    rounding: 'square'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const Toggle = () => {
      const [selected, setSelected] = useState(false);
      const toggleArgs = {
        ...args,
        appearance: 'tonal' as const,
        toggleable: true,
        selected
      };
      return <M3Button {...toggleArgs} onClick={() => setSelected(!selected)}>
          <M3Icon name="favorite" /> {localize(globals.locale, {
          'en-US': 'Favorite',
          'ru-RU': 'Избранное'
        })}
        </M3Button>;
    };
    return <Toggle />;
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <div className="flex-row flex-wrap gap-4">
      {values.sizes.map(size => <M3Button key={size} size={size}>
          <M3Icon name="share" /> {localize(globals.locale, messages).share}
        </M3Button>)}
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const stack = {
      display: 'grid',
      gap: '16px'
    } satisfies CSSProperties;
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    return <div style={stack}>
        <div style={row}>
          {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance}>
              {text.share}
            </M3Button>)}
        </div>

        <div style={row}>
          {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance}>
              <M3Icon name="share" /> {text.share}
            </M3Button>)}
        </div>
      </div>;
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    return <div style={row}>
        {values.appearances.map(appearance => <M3Button key={appearance} appearance={appearance} disabled={true}>
            {text.share}
          </M3Button>)}
      </div>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium',
    appearance: 'standard'
  },
  render: (args, {
    globals
  }) => <M3Button aria-label={localize(globals.locale, messages).favorite} {...args}>
      <M3Icon name="favorite" />
    </M3Button>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    width: 'medium',
    rounding: 'square'
  },
  render: (args, {
    globals
  }) => <M3Button aria-label={localize(globals.locale, messages).favorite} {...args}>
      <M3Icon name="favorite" />
    </M3Button>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <div className="flex-row flex-wrap gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => <M3Button key={size} size={size} appearance="tonal" aria-label={localize(globals.locale, messages).favorite} width="medium">
          <M3Icon name="favorite" />
        </M3Button>)}
    </div>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <div className="flex-row gap-4">
      {(['narrow', 'medium', 'wide'] as const).map(width => <M3Button key={width} width={width} appearance="tonal" aria-label={localize(globals.locale, messages).favorite}>
          <M3Icon name="favorite" />
        </M3Button>)}
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
  render: ({
    toggleable: _toggleable,
    selected: _selected,
    onClick: _onClick,
    ...args
  }, {
    globals
  }) => {
    const IconButtonToggleable = () => {
      const [selected, setSelected] = useState(false);
      const buttonProps = {
        ...args,
        toggleable: true,
        selected,
        'aria-label': localize(globals.locale, messages).favorite
      };
      return <M3Button {...buttonProps} onClick={() => setSelected(current => !current)}>
          <M3Icon name="favorite" />
        </M3Button>;
    };
    return <IconButtonToggleable />;
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px'
    } satisfies CSSProperties;
    const stack = {
      display: 'grid',
      gap: '16px'
    } satisfies CSSProperties;
    const appearances = ['standard', 'filled', 'tonal', 'outlined'] as const;
    return <div style={stack}>
        <div style={row}>
          {appearances.map(appearance => <M3Button key={appearance} appearance={appearance} aria-label={text.favorite} width="medium">
              <M3Icon name="favorite" />
            </M3Button>)}
        </div>

        <div style={row}>
          {appearances.map(appearance => <M3Button key={appearance} appearance={appearance} aria-label={text.favoriteDisabled} disabled={true} width="medium">
              <M3Icon name="favorite" />
            </M3Button>)}
        </div>
      </div>;
  }
}`,...N.parameters?.docs?.source}}}})))()}export{F as n,h as t};