import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-wale67Qv.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{C as o,O as s,h as c,k as l,s as u,t as d,y as f}from"./hooks-CPk-xpjN.js";import{n as p,t as m}from"./ripple-BZyVuUjI.js";import{n as h,t as g}from"./events-COG85N6O.js";import{i as _,n as v,r as y,t as b}from"./content-DvUXzEtz.js";import{n as x,t as S}from"./styling-Cr0ZBcFE.js";import{n as C,t as w}from"./button-Bg5IbSnS.js";import{r as T,t as E}from"./icon-qppvVYBr.js";import{n as D,t as O}from"./icon-button-D8Zh6wJc.js";var k,A,j,M,N,P,F;function I(){return(I=e((()=>{k=n(),m(),_(),h(),l(),S(),d(),A=a(),j=v(`M3Card.Content`),M=v(`M3Card.Media`,({className:e=``,children:t=[],...n})=>(0,A.jsx)(`div`,{className:x([`m3-card__media`,e]),...n,children:t})),N=v(`M3Card.Heading`,({className:e=``,children:t=[],...n})=>(0,A.jsx)(`div`,{className:x([`m3-card__heading`,e]),...n,children:t})),P=v(`M3Card.Subheading`,({className:e=``,children:t=[],...n})=>(0,A.jsx)(`div`,{className:x([`m3-card__subheading`,e]),...n,children:t})),F=s(function({ref:e,id:t,appearance:n=`filled`,heading:r=``,subheading:i=``,interactive:a=!1,landscape:s=!1,className:l=``,role:d,children:m=[],onClick:h=e=>{},..._},{expose:v}){let S=c(t,`m3-card`),C=(0,k.useRef)(null),w=(0,k.useRef)(null),T=(0,k.useRef)(null),[E,D]=u();v(o(C));let[O,F,I]=y(m,{content:j,heading:N,media:M,subheading:P});f(w,D);let L=I(`heading`)||r.length>0,R=I(`subheading`)||i.length>0,z=O.heading?.props.id??null,B=O.heading?z?O.heading:b(O.heading,{id:S+`-heading`}):r.length?(0,A.jsx)(N,{id:S+`-heading`,children:r}):null,V=!(`aria-label`in _)&&!(`aria-labelledby`in _)&&!I(`content`)&&L?{"aria-labelledby":z??S+`-heading`}:{},H=`aria-label`in _||`aria-labelledby`in _||`aria-labelledby`in V;return(0,A.jsxs)(`section`,{ref:C,role:d??(H?`region`:void 0),className:x([l,{"m3-card":!0,[`m3-card_`+n]:!0,"m3-card_interactive":a,"m3-card_landscape":s}]),...a?{tabIndex:0}:{},...V,..._,onClick:g(e=>{a&&T.current?.activate(e.nativeEvent)},h),children:[a?(0,A.jsx)(`div`,{ref:w,className:`m3-card__state`,children:(0,A.jsx)(p,{ref:T,owner:E})}):null,O.content??(0,A.jsxs)(A.Fragment,{children:[O.media,(0,A.jsxs)(`div`,{className:`m3-card__content`,children:[L||R?(0,A.jsxs)(`div`,{className:`m3-card__head`,children:[B,O.subheading??(i.length?(0,A.jsx)(P,{children:i}):null)]}):null,F]})]})]})},{slots:{Content:j,Heading:N,Media:M,Subheading:P}})})))()}function L(){return(L=e((()=>{I()})))()}var R=t({AppearanceMatrix:()=>G,Landscape:()=>H,LandscapeWithoutMedia:()=>U,Portrait:()=>W,__namedExportsOrder:()=>K,default:()=>V}),z,B,V,H,U,W,G,K;function q(){return(q=e((()=>{w(),L(),E(),O(),i(),z=a(),B={"en-US":{cardEmphasis:`Card emphasis`,enabled:`Enabled`,header:`Header`,supportingText:`Supporting text for the current card style.`,subhead:`Subhead`,title:`Title`},"ru-RU":{cardEmphasis:`Акцент карточки`,enabled:`Доступно`,header:`Заголовок`,supportingText:`Поясняющий текст для текущего стиля карточки.`,subhead:`Подзаголовок`,title:`Название`}},V={title:`Components/M3Card`,component:F,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]},landscape:{control:!1}},args:{appearance:`filled`},render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsxs)(F,{landscape:!0,...e,children:[(0,z.jsx)(F.Media,{children:(0,z.jsx)(`img`,{alt:``,src:`/assets/image-80x80.png`})}),(0,z.jsx)(F.Heading,{children:n.header}),(0,z.jsx)(F.Subheading,{children:n.subhead})]})},parameters:{layout:`centered`}},H={},U={render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsxs)(F,{"aria-label":n.header,landscape:!0,...e,children:[(0,z.jsx)(`svg`,{width:`40`,height:`40`,viewBox:`0 0 40 40`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,z.jsx)(`circle`,{cx:`20`,cy:`20`,r:`20`,fill:`#6750A4`})}),(0,z.jsxs)(`div`,{className:`m3-card__head`,children:[(0,z.jsx)(`div`,{className:`m3-card__heading`,children:n.header}),(0,z.jsx)(`div`,{className:`m3-card__subheading`,children:n.subhead})]}),(0,z.jsx)(D,{className:`ml-auto`,children:(0,z.jsx)(T,{name:`more_vert`})})]})}},W={render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsxs)(F,{...e,children:[(0,z.jsx)(F.Media,{children:(0,z.jsx)(`img`,{alt:``,src:`/assets/image-720x376.png`})}),(0,z.jsx)(F.Heading,{children:n.title}),(0,z.jsx)(F.Subheading,{children:n.subhead}),`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor`,(0,z.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`,width:`100%`},children:[(0,z.jsx)(C,{appearance:`outlined`,children:n.enabled}),(0,z.jsx)(C,{children:n.enabled})]})]})}},G={render:(e,{globals:t})=>{let n=r(t.locale,B);return(0,z.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`flex-start`},children:[`filled`,`elevated`,`outlined`].map(e=>(0,z.jsxs)(F,{appearance:e,style:{width:`220px`},children:[(0,z.jsx)(F.Heading,{children:e}),(0,z.jsx)(F.Subheading,{children:n.cardEmphasis}),n.supportingText]},e))})}},K=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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