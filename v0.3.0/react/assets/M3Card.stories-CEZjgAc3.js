import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-D8ji4XVX.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{B as o,N as s,T as c,V as l,k as u,s as d,t as f}from"./hooks-C8H38iP7.js";import{i as p,n as m,r as h,t as g}from"./content-DvUXzEtz.js";import{n as _,t as v}from"./styling-6Blru8yv.js";import{r as y,t as b}from"./icon-4W1iC_Ck.js";import{n as x,t as S}from"./ripple-CfUhDB4e.js";import{n as C,t as w}from"./button-wQR3CB3H.js";import{n as T,t as E}from"./events-COG85N6O.js";var D,O,k,A,j,M,N;function P(){return(P=e((()=>{D=n(),S(),p(),T(),l(),v(),f(),O=a(),k=m(`M3Card.Content`),A=m(`M3Card.Media`,({className:e=``,children:t=[],...n})=>(0,O.jsx)(`div`,{className:_([`m3-card__media`,e]),...n,children:t})),j=m(`M3Card.Heading`,({className:e=``,children:t=[],...n})=>(0,O.jsx)(`div`,{className:_([`m3-card__heading`,e]),...n,children:t})),M=m(`M3Card.Subheading`,({className:e=``,children:t=[],...n})=>(0,O.jsx)(`div`,{className:_([`m3-card__subheading`,e]),...n,children:t})),N=o(function({ref:e,id:t,appearance:n=`filled`,heading:r=``,subheading:i=``,interactive:a=!1,landscape:o=!1,className:l=``,role:f,children:p=[],onClick:m=e=>{},...v},{expose:y}){let b=c(t,`m3-card`),S=(0,D.useRef)(null),C=(0,D.useRef)(null),w=(0,D.useRef)(null),[T,N]=d();y(s(S));let[P,F,I]=h(p,{content:k,heading:j,media:A,subheading:M});u(C,N);let L=I(`heading`)||r.length>0,R=I(`subheading`)||i.length>0,z=P.heading?.props.id??null,B=P.heading?z?P.heading:g(P.heading,{id:b+`-heading`}):r.length?(0,O.jsx)(j,{id:b+`-heading`,children:r}):null,V=!(`aria-label`in v)&&!(`aria-labelledby`in v)&&!I(`content`)&&L?{"aria-labelledby":z??b+`-heading`}:{},H=`aria-label`in v||`aria-labelledby`in v||`aria-labelledby`in V;return(0,O.jsxs)(`section`,{ref:S,role:f??(H?`region`:void 0),className:_([l,{"m3-card":!0,[`m3-card_`+n]:!0,"m3-card_interactive":a,"m3-card_landscape":o}]),...a?{tabIndex:0}:{},...V,...v,onClick:E(e=>{a&&w.current?.activate(e.nativeEvent)},m),children:[a?(0,O.jsx)(`div`,{ref:C,className:`m3-card__state`,children:(0,O.jsx)(x,{ref:w,owner:T})}):null,P.content??(0,O.jsxs)(O.Fragment,{children:[P.media,(0,O.jsxs)(`div`,{className:`m3-card__content`,children:[L||R?(0,O.jsxs)(`div`,{className:`m3-card__head`,children:[B,P.subheading??(i.length?(0,O.jsx)(M,{children:i}):null)]}):null,F]})]})]})},{slots:{Content:k,Heading:j,Media:A,Subheading:M}})})))()}function F(){return(F=e((()=>{P()})))()}var I=t({AppearanceMatrix:()=>U,Landscape:()=>B,LandscapeWithoutMedia:()=>V,Portrait:()=>H,__namedExportsOrder:()=>W,default:()=>z}),L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{w(),F(),b(),i(),L=a(),R={"en-US":{cardEmphasis:`Card emphasis`,enabled:`Enabled`,header:`Header`,supportingText:`Supporting text for the current card style.`,subhead:`Subhead`,title:`Title`},"ru-RU":{cardEmphasis:`Акцент карточки`,enabled:`Доступно`,header:`Заголовок`,supportingText:`Поясняющий текст для текущего стиля карточки.`,subhead:`Подзаголовок`,title:`Название`}},z={title:`Components/M3Card`,component:N,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]},landscape:{control:!1}},args:{appearance:`filled`},render:(e,{globals:t})=>{let n=r(t.locale,R);return(0,L.jsxs)(N,{landscape:!0,...e,children:[(0,L.jsx)(N.Media,{children:(0,L.jsx)(`img`,{alt:``,src:`/assets/image-80x80.png`})}),(0,L.jsx)(N.Heading,{children:n.header}),(0,L.jsx)(N.Subheading,{children:n.subhead})]})},parameters:{layout:`centered`}},B={},V={render:(e,{globals:t})=>{let n=r(t.locale,R);return(0,L.jsxs)(N,{"aria-label":n.header,landscape:!0,...e,children:[(0,L.jsx)(`svg`,{width:`40`,height:`40`,viewBox:`0 0 40 40`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,L.jsx)(`circle`,{cx:`20`,cy:`20`,r:`20`,fill:`#6750A4`})}),(0,L.jsxs)(`div`,{className:`m3-card__head`,children:[(0,L.jsx)(`div`,{className:`m3-card__heading`,children:n.header}),(0,L.jsx)(`div`,{className:`m3-card__subheading`,children:n.subhead})]}),(0,L.jsx)(C,{appearance:`standard`,className:`ml-auto`,width:`medium`,children:(0,L.jsx)(y,{name:`more_vert`})})]})}},H={render:(e,{globals:t})=>{let n=r(t.locale,R);return(0,L.jsxs)(N,{...e,children:[(0,L.jsx)(N.Media,{children:(0,L.jsx)(`img`,{alt:``,src:`/assets/image-720x376.png`})}),(0,L.jsx)(N.Heading,{children:n.title}),(0,L.jsx)(N.Subheading,{children:n.subhead}),`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor`,(0,L.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`,width:`100%`},children:[(0,L.jsx)(C,{appearance:`outlined`,children:n.enabled}),(0,L.jsx)(C,{children:n.enabled})]})]})}},U={render:(e,{globals:t})=>{let n=r(t.locale,R);return(0,L.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`flex-start`},children:[`filled`,`elevated`,`outlined`].map(e=>(0,L.jsxs)(N,{appearance:e,style:{width:`220px`},children:[(0,L.jsx)(N.Heading,{children:e}),(0,L.jsx)(N.Subheading,{children:n.cardEmphasis}),n.supportingText]},e))})}},W=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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

      <M3Button appearance="standard" className="ml-auto" width="medium">
        <M3Icon name="more_vert" />
      </M3Button>
    </M3Card>;
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}}})))()}export{P as a,N as i,G as n,F as r,I as t};