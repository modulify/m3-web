import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{C as i,O as a,h as o,k as s,s as c,t as l,y as u}from"./hooks-CPk-xpjN.js";import{n as d,t as f}from"./ripple-BZyVuUjI.js";import{n as p,t as m}from"./events-COG85N6O.js";import{i as h,n as g,r as _,t as v}from"./content-DvUXzEtz.js";import{n as y,t as b}from"./styling-Cr0ZBcFE.js";import{n as x,t as S}from"./button-Bg5IbSnS.js";import{r as C,t as w}from"./icon-qppvVYBr.js";import{n as T,t as E}from"./icon-button-D8Zh6wJc.js";var D,O,k,A,j,M,N;function P(){return(P=e((()=>{D=n(),f(),h(),p(),s(),b(),l(),O=r(),k=g(`M3Card.Content`),A=g(`M3Card.Media`,({className:e=``,children:t=[],...n})=>(0,O.jsx)(`div`,{className:y([`m3-card__media`,e]),...n,children:t})),j=g(`M3Card.Heading`,({className:e=``,children:t=[],...n})=>(0,O.jsx)(`div`,{className:y([`m3-card__heading`,e]),...n,children:t})),M=g(`M3Card.Subheading`,({className:e=``,children:t=[],...n})=>(0,O.jsx)(`div`,{className:y([`m3-card__subheading`,e]),...n,children:t})),N=a(function({ref:e,id:t,appearance:n=`filled`,heading:r=``,subheading:a=``,interactive:s=!1,landscape:l=!1,className:f=``,role:p=`region`,children:h=[],onClick:g=e=>{},...b},{expose:x}){let S=o(t,`m3-card`),C=(0,D.useRef)(null),w=(0,D.useRef)(null),T=(0,D.useRef)(null),[E,N]=c();x(i(C));let[P,F,I]=_(h,{content:k,heading:j,media:A,subheading:M});u(w,N);let L=I(`heading`)||r.length>0,R=I(`subheading`)||a.length>0,z=P.heading?.props.id??null,B=P.heading?z?P.heading:v(P.heading,{id:S+`-heading`}):r.length?(0,O.jsx)(j,{id:S+`-heading`,children:r}):null,V=!(`aria-label`in b)&&!I(`content`)&&L?{"aria-labelledby":z??S+`-heading`}:{};return(0,O.jsxs)(`section`,{ref:C,role:p,className:y([f,{"m3-card":!0,[`m3-card_`+n]:!0,"m3-card_interactive":s,"m3-card_landscape":l}]),...s?{tabIndex:0}:{},...V,...b,onClick:m(e=>{s&&T.current?.activate(e.nativeEvent)},g),children:[s?(0,O.jsx)(`div`,{ref:w,className:`m3-card__state`,children:(0,O.jsx)(d,{ref:T,owner:E})}):null,P.content??(0,O.jsxs)(O.Fragment,{children:[P.media,(0,O.jsxs)(`div`,{className:`m3-card__content`,children:[L||R?(0,O.jsxs)(`div`,{className:`m3-card__head`,children:[B,P.subheading??(a.length?(0,O.jsx)(M,{children:a}):null)]}):null,F]})]})]})},{slots:{Content:k,Heading:j,Media:A,Subheading:M}})})))()}function F(){return(F=e((()=>{P()})))()}var I=t({AppearanceMatrix:()=>H,Landscape:()=>z,LandscapeWithoutMedia:()=>B,Portrait:()=>V,__namedExportsOrder:()=>U,default:()=>R}),L,R,z,B,V,H,U;function W(){return(W=e((()=>{S(),F(),w(),E(),L=r(),R={title:`Components/M3Card`,component:N,argTypes:{appearance:{control:`select`,options:[`elevated`,`filled`,`outlined`]},landscape:{control:!1}},args:{appearance:`filled`},render:e=>(0,L.jsxs)(N,{landscape:!0,...e,children:[(0,L.jsx)(N.Media,{children:(0,L.jsx)(`img`,{alt:``,src:`/assets/image-80x80.png`})}),(0,L.jsx)(N.Heading,{children:`Header`}),(0,L.jsx)(N.Subheading,{children:`Subhead`})]}),parameters:{layout:`centered`}},z={},B={render:e=>(0,L.jsxs)(N,{"aria-label":`Header`,landscape:!0,...e,children:[(0,L.jsx)(`svg`,{width:`40`,height:`40`,viewBox:`0 0 40 40`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:(0,L.jsx)(`circle`,{cx:`20`,cy:`20`,r:`20`,fill:`#6750A4`})}),(0,L.jsxs)(`div`,{className:`m3-card__head`,children:[(0,L.jsx)(`div`,{className:`m3-card__heading`,children:`Header`}),(0,L.jsx)(`div`,{className:`m3-card__subheading`,children:`Subhead`})]}),(0,L.jsx)(T,{className:`ml-auto`,children:(0,L.jsx)(C,{name:`more_vert`})})]})},V={render:e=>(0,L.jsxs)(N,{...e,children:[(0,L.jsx)(N.Media,{children:(0,L.jsx)(`img`,{alt:``,src:`/assets/image-720x376.png`})}),(0,L.jsx)(N.Heading,{children:`Title`}),(0,L.jsx)(N.Subheading,{children:`Subhead`}),`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor`,(0,L.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,gap:`8px`,width:`100%`},children:[(0,L.jsx)(x,{appearance:`outlined`,children:`Enabled`}),(0,L.jsx)(x,{children:`Enabled`})]})]})},H={render:()=>(0,L.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`16px`,alignItems:`flex-start`},children:[`filled`,`elevated`,`outlined`].map(e=>(0,L.jsxs)(N,{appearance:e,style:{width:`220px`},children:[(0,L.jsx)(N.Heading,{children:e}),(0,L.jsx)(N.Subheading,{children:`Card emphasis`}),`Supporting text for the current card style.`]},e))})},U=[`Landscape`,`LandscapeWithoutMedia`,`Portrait`,`AppearanceMatrix`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => <M3Card aria-label="Header" landscape {...args}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#6750A4" />
      </svg>

      <div className="m3-card__head">
        <div className="m3-card__heading">Header</div>
        <div className="m3-card__subheading">Subhead</div>
      </div>

      <M3IconButton className="ml-auto">
        <M3Icon name="more_vert" />
      </M3IconButton>
    </M3Card>
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: args => <M3Card {...args}>
      <M3Card.Media>
        <img alt="" src="/assets/image-720x376.png" />
      </M3Card.Media>

      <M3Card.Heading>
        Title
      </M3Card.Heading>

      <M3Card.Subheading>
        Subhead
      </M3Card.Subheading>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

      <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      width: '100%'
    }}>
        <M3Button appearance="outlined">
          Enabled
        </M3Button>

        <M3Button>
          Enabled
        </M3Button>
      </div>
    </M3Card>
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => {
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
            <M3Card.Subheading>Card emphasis</M3Card.Subheading>
            Supporting text for the current card style.
          </M3Card>)}
      </div>;
  }
}`,...H.parameters?.docs?.source}}}})))()}export{P as a,N as i,W as n,F as r,I as t};