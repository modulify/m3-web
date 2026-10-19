import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-DoGwlH6V.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{B as o,N as s,T as c,V as l,k as u,s as d,t as f}from"./hooks-CH2FLbno.js";import{i as p,n as m,r as h,t as g}from"./content-DvUXzEtz.js";import{n as _,t as v}from"./styling-3ZliOIda.js";import{r as y,t as b}from"./icon-D--1wrzK.js";import{n as x,t as S}from"./ripple-Cc0kQ9LI.js";import{n as C,t as w}from"./events-COG85N6O.js";import{n as T,t as E}from"./icon-button-vYXEgJ0G.js";import{n as D,t as O}from"./button-B4XAGab6.js";var k,A,j,M,N,P,F;function I(){return(I=e((()=>{k=n(),S(),p(),C(),l(),v(),f(),A=a(),j=m(`M3Card.Content`),M=m(`M3Card.Media`,({className:e=``,children:t=[],...n})=>(0,A.jsx)(`div`,{className:_([`m3-card__media`,e]),...n,children:t})),N=m(`M3Card.Heading`,({className:e=``,children:t=[],...n})=>(0,A.jsx)(`div`,{className:_([`m3-card__heading`,e]),...n,children:t})),P=m(`M3Card.Subheading`,({className:e=``,children:t=[],...n})=>(0,A.jsx)(`div`,{className:_([`m3-card__subheading`,e]),...n,children:t})),F=o(function({ref:e,id:t,appearance:n=`filled`,heading:r=``,subheading:i=``,interactive:a=!1,landscape:o=!1,className:l=``,role:f,children:p=[],onClick:m=e=>{},...v},{expose:y}){let b=c(t,`m3-card`),S=(0,k.useRef)(null),C=(0,k.useRef)(null),T=(0,k.useRef)(null),[E,D]=d();y(s(S));let[O,F,I]=h(p,{content:j,heading:N,media:M,subheading:P});u(C,D);let L=I(`heading`)||r.length>0,R=I(`subheading`)||i.length>0,z=O.heading?.props.id??null,B=O.heading?z?O.heading:g(O.heading,{id:b+`-heading`}):r.length?(0,A.jsx)(N,{id:b+`-heading`,children:r}):null,V=!(`aria-label`in v)&&!(`aria-labelledby`in v)&&!I(`content`)&&L?{"aria-labelledby":z??b+`-heading`}:{},H=`aria-label`in v||`aria-labelledby`in v||`aria-labelledby`in V;return(0,A.jsxs)(`section`,{ref:S,role:f??(H?`region`:void 0),className:_([l,{"m3-card":!0,[`m3-card_`+n]:!0,"m3-card_interactive":a,"m3-card_landscape":o}]),...a?{tabIndex:0}:{},...V,...v,onClick:w(e=>{a&&T.current?.activate(e.nativeEvent)},m),children:[a?(0,A.jsx)(`div`,{ref:C,className:`m3-card__state`,children:(0,A.jsx)(x,{ref:T,owner:E})}):null,O.content??(0,A.jsxs)(A.Fragment,{children:[O.media,(0,A.jsxs)(`div`,{className:`m3-card__content`,children:[L||R?(0,A.jsxs)(`div`,{className:`m3-card__head`,children:[B,O.subheading??(i.length?(0,A.jsx)(P,{children:i}):null)]}):null,F]})]})]})},{slots:{Content:j,Heading:N,Media:M,Subheading:P}})})))()}function L(){return(L=e((()=>{I()})))()}var R=t({AppearanceMatrix:()=>G,Landscape:()=>H,LandscapeWithoutMedia:()=>U,Portrait:()=>W,__namedExportsOrder:()=>K,default:()=>V}),z,B,V,H,U,W,G,K;function q(){return(q=e((()=>{O(),L(),b(),E(),i(),z=a(),B={"en-US":{cardEmphasis:`Card emphasis`,enabled:`Enabled`,header:`Header`,supportingText:`Supporting text for the current card style.`,subhead:`Subhead`,title:`Title`},"ru-RU":{cardEmphasis:`Акцент карточки`,enabled:`Доступно`,header:`Заголовок`,supportingText:`Поясняющий текст для текущего стиля карточки.`,subhead:`Подзаголовок`,title:`Название`}},V={title:`Components/M3Card`,component:F,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]},landscape:{control:!1}},args:{appearance:`filled`},render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsxs)(F,{landscape:!0,...e,children:[(0,z.jsx)(F.Media,{children:(0,z.jsx)(`img`,{alt:``,src:`/assets/image-80x80.png`})}),(0,z.jsx)(F.Heading,{children:n.header}),(0,z.jsx)(F.Subheading,{children:n.subhead})]})},parameters:{layout:`centered`}},H={},U={render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsxs)(F,{"aria-label":n.header,landscape:!0,...e,children:[(0,z.jsx)(`svg`,{width:`40`,height:`40`,viewBox:`0 0 40 40`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,z.jsx)(`circle`,{cx:`20`,cy:`20`,r:`20`,fill:`#6750A4`})}),(0,z.jsxs)(`div`,{className:`m3-card__head`,children:[(0,z.jsx)(`div`,{className:`m3-card__heading`,children:n.header}),(0,z.jsx)(`div`,{className:`m3-card__subheading`,children:n.subhead})]}),(0,z.jsx)(T,{className:`ml-auto`,children:(0,z.jsx)(y,{name:`more_vert`})})]})}},W={render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsxs)(F,{...e,children:[(0,z.jsx)(F.Media,{children:(0,z.jsx)(`img`,{alt:``,src:`/assets/image-720x376.png`})}),(0,z.jsx)(F.Heading,{children:n.title}),(0,z.jsx)(F.Subheading,{children:n.subhead}),`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor`,(0,z.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`,width:`100%`},children:[(0,z.jsx)(D,{appearance:`outlined`,children:n.enabled}),(0,z.jsx)(D,{children:n.enabled})]})]})}},G={render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`flex-start`},children:[`filled`,`elevated`,`outlined`].map(e=>(0,z.jsxs)(F,{appearance:e,style:{width:`220px`},children:[(0,z.jsx)(F.Heading,{children:e}),(0,z.jsx)(F.Subheading,{children:n.cardEmphasis}),n.supportingText]},e))})}},K=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3Card aria-label={text.header} landscape {...args}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#6750A4" />
      </svg>

      <div className="m3-card__head">
        <div className="m3-card__heading">{text.header}</div>
        <div className="m3-card__subheading">{text.subhead}</div>
      </div>

      <M3IconButton className="ml-auto">
        <M3Icon name="more_vert" />
      </M3IconButton>
    </M3Card>;
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3Card {...args}>
      <M3Card.Media>
        <img alt="" src="/assets/image-720x376.png" />
      </M3Card.Media>

      <M3Card.Heading>
        {text.title}
      </M3Card.Heading>

      <M3Card.Subheading>
        {text.subhead}
      </M3Card.Subheading>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        width: '100%'
      }}>
        <M3Button appearance="outlined">
          {text.enabled}
        </M3Button>

        <M3Button>
          {text.enabled}
        </M3Button>
      </div>
    </M3Card>;
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'flex-start'
    } satisfies CSSProperties;
    return <div style={row}>
        {(['filled', 'elevated', 'outlined'] as const).map(appearance => <M3Card key={appearance} appearance={appearance} style={{
        width: '220px'
      }}>
            <M3Card.Heading>{appearance}</M3Card.Heading>
            <M3Card.Subheading>{text.cardEmphasis}</M3Card.Subheading>
            {text.supportingText}
          </M3Card>)}
      </div>;
  }
}`,...G.parameters?.docs?.source}}}})))()}export{I as a,F as i,q as n,L as r,R as t};