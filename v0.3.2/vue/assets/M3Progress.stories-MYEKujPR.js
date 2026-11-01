import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{C as n,L as r,O as i,P as a,S as o,U as s,V as c,X as l,a as u,b as d,g as f,i as p,lt as m,nt as h,s as g,x as _,y as v,z as ee}from"./iframe-RtmmDuTD.js";import{n as te,t as y}from"./animation-D9yqVNVI.js";import{n as b,t as x}from"./observer-ChdbgpVc.js";import{n as S,t as C}from"./button-D1T4L2h-.js";var w,T,E,D,O,k,ne,re,A,j,M,N,ie;function ae(){return(ae=e((()=>{w=e=>Number.isFinite(e)?Math.min(100,Math.max(0,e)):0,T=e=>Number.isFinite(e)?Math.min(240,Math.max(24,e)):40,E=e=>Number.isFinite(e)?Math.max(1,e):4,D=(e,t,n)=>E(n??4*e/(t?48:40)),O=e=>e<=10||e>=95?0:1,k=(e,t,n,r=1,i=0)=>{let a=1.6*e/48,o=Math.max(1,e/2-t/2-a),s=Math.max(3,Math.round(2*Math.PI*o/(15*e/48))),c=w(n)/100,l=Math.max(1,Math.ceil(s*24*c)),u=e/2;return`${Array.from({length:l+1},(e,t)=>{let n=2*Math.PI*c*t/l,d=o+a*r*Math.sin(s*n+2*Math.PI*i),f=u+d*Math.sin(n),p=u-d*Math.cos(n);return`${t===0?`M`:`L`} ${f.toFixed(3)} ${p.toFixed(3)}`}).join(` `)}${c===1?` Z`:``}`},ne=(e,t)=>{let n=w(e),r=n===0?0:Math.max(n,.01);return{activeLength:r,trackLength:n===0?100:Math.max(0,100-r-2*t),trackOffset:n===0?0:-r-t}},re=(e,t,n,r)=>{let i=r?1.6*e/48:0,a=Math.max(1,e/2-t/2-i),o=2*Math.PI*a,s=(4+t)/o*100,c=ne(n,s),l=e/2,u=`M ${l} ${l-a} A ${a} ${a} 0 1 1 ${l} ${l+a} A ${a} ${a} 0 1 1 ${l} ${l-a}`;return r?{path:k(e,t,100),trackPath:u,radius:a,gap:s,...c}:{path:u,trackPath:u,radius:a,gap:s,...c}},A=e=>{let t=e/2,n=[`M 0 ${t}`];for(let e=0;e<410;e++){let r=e*20;n.push(`Q ${r+10} ${t+(e%2?6:-6)} ${r+20} ${t}`)}return n.join(` `)},j=e=>{let t=0,n=1;for(let r=0;r<12;r++){let r=(t+n)/2,i=1-r;3*i*i*r*.3+3*i*r*r*.8+r**3<e?t=r:n=r}let r=(t+n)/2;return 3*(1-r)*r*r*.15+r**3},M=(e,t,n)=>e<=t?0:e>=t+n?1:j((e-t)/n),N=(e,t,n)=>{let r=(n%1750+1750)%1750,i=[{start:M(r,250,1e3)*e,end:M(r,0,1e3)*e},{start:M(r,900,850)*e,end:M(r,650,850)*e}].map(({start:t,end:n})=>({start:Math.max(0,Math.min(e,t)),end:Math.max(0,Math.min(e,n))})).filter(({start:e,end:t})=>t-e>.01).sort((e,t)=>e.start-t.start),a=[];for(let e of i){let t=a.at(-1);t&&e.start<=t.end?t.end=Math.max(t.end,e.end):a.push({...e})}let o=[],s=t+4,c=0;for(let e of a){let n=Math.max(c,e.start-s);n-c>=t&&o.push({start:c,end:n}),c=Math.max(c,e.end+s)}return e-c>=t&&o.push({start:c,end:e}),{active:a,track:o}},ie=(e,t,n,r=0)=>{let{start:i,end:a}=e,o=t/2;if(!n)return`M ${i.toFixed(3)} ${o} L ${a.toFixed(3)} ${o}`;let s=Math.max(1,Math.ceil((a-i)/4));return Array.from({length:s+1},(e,t)=>{let n=i+(a-i)*t/s,c=o+3*Math.sin(2*Math.PI*(n+r)/40);return`${t===0?`M`:`L`} ${n.toFixed(3)} ${c.toFixed(3)}`}).join(` `)}})))()}var oe,se,ce,le,ue,P;function de(){return(de=e((()=>{g(),ae(),y(),oe=[`aria-valuemin`,`aria-valuemax`,`aria-valuenow`],se=[`viewBox`],ce={class:`m3-progress__circular-motion`},le=[`d`,`stroke-width`,`stroke-dasharray`,`stroke-dashoffset`],ue=[`d`,`stroke-width`,`stroke-dasharray`],P=i({inheritAttrs:!1,__name:`M3ProgressCircle`,props:{value:{type:Number,default:0},indeterminate:{type:Boolean,default:!1},shape:{type:String,default:`flat`},size:{type:Number,default:void 0},thickness:{type:Number,default:void 0},track:{type:Boolean,default:!0}},setup(e,{expose:t}){let i=e,o=h(null);t({get el(){return o.value}});let s=h(null),u=h(null),f=v(()=>T(i.size??(i.shape===`wavy`?48:40))),p=v(()=>i.shape===`wavy`),g=v(()=>w(i.value)),_=v(()=>D(f.value,i.shape===`wavy`,i.thickness)),y=v(()=>O(g.value)),b=v(()=>re(f.value,_.value,g.value,p.value)),x=v(()=>i.indeterminate?re(f.value,_.value,10,p.value):b.value),S=v(()=>p.value?void 0:`${x.value.activeLength} ${100-x.value.activeLength}`),C=y.value,E=v(()=>k(f.value,_.value,i.indeterminate?10:g.value,i.indeterminate?1:C)),A=te(),j,M=()=>{A.cancel(),j?.abort(`Progress circle disposed`),j=void 0},N=()=>{if(M(),!o.value||!s.value||!u.value)return;let e=o.value,t=s.value,n=u.value,r=t.ownerSVGElement,a=window.matchMedia?.(`(prefers-reduced-motion: reduce)`);j=new AbortController;let c=o=>{let s=a?.matches??!1,l=i.indeterminate?Number(getComputedStyle(r).getPropertyValue(`--m3-progress-circular-sweep`)):g.value,u=ne(l,b.value.gap);if(n.setAttribute(`stroke-dasharray`,`${u.trackLength} ${100-u.trackLength}`),n.setAttribute(`stroke-dashoffset`,String(u.trackOffset)),n.setAttribute(`opacity`,i.indeterminate?String(Math.min(1,u.trackLength)):`1`),p.value){let n=i.indeterminate?``:getComputedStyle(e).getPropertyValue(`--m3-progress-wave-amplitude`).trim(),r=n?Number(n):y.value;C=i.indeterminate?1:s?y.value:r,t.setAttribute(`d`,k(f.value,_.value,l,C,i.indeterminate||s?0:o/1e3%1))}else t.setAttribute(`stroke-dasharray`,`${u.activeLength} ${100-u.activeLength}`);!s&&(i.indeterminate||p.value&&(C!==0||y.value!==0))&&A.request(c)};a?.addEventListener(`change`,()=>A.request(c),{signal:j.signal}),A.request(c)};return l([f,_,g,p,()=>i.indeterminate],N,{flush:`post`}),ee(N),r(M),(t,r)=>(c(),n(`div`,a({ref_key:`root`,ref:o},t.$attrs,{"aria-valuemin":e.indeterminate?void 0:0,"aria-valuemax":e.indeterminate?void 0:100,"aria-valuenow":e.indeterminate?void 0:g.value,class:{"m3-progress":!0,"m3-progress_circular":!0,"m3-progress_wavy":p.value,"m3-progress_wave-flat":p.value&&!e.indeterminate&&y.value===0,"m3-progress_indeterminate":e.indeterminate,"m3-progress_empty":!e.indeterminate&&g.value===0,"m3-progress_complete":!e.indeterminate&&g.value===100,"m3-progress_no-track":!e.track},style:{"--m3-progress-container-size":`${f.value}px`,"--m3-progress-thickness":`${_.value}px`,"--m3-progress-circular-gap":b.value.gap},role:`progressbar`}),[(c(),n(`svg`,{viewBox:`0 0 ${f.value} ${f.value}`,class:`m3-progress__circular`,"aria-hidden":`true`},[d(`g`,ce,[d(`path`,{ref_key:`circularTrack`,ref:u,d:b.value.trackPath,"stroke-width":_.value,"stroke-dasharray":`${x.value.trackLength} ${100-x.value.trackLength}`,"stroke-dashoffset":x.value.trackOffset,class:`m3-progress__circular-track`,pathLength:`100`,"stroke-linecap":`round`},null,8,le),d(`path`,{ref_key:`activePath`,ref:s,d:p.value?E.value:b.value.path,"stroke-width":_.value,"stroke-dasharray":S.value,style:m(!e.indeterminate&&g.value===0?{display:`none`}:void 0),class:`m3-progress__circular-active`,pathLength:`100`,"stroke-linecap":`round`},null,12,ue)])],8,se))],16,oe))}})})))()}var F;function fe(){return(fe=e((()=>{de(),F=P,P.__docgenInfo=Object.assign({displayName:P.name??P.__name},{exportName:`default`,displayName:`M3ProgressCircle`,description:``,tags:{},props:[{name:`value`,type:{name:`number`},defaultValue:{func:!1,value:`0`}},{name:`indeterminate`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`shape`,type:{name:`ProgressShape`},defaultValue:{func:!1,value:`'flat'`}},{name:`size`,type:{name:`number`},defaultValue:{func:!1,value:`undefined`}},{name:`thickness`,type:{name:`number`},defaultValue:{func:!1,value:`undefined`}},{name:`track`,type:{name:`boolean`},defaultValue:{func:!1,value:`true`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/progress/M3ProgressCircle.vue`]})})))()}var pe,me,he,ge,_e,ve,I;function ye(){return(ye=e((()=>{g(),ae(),y(),x(),pe=[`aria-valuemin`,`aria-valuemax`,`aria-valuenow`],me=[`stroke-width`],he=[`stroke-width`],ge={class:`m3-progress__active`,"aria-hidden":`true`},_e=[`height`],ve=[`d`,`stroke-width`],I=i({inheritAttrs:!1,__name:`M3ProgressLine`,props:{value:{type:Number,default:0},indeterminate:{type:Boolean,default:!1},shape:{type:String,default:`flat`},thickness:{type:Number,default:void 0},track:{type:Boolean,default:!0},stop:{type:Boolean,default:!0}},setup(e,{expose:t}){let i=e,u=h(null),p=h(null);t({get el(){return u.value}});let m=v(()=>w(i.value)),g=v(()=>E(i.thickness??4)),_=v(()=>g.value+6),y=v(()=>A(_.value)),x,S=()=>{},C=te(),T=b(u,()=>S()),D=()=>{C.cancel(),T.unobserve(),x?.abort(`Progress line disposed`),S=()=>{},x=void 0},O=()=>{if(D(),!i.indeterminate||!u.value||!p.value)return;let e=u.value,t=p.value,n=[...t.querySelectorAll(`.m3-progress__linear-motion-track`)],r=[...t.querySelectorAll(`.m3-progress__linear-motion-active`)],a=window.matchMedia?.(`(prefers-reduced-motion: reduce)`),o=i.shape===`wavy`?_.value:g.value,s=performance.now(),c=0;x=new AbortController;let l=e=>{let t=a?.matches??!1,u=t?875:e-s,d=N(c,g.value,u),f=t?0:u/1e3*40;n.forEach((e,t)=>{e.setAttribute(`d`,d.track[t]?ie(d.track[t],o,!1):``)}),r.forEach((e,t)=>{e.setAttribute(`d`,d.active[t]?ie(d.active[t],o,i.shape===`wavy`,f):``)}),t||C.request(l)},d=()=>{c=Math.max(1,e.getBoundingClientRect().width),t.setAttribute(`viewBox`,`0 0 ${c} ${o}`),C.request(l)};S=d,T.observe(),a?.addEventListener(`change`,d,{signal:x.signal}),d()};return l([()=>i.indeterminate,()=>i.shape,g],O,{flush:`post`}),ee(O),r(D),(t,r)=>(c(),n(`div`,a({ref_key:`root`,ref:u},t.$attrs,{"aria-valuemin":e.indeterminate?void 0:0,"aria-valuemax":e.indeterminate?void 0:100,"aria-valuenow":e.indeterminate?void 0:m.value,class:{"m3-progress":!0,"m3-progress_linear":!0,"m3-progress_wavy":e.shape===`wavy`,"m3-progress_indeterminate":e.indeterminate,"m3-progress_empty":!e.indeterminate&&m.value===0,"m3-progress_complete":!e.indeterminate&&m.value===100,"m3-progress_no-track":!e.track,"m3-progress_no-stop":!e.stop},style:{"--m3-progress-container-size":`${e.shape===`wavy`?_.value:g.value}px`,"--m3-progress-thickness":`${g.value}px`,"--m3-progress-end":`${m.value}%`},role:`progressbar`}),[e.indeterminate?(c(),n(`svg`,{key:0,ref_key:`motion`,ref:p,class:`m3-progress__linear-motion`,"aria-hidden":`true`},[(c(),n(f,null,s(3,e=>d(`path`,{key:`track-${e}`,"stroke-width":g.value,class:`m3-progress__linear-motion-track`,"stroke-linecap":`round`},null,8,me)),64)),(c(),n(f,null,s(2,e=>d(`path`,{key:`active-${e}`,"stroke-width":g.value,class:`m3-progress__linear-motion-active`,"stroke-linecap":`round`},null,8,he)),64))],512)):(c(),n(f,{key:1},[r[0]||=d(`span`,{class:`m3-progress__track`,"aria-hidden":`true`},null,-1),d(`span`,ge,[e.shape===`wavy`?(c(),n(`svg`,{key:0,height:_.value,class:`m3-progress__wave`,width:`8200`,"aria-hidden":`true`},[d(`path`,{d:y.value,"stroke-width":g.value,fill:`none`,stroke:`currentColor`},null,8,ve)],8,_e)):o(``,!0)]),r[1]||=d(`span`,{class:`m3-progress__stop`,"aria-hidden":`true`},null,-1)],64))],16,pe))}})})))()}var be;function xe(){return(xe=e((()=>{ye(),be=I,I.__docgenInfo=Object.assign({displayName:I.name??I.__name},{exportName:`default`,displayName:`M3ProgressLine`,description:``,tags:{},props:[{name:`value`,type:{name:`number`},defaultValue:{func:!1,value:`0`}},{name:`indeterminate`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`shape`,type:{name:`ProgressShape`},defaultValue:{func:!1,value:`'flat'`}},{name:`thickness`,type:{name:`number`},defaultValue:{func:!1,value:`undefined`}},{name:`track`,type:{name:`boolean`},defaultValue:{func:!1,value:`true`}},{name:`stop`,type:{name:`boolean`},defaultValue:{func:!1,value:`true`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/progress/M3ProgressLine.vue`]})})))()}var L;function Se(){return(Se=e((()=>{g(),fe(),xe(),L=i({inheritAttrs:!1,__name:`M3Progress`,props:{variant:{type:String,default:`linear`},shape:{type:String,default:`flat`},value:{type:Number,default:0},indeterminate:{type:Boolean,default:!1},size:{type:Number,default:void 0},thickness:{type:Number,default:void 0},track:{type:Boolean,default:!0},stop:{type:Boolean,default:!0}},setup(e,{expose:t}){let n=h(null);return t({get el(){return n.value?.el??null}}),(t,r)=>e.variant===`circular`?(c(),_(F,a({key:0,ref_key:`view`,ref:n},t.$attrs,{shape:e.shape,value:e.value,indeterminate:e.indeterminate,size:e.size,thickness:e.thickness,track:e.track}),null,16,[`shape`,`value`,`indeterminate`,`size`,`thickness`,`track`])):(c(),_(be,a({key:1,ref_key:`view`,ref:n},t.$attrs,{shape:e.shape,value:e.value,indeterminate:e.indeterminate,thickness:e.thickness,track:e.track,stop:e.stop}),null,16,[`shape`,`value`,`indeterminate`,`thickness`,`track`,`stop`]))}})})))()}var R;function Ce(){return(Ce=e((()=>{Se(),R=L,L.__docgenInfo=Object.assign({displayName:L.name??L.__name},{exportName:`default`,displayName:`M3Progress`,description:``,tags:{},props:[{name:`variant`,type:{name:`ProgressVariant`},defaultValue:{func:!1,value:`'linear'`}},{name:`shape`,type:{name:`ProgressShape`},defaultValue:{func:!1,value:`'flat'`}},{name:`value`,type:{name:`number`},defaultValue:{func:!1,value:`0`}},{name:`indeterminate`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`size`,type:{name:`number`},defaultValue:{func:!1,value:`undefined`}},{name:`thickness`,type:{name:`number`},defaultValue:{func:!1,value:`undefined`}},{name:`track`,type:{name:`boolean`},defaultValue:{func:!1,value:`true`}},{name:`stop`,type:{name:`boolean`},defaultValue:{func:!1,value:`true`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/progress/M3Progress.vue`]})})))()}function we(){return(we=e((()=>{Ce(),xe(),fe()})))()}var Te=t({Circular:()=>B,CircularProgressChanges:()=>$,InButton:()=>X,IndeterminateCircular:()=>G,IndeterminateLinear:()=>U,Linear:()=>z,ProgressChanges:()=>Q,RightToLeft:()=>Z,SmallProgress:()=>Y,ThickLinear:()=>J,WavyCircular:()=>H,WavyCircularMotion:()=>q,WavyIndeterminate:()=>K,WavyIndeterminateLinear:()=>W,WavyLinear:()=>V,__namedExportsOrder:()=>De,default:()=>Ee}),Ee,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,De;function Oe(){return(Oe=e((()=>{g(),C(),we(),p(),Ee={title:`Components/M3Progress`,component:R,argTypes:{variant:{control:`select`,options:[`linear`,`circular`]},shape:{control:`select`,options:[`flat`,`wavy`]},value:{control:{type:`range`,min:0,max:100,step:1}},thickness:{control:{type:`range`,min:1,max:12,step:1}},size:{control:{type:`range`,min:24,max:240,step:4}}},args:{variant:`linear`,shape:`flat`,value:40,indeterminate:!1,track:!0,stop:!0},render:(e,{globals:t})=>({components:{M3Progress:R},setup(){return{args:e,label:u(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})}},template:`
        <div :style="{ width: args.variant === 'linear' ? '360px' : undefined }">
            <M3Progress v-bind="args" :aria-label="label" />
        </div>
    `}),parameters:{layout:`centered`}},z={},B={args:{variant:`circular`}},V={args:{shape:`wavy`}},H={args:{variant:`circular`,shape:`wavy`}},U={args:{indeterminate:!0}},W={args:{shape:`wavy`,indeterminate:!0}},G={args:{variant:`circular`,indeterminate:!0}},K={args:{variant:`circular`,shape:`wavy`,indeterminate:!0}},q={args:{variant:`circular`,shape:`wavy`,indeterminate:!0},render:(e,{globals:t})=>({components:{M3Progress:R},setup(){return{args:e,sizes:[48,96,160],label:u(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})}},template:`
        <div class="d-flex gap-8 align-items-center">
            <M3Progress
                v-for="size in sizes"
                :key="size"
                v-bind="args"
                :size="size"
                :aria-label="label + ' (' + size + 'px)'"
            />
        </div>
    `})},J={args:{thickness:8,shape:`wavy`}},Y={args:{value:1}},X={render:(e,{globals:t})=>({components:{M3Button:S,M3ProgressCircle:F},setup(){let e=h(!1),n;return r(()=>window.clearTimeout(n)),{loading:e,start:()=>{e.value||(e.value=!0,n=window.setTimeout(()=>{e.value=!1},2400))},buttonLabel:u(t.locale,{"en-US":`Download episode`,"ru-RU":`Скачать эпизод`}),label:u(t.locale,{"en-US":`Downloading episode`,"ru-RU":`Загрузка эпизода`})}},template:`
        <M3Button
            appearance="tonal"
            style="min-inline-size: 200px;"
            :aria-disabled="loading"
            :aria-busy="loading"
            :aria-label="loading ? label : undefined"
            @click="start"
        >
            <M3ProgressCircle
                v-if="loading"
                indeterminate
                :track="false"
                :size="24"
                aria-hidden="true"
                :style="{ '--m3-progress-color': 'currentColor' }"
            />
            <template v-else>{{ buttonLabel }}</template>
        </M3Button>
    `})},Z={render:(e,{globals:t})=>({components:{M3Progress:R},setup(){return{args:e,label:u(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})}},template:`
        <div dir="rtl" style="width: 360px;">
            <M3Progress v-bind="args" :aria-label="label" />
        </div>
    `})},Q={render:(e,{globals:t})=>({components:{M3ProgressLine:be},setup(){return{value:h(30),label:u(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})}},template:`
        <div class="d-grid gap-6" style="width: 320px;">
            <M3ProgressLine :value="value" :aria-label="label" />
            <input v-model.number="value" type="range" min="0" max="100" :aria-label="label" />
        </div>
    `})},$={render:(e,{globals:t})=>({components:{M3ProgressCircle:F},setup(){return{value:h(40),label:u(t.locale,{"en-US":`Loading article`,"ru-RU":`Загрузка статьи`})}},template:`
        <div class="d-grid gap-6" style="width: 320px;">
            <div class="d-flex gap-8 align-items-center">
                <M3ProgressCircle :value="value" :aria-label="label + ' (flat)'" />
                <M3ProgressCircle shape="wavy" :value="value" :aria-label="label + ' (wavy)'" />
            </div>
            <input v-model.number="value" type="range" min="0" max="100" :aria-label="label" />
        </div>
    `})},De=[`Linear`,`Circular`,`WavyLinear`,`WavyCircular`,`IndeterminateLinear`,`WavyIndeterminateLinear`,`IndeterminateCircular`,`WavyIndeterminate`,`WavyCircularMotion`,`ThickLinear`,`SmallProgress`,`InButton`,`RightToLeft`,`ProgressChanges`,`CircularProgressChanges`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
  }) => ({
    components: {
      M3Progress
    },
    setup() {
      return {
        args,
        sizes: [48, 96, 160],
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи'
        })
      };
    },
    template: \`
        <div class="d-flex gap-8 align-items-center">
            <M3Progress
                v-for="size in sizes"
                :key="size"
                v-bind="args"
                :size="size"
                :aria-label="label + ' (' + size + 'px)'"
            />
        </div>
    \`
  })
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
  }) => ({
    components: {
      M3Button,
      M3ProgressCircle
    },
    setup() {
      const loading = ref(false);
      let timer: number | undefined;
      const start = () => {
        if (loading.value) return;
        loading.value = true;
        timer = window.setTimeout(() => {
          loading.value = false;
        }, 2400);
      };
      onBeforeUnmount(() => window.clearTimeout(timer));
      return {
        loading,
        start,
        buttonLabel: localize(globals.locale, {
          'en-US': 'Download episode',
          'ru-RU': 'Скачать эпизод'
        }),
        label: localize(globals.locale, {
          'en-US': 'Downloading episode',
          'ru-RU': 'Загрузка эпизода'
        })
      };
    },
    template: \`
        <M3Button
            appearance="tonal"
            style="min-inline-size: 200px;"
            :aria-disabled="loading"
            :aria-busy="loading"
            :aria-label="loading ? label : undefined"
            @click="start"
        >
            <M3ProgressCircle
                v-if="loading"
                indeterminate
                :track="false"
                :size="24"
                aria-hidden="true"
                :style="{ '--m3-progress-color': 'currentColor' }"
            />
            <template v-else>{{ buttonLabel }}</template>
        </M3Button>
    \`
  })
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => ({
    components: {
      M3Progress
    },
    setup() {
      return {
        args,
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи'
        })
      };
    },
    template: \`
        <div dir="rtl" style="width: 360px;">
            <M3Progress v-bind="args" :aria-label="label" />
        </div>
    \`
  })
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3ProgressLine
    },
    setup() {
      return {
        value: ref(30),
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи'
        })
      };
    },
    template: \`
        <div class="d-grid gap-6" style="width: 320px;">
            <M3ProgressLine :value="value" :aria-label="label" />
            <input v-model.number="value" type="range" min="0" max="100" :aria-label="label" />
        </div>
    \`
  })
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3ProgressCircle
    },
    setup() {
      return {
        value: ref(40),
        label: localize(globals.locale, {
          'en-US': 'Loading article',
          'ru-RU': 'Загрузка статьи'
        })
      };
    },
    template: \`
        <div class="d-grid gap-6" style="width: 320px;">
            <div class="d-flex gap-8 align-items-center">
                <M3ProgressCircle :value="value" :aria-label="label + ' (flat)'" />
                <M3ProgressCircle shape="wavy" :value="value" :aria-label="label + ' (wavy)'" />
            </div>
            <input v-model.number="value" type="range" min="0" max="100" :aria-label="label" />
        </div>
    \`
  })
}`,...$.parameters?.docs?.source}}}})))()}export{Oe as _,U as a,Q as c,J as d,H as f,V as g,W as h,G as i,Z as l,K as m,$ as n,z as o,q as p,X as r,Te as s,B as t,Y as u};