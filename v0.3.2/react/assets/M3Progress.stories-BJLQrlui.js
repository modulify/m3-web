import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./react-BGJ90fIb.js";import{a as r,i}from"./iframe-HxWonkjq.js";import{t as a}from"./jsx-runtime-MKhVqBIO.js";import{B as o,N as s,V as c,l,t as u,z as d}from"./hooks-Bw5-EmDM.js";import{n as f,t as p}from"./styling-gIgWpKuq.js";import{n as m,t as h}from"./button-CKhrCSda.js";var g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{g=e=>Number.isFinite(e)?Math.min(100,Math.max(0,e)):0,_=e=>Number.isFinite(e)?Math.min(240,Math.max(24,e)):40,v=e=>Number.isFinite(e)?Math.max(1,e):4,y=(e,t,n)=>v(n??4*e/(t?48:40)),b=e=>e<=10||e>=95?0:1,x=(e,t,n,r=1,i=0)=>{let a=1.6*e/48,o=Math.max(1,e/2-t/2-a),s=Math.max(3,Math.round(2*Math.PI*o/(15*e/48))),c=g(n)/100,l=Math.max(1,Math.ceil(s*24*c)),u=e/2;return`${Array.from({length:l+1},(e,t)=>{let n=2*Math.PI*c*t/l,d=o+a*r*Math.sin(s*n+2*Math.PI*i),f=u+d*Math.sin(n),p=u-d*Math.cos(n);return`${t===0?`M`:`L`} ${f.toFixed(3)} ${p.toFixed(3)}`}).join(` `)}${c===1?` Z`:``}`},S=(e,t)=>{let n=g(e),r=n===0?0:Math.max(n,.01);return{activeLength:r,trackLength:n===0?100:Math.max(0,100-r-2*t),trackOffset:n===0?0:-r-t}},C=(e,t,n,r)=>{let i=r?1.6*e/48:0,a=Math.max(1,e/2-t/2-i),o=2*Math.PI*a,s=(4+t)/o*100,c=S(n,s),l=e/2,u=`M ${l} ${l-a} A ${a} ${a} 0 1 1 ${l} ${l+a} A ${a} ${a} 0 1 1 ${l} ${l-a}`;return r?{path:x(e,t,100),trackPath:u,radius:a,gap:s,...c}:{path:u,trackPath:u,radius:a,gap:s,...c}},w=e=>{let t=e/2,n=[`M 0 ${t}`];for(let e=0;e<410;e++){let r=e*20;n.push(`Q ${r+10} ${t+(e%2?6:-6)} ${r+20} ${t}`)}return n.join(` `)},T=e=>{let t=0,n=1;for(let r=0;r<12;r++){let r=(t+n)/2,i=1-r;3*i*i*r*.3+3*i*r*r*.8+r**3<e?t=r:n=r}let r=(t+n)/2;return 3*(1-r)*r*r*.15+r**3},E=(e,t,n)=>e<=t?0:e>=t+n?1:T((e-t)/n),D=(e,t,n)=>{let r=(n%1750+1750)%1750,i=[{start:E(r,250,1e3)*e,end:E(r,0,1e3)*e},{start:E(r,900,850)*e,end:E(r,650,850)*e}].map(({start:t,end:n})=>({start:Math.max(0,Math.min(e,t)),end:Math.max(0,Math.min(e,n))})).filter(({start:e,end:t})=>t-e>.01).sort((e,t)=>e.start-t.start),a=[];for(let e of i){let t=a.at(-1);t&&e.start<=t.end?t.end=Math.max(t.end,e.end):a.push({...e})}let o=[],s=t+4,c=0;for(let e of a){let n=Math.max(c,e.start-s);n-c>=t&&o.push({start:c,end:n}),c=Math.max(c,e.end+s)}return e-c>=t&&o.push({start:c,end:e}),{active:a,track:o}},O=(e,t,n,r=0)=>{let{start:i,end:a}=e,o=t/2;if(!n)return`M ${i.toFixed(3)} ${o} L ${a.toFixed(3)} ${o}`;let s=Math.max(1,Math.ceil((a-i)/4));return Array.from({length:s+1},(e,t)=>{let n=i+(a-i)*t/s,c=o+3*Math.sin(2*Math.PI*(n+r)/40);return`${t===0?`M`:`L`} ${n.toFixed(3)} ${c.toFixed(3)}`}).join(` `)}})))()}var A,j,M;function ee(){return(ee=e((()=>{A=n(),k(),c(),p(),u(),j=a(),M=o(function({ref:e,value:t=0,indeterminate:n=!1,shape:r=`flat`,size:i,thickness:a,track:o=!0,className:c=``,style:l,...u},{expose:p}){let m=(0,A.useRef)(null);p(s(m));let h=(0,A.useRef)(null),v=(0,A.useRef)(null),w=_(i??(r===`wavy`?48:40)),T=r===`wavy`,E=g(t),D=y(w,T,a),O=b(E),k=(0,A.useMemo)(()=>C(w,D,E,T),[w,D,E,T]),M=n?C(w,D,10,T):k,ee=T?void 0:`${M.activeLength} ${100-M.activeLength}`,N=(0,A.useRef)(O),P=T?x(w,D,n?10:E,n?1:N.current):k.path,F=d();(0,A.useEffect)(()=>{if(!m.current||!h.current||!v.current)return;let e=m.current,t=h.current,r=v.current,i=t.ownerSVGElement,a=window.matchMedia?.(`(prefers-reduced-motion: reduce)`),o=new AbortController,s=o=>{let c=a?.matches??!1,l=n?Number(getComputedStyle(i).getPropertyValue(`--m3-progress-circular-sweep`)):E,u=S(l,k.gap);if(r.setAttribute(`stroke-dasharray`,`${u.trackLength} ${100-u.trackLength}`),r.setAttribute(`stroke-dashoffset`,String(u.trackOffset)),r.setAttribute(`opacity`,n?String(Math.min(1,u.trackLength)):`1`),T){let r=n?``:getComputedStyle(e).getPropertyValue(`--m3-progress-wave-amplitude`).trim(),i=r?Number(r):O;N.current=n?1:c?O:i,t.setAttribute(`d`,x(w,D,l,N.current,n||c?0:o/1e3%1))}else t.setAttribute(`stroke-dasharray`,`${u.activeLength} ${100-u.activeLength}`);!c&&(n||T&&(N.current!==0||O!==0))&&F.request(s)};return a?.addEventListener(`change`,()=>F.request(s),{signal:o.signal}),F.request(s),()=>{F.cancel(),o.abort(`Progress circle disposed`)}},[T,w,D,E,n,k.gap,O,F]);let te={...u,role:`progressbar`,"aria-valuemin":n?void 0:0,"aria-valuemax":n?void 0:100,"aria-valuenow":n?void 0:E};return(0,j.jsx)(`div`,{ref:m,className:f([c,{"m3-progress":!0,"m3-progress_circular":!0,"m3-progress_wavy":T,"m3-progress_wave-flat":T&&!n&&O===0,"m3-progress_indeterminate":n,"m3-progress_empty":!n&&E===0,"m3-progress_complete":!n&&E===100,"m3-progress_no-track":!o}]),style:{...l,"--m3-progress-container-size":`${w}px`,"--m3-progress-thickness":`${D}px`,"--m3-progress-circular-gap":k.gap},...te,children:(0,j.jsx)(`svg`,{className:`m3-progress__circular`,viewBox:`0 0 ${w} ${w}`,"aria-hidden":`true`,children:(0,j.jsxs)(`g`,{className:`m3-progress__circular-motion`,children:[(0,j.jsx)(`path`,{ref:v,className:`m3-progress__circular-track`,d:k.trackPath,pathLength:`100`,strokeWidth:D,strokeDasharray:`${M.trackLength} ${100-M.trackLength}`,strokeDashoffset:M.trackOffset,strokeLinecap:`round`}),(0,j.jsx)(`path`,{ref:h,className:`m3-progress__circular-active`,d:P,pathLength:`100`,strokeWidth:D,strokeDasharray:ee,strokeLinecap:`round`,style:!n&&E===0?{display:`none`}:void 0})]})})})})})))()}var N,P,F;function te(){return(te=e((()=>{N=n(),k(),c(),p(),u(),P=a(),F=o(function({ref:e,value:t=0,indeterminate:n=!1,shape:r=`flat`,thickness:i,track:a=!0,stop:o=!0,className:c=``,style:u,...p},{expose:m}){let h=(0,N.useRef)(null);m(s(h));let _=(0,N.useRef)(null),y=g(t),b=v(i??4),x=b+6,S=(0,N.useMemo)(()=>w(x),[x]),C=(0,N.useRef)(()=>{}),T=d();l(h,()=>C.current()),(0,N.useEffect)(()=>{if(!n||!h.current||!_.current)return;let e=h.current,t=_.current,i=[...t.querySelectorAll(`.m3-progress__linear-motion-track`)],a=[...t.querySelectorAll(`.m3-progress__linear-motion-active`)],o=window.matchMedia?.(`(prefers-reduced-motion: reduce)`),s=r===`wavy`?x:b,c=performance.now(),l=0,u=new AbortController,d=e=>{let t=o?.matches??!1,n=t?875:e-c,u=D(l,b,n),f=t?0:n/1e3*40;i.forEach((e,t)=>{e.setAttribute(`d`,u.track[t]?O(u.track[t],s,!1):``)}),a.forEach((e,t)=>{e.setAttribute(`d`,u.active[t]?O(u.active[t],s,r===`wavy`,f):``)}),t||T.request(d)},f=()=>{l=Math.max(1,e.getBoundingClientRect().width),t.setAttribute(`viewBox`,`0 0 ${l} ${s}`),T.request(d)};return C.current=f,o?.addEventListener(`change`,f,{signal:u.signal}),f(),()=>{T.cancel(),C.current=()=>{},u.abort(`Progress line disposed`)}},[n,b,r,x,T]);let E={...p,role:`progressbar`,"aria-valuemin":n?void 0:0,"aria-valuemax":n?void 0:100,"aria-valuenow":n?void 0:y};return(0,P.jsx)(`div`,{ref:h,className:f([c,{"m3-progress":!0,"m3-progress_linear":!0,"m3-progress_wavy":r===`wavy`,"m3-progress_indeterminate":n,"m3-progress_empty":!n&&y===0,"m3-progress_complete":!n&&y===100,"m3-progress_no-track":!a,"m3-progress_no-stop":!o}]),style:{...u,"--m3-progress-container-size":`${r===`wavy`?x:b}px`,"--m3-progress-thickness":`${b}px`,"--m3-progress-end":`${y}%`},...E,children:n?(0,P.jsxs)(`svg`,{ref:_,className:`m3-progress__linear-motion`,"aria-hidden":`true`,children:[[0,1,2].map(e=>(0,P.jsx)(`path`,{className:`m3-progress__linear-motion-track`,strokeWidth:b,strokeLinecap:`round`},e)),[0,1].map(e=>(0,P.jsx)(`path`,{className:`m3-progress__linear-motion-active`,strokeWidth:b,strokeLinecap:`round`},e))]}):(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`span`,{className:`m3-progress__track`,"aria-hidden":`true`}),(0,P.jsx)(`span`,{className:`m3-progress__active`,"aria-hidden":`true`,children:r===`wavy`&&(0,P.jsx)(`svg`,{className:`m3-progress__wave`,width:`8200`,height:x,"aria-hidden":`true`,children:(0,P.jsx)(`path`,{d:S,fill:`none`,stroke:`currentColor`,strokeWidth:b})})}),(0,P.jsx)(`span`,{className:`m3-progress__stop`,"aria-hidden":`true`})]})})})})))()}var ne,re,I;function ie(){return(ie=e((()=>{ne=n(),c(),ee(),te(),re=a(),I=o(function({ref:e,variant:t=`linear`,shape:n=`flat`,value:r=0,indeterminate:i=!1,size:a,thickness:o,track:s=!0,stop:c=!0,...l},{expose:u}){let d=(0,ne.useRef)(null);u({get el(){return d.current?.el??null}});let f={shape:n,value:r,indeterminate:i,thickness:o,track:s,...l};return t===`circular`?(0,re.jsx)(M,{ref:d,size:a,...f}):(0,re.jsx)(F,{ref:d,stop:c,...f})})})))()}function ae(){return(ae=e((()=>{ie(),te(),ee()})))()}var oe=t({Circular:()=>B,CircularProgressChanges:()=>$,InButton:()=>X,IndeterminateCircular:()=>G,IndeterminateLinear:()=>U,Linear:()=>z,ProgressChanges:()=>Q,RightToLeft:()=>Z,SmallProgress:()=>Y,ThickLinear:()=>J,WavyCircular:()=>H,WavyCircularMotion:()=>q,WavyIndeterminate:()=>K,WavyIndeterminateLinear:()=>W,WavyLinear:()=>V,__namedExportsOrder:()=>de,default:()=>ue}),L,R,se,ce,le,ue,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,de;function fe(){return(fe=e((()=>{L=n(),h(),ae(),i(),R=a(),se=({label:e})=>{let[t,n]=(0,L.useState)(30);return(0,R.jsxs)(`div`,{className:`d-grid gap-6`,style:{width:320},children:[(0,R.jsx)(F,{value:t,"aria-label":e}),(0,R.jsx)(`input`,{type:`range`,min:`0`,max:`100`,value:t,"aria-label":e,onChange:e=>n(Number(e.target.value))})]})},ce=({label:e})=>{let[t,n]=(0,L.useState)(40);return(0,R.jsxs)(`div`,{className:`d-grid gap-6`,style:{width:320},children:[(0,R.jsxs)(`div`,{className:`d-flex gap-8 align-items-center`,children:[(0,R.jsx)(M,{value:t,"aria-label":`${e} (flat)`}),(0,R.jsx)(M,{shape:`wavy`,value:t,"aria-label":`${e} (wavy)`})]}),(0,R.jsx)(`input`,{type:`range`,min:`0`,max:`100`,value:t,"aria-label":e,onChange:e=>n(Number(e.target.value))})]})},le=({label:e,loadingLabel:t})=>{let[n,r]=(0,L.useState)(!1),i=(0,L.useRef)(void 0);return(0,L.useEffect)(()=>()=>window.clearTimeout(i.current),[]),(0,R.jsx)(m,{appearance:`tonal`,"aria-disabled":n,"aria-busy":n,"aria-label":n?t:void 0,style:{minInlineSize:200},onClick:()=>{n||(r(!0),i.current=window.setTimeout(()=>r(!1),2400))},children:n?(0,R.jsx)(M,{track:!1,size:24,"aria-hidden":`true`,style:{"--m3-progress-color":`currentColor`},indeterminate:!0}):e})},ue={title:`Components/M3Progress`,component:I,argTypes:{variant:{control:`select`,options:[`linear`,`circular`]},shape:{control:`select`,options:[`flat`,`wavy`]},value:{control:{type:`range`,min:0,max:100,step:1}},thickness:{control:{type:`range`,min:1,max:12,step:1}},size:{control:{type:`range`,min:24,max:240,step:4}}},args:{variant:`linear`,shape:`flat`,value:40,indeterminate:!1,track:!0,stop:!0},render:(e,{globals:t})=>{let n=r(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`});return(0,R.jsx)(`div`,{style:{width:e.variant===`linear`?360:void 0},children:(0,R.jsx)(I,{"aria-label":n,...e})})},parameters:{layout:`centered`}},z={},B={args:{variant:`circular`}},V={args:{shape:`wavy`}},H={args:{variant:`circular`,shape:`wavy`}},U={args:{indeterminate:!0}},W={args:{shape:`wavy`,indeterminate:!0}},G={args:{variant:`circular`,indeterminate:!0}},K={args:{variant:`circular`,shape:`wavy`,indeterminate:!0}},q={args:{variant:`circular`,shape:`wavy`,indeterminate:!0},render:(e,{globals:t})=>{let n=r(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`});return(0,R.jsx)(`div`,{className:`d-flex gap-8 align-items-center`,children:[48,96,160].map(t=>(0,R.jsx)(I,{"aria-label":`${n} (${t}px)`,...e,size:t},t))})}},J={args:{thickness:8,shape:`wavy`}},Y={args:{value:1}},X={render:(e,{globals:t})=>(0,R.jsx)(le,{label:r(t.locale,{"en-US":`Download episode`,"ru-RU":`Скачать эпизод`}),loadingLabel:r(t.locale,{"en-US":`Downloading episode`,"ru-RU":`Загрузка эпизода`})})},Z={args:{value:30},render:(e,{globals:t})=>{let n=r(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`});return(0,R.jsx)(`div`,{dir:`rtl`,style:{width:360},children:(0,R.jsx)(I,{"aria-label":n,...e})})}},Q={render:(e,{globals:t})=>(0,R.jsx)(se,{label:r(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})})},$={render:(e,{globals:t})=>(0,R.jsx)(ce,{label:r(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})})},de=[`Linear`,`Circular`,`WavyLinear`,`WavyCircular`,`IndeterminateLinear`,`WavyIndeterminateLinear`,`IndeterminateCircular`,`WavyIndeterminate`,`WavyCircularMotion`,`ThickLinear`,`SmallProgress`,`InButton`,`RightToLeft`,`ProgressChanges`,`CircularProgressChanges`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'circular'
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    shape: 'wavy'
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'circular',
    shape: 'wavy'
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    indeterminate: true
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    shape: 'wavy',
    indeterminate: true
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'circular',
    indeterminate: true
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'circular',
    shape: 'wavy',
    indeterminate: true
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'circular',
    shape: 'wavy',
    indeterminate: true
  },
  render: (args, {
    globals
  }) => {
    const label = localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи'
    });
    return <div className="d-flex gap-8 align-items-center">
      {[48, 96, 160].map(size => <M3Progress key={size} aria-label={\`\${label} (\${size}px)\`} {...{
        ...args,
        size
      }} />)}
    </div>;
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    thickness: 8,
    shape: 'wavy'
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    value: 1
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    return <ButtonLoading label={localize(globals.locale, {
      'en-US': 'Download episode',
      'ru-RU': 'Скачать эпизод'
    })} loadingLabel={localize(globals.locale, {
      'en-US': 'Downloading episode',
      'ru-RU': 'Загрузка эпизода'
    })} />;
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    value: 30
  },
  render: (args, {
    globals
  }) => {
    const label = localize(globals.locale, {
      'en-US': 'Loading article',
      'ru-RU': 'Загрузка статьи'
    });
    return <div dir="rtl" style={{
      width: 360
    }}>
      <M3Progress aria-label={label} {...args} />
    </div>;
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <ProgressUpdate label={localize(globals.locale, {
    'en-US': 'Loading article',
    'ru-RU': 'Загрузка статьи'
  })} />
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => <CircularProgressUpdate label={localize(globals.locale, {
    'en-US': 'Loading article',
    'ru-RU': 'Загрузка статьи'
  })} />
}`,...$.parameters?.docs?.source}}}})))()}export{fe as _,U as a,Q as c,J as d,H as f,V as g,W as h,G as i,Z as l,K as m,$ as n,z as o,q as p,X as r,oe as s,B as t,Y as u};