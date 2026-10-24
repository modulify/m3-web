import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{B as n,C as r,H as i,N as a,O as o,P as s,V as c,W as l,a as u,i as d,j as f,nt as p,s as m,st as h,y as g,z as _}from"./iframe-DlP_3VDG.js";import{n as v,r as y}from"./runtime-BrGqCp3U.js";import{d as b,n as x,t as S,u as C}from"./button-DcVEi8uC.js";import{n as w,t as T}from"./icon-BHYZNUrK.js";var E;function D(){return(D=e((()=>{E=Symbol(`M3ButtonGroup`)})))()}var O;function k(){return(k=e((()=>{m(),C(),D(),O=o({__name:`M3ButtonGroup`,props:{variant:{type:String,default:`standard`},size:{type:String,default:`sm`},rounding:{type:String,default:`round`},selection:{type:String,default:void 0},required:{type:Boolean,default:!1},value:{type:[String,Array,null],default:void 0},defaultValue:{type:[String,Array,null],default:null}},emits:[`update:value`,`change`],setup(e,{expose:t,emit:a}){let o=e,s=a,u=p(null),d=p(o.defaultValue),f=g(()=>o.selection??(o.variant===`connected`?`single`:`none`)),m=g(()=>o.value===void 0?d.value:o.value);t({get el(){return u.value}}),i(E,{variant:g(()=>o.variant),size:g(()=>o.size),rounding:g(()=>o.rounding),selection:f,selected:e=>f.value===`multiple`?Array.isArray(m.value)&&m.value.includes(e):f.value===`single`&&m.value===e,activate:e=>{if(f.value===`none`)return;let t;if(f.value===`multiple`){let n=Array.isArray(m.value)?m.value:[];if(t=n.includes(e)?n.filter(t=>t!==e):[...n,e],o.required&&t.length===0)return}else if(t=m.value===e?null:e,o.required&&t===null)return;o.value===void 0&&(d.value=t),s(`update:value`,t),s(`change`,t)}}),b(()=>o.size),_(()=>{let e=Array.from(u.value?.querySelectorAll(`:scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)`)??[]),t=e.find(e=>e===document.activeElement),n=e.find(e=>e.getAttribute(`aria-pressed`)===`true`),r=t??n??e[0];e.forEach(e=>e.tabIndex=e===r?0:-1)}),n(()=>{let e=Array.from(u.value?.querySelectorAll(`:scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)`)??[]),t=e.find(e=>e===document.activeElement),n=e.find(e=>e.getAttribute(`aria-pressed`)===`true`),r=t??n??e[0];e.forEach(e=>e.tabIndex=e===r?0:-1)});let v=e=>{let t=e.target;t.matches(`.m3-button-group__item:not(:disabled)`)&&u.value?.querySelectorAll(`.m3-button-group__item:not(:disabled)`).forEach(e=>e.tabIndex=e===t?0:-1)},y=e=>{let{key:t}=e;if(![`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`].includes(t))return;let n=Array.from(u.value?.querySelectorAll(`:scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)`)??[]),r=n.indexOf(e.target);if(r<0||n.length===0)return;let i=getComputedStyle(u.value).direction===`rtl`,a=(r+(t===`ArrowUp`||t===`ArrowLeft`&&!i||t===`ArrowRight`&&i?-1:1)+n.length)%n.length;n.forEach(e=>e.tabIndex=e===n[a]?0:-1),n[a]?.focus(),e.preventDefault()};return(t,n)=>(c(),r(`div`,{ref_key:`root`,ref:u,class:h([`m3-button-group`,`m3-button-group_`+e.variant,`m3-button-group_`+e.size,`m3-button-group_`+e.rounding]),role:`group`,onFocusin:v,onKeydown:y},[l(t.$slots,`default`)],34))}})})))()}var A;function j(){return(j=e((()=>{k(),A=O,O.__docgenInfo=Object.assign({displayName:O.name??O.__name},{exportName:`default`,displayName:`M3ButtonGroup`,description:``,tags:{},props:[{name:`variant`,type:{name:`Variant`},defaultValue:{func:!1,value:`'standard'`}},{name:`size`,type:{name:`Size`},defaultValue:{func:!1,value:`'sm'`}},{name:`rounding`,type:{name:`Rounding`},defaultValue:{func:!1,value:`'round'`}},{name:`selection`,type:{name:`Selection`},defaultValue:{func:!1,value:`undefined`}},{name:`required`,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}},{name:`value`,type:{name:`Value | undefined`},defaultValue:{func:!1,value:`undefined`}},{name:`defaultValue`,type:{name:`Value`},defaultValue:{func:!1,value:`null`}}],events:[{name:`update:value`,type:{names:[`Value`]}},{name:`change`,type:{names:[`Value`]}}],slots:[{name:`default`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/button-group/M3ButtonGroup.vue`]})})))()}var M,N;function P(){return(P=e((()=>{m(),S(),v(),D(),M=(e,t,n)=>[`m3-button-group__wrapper`,{"m3-button-group__wrapper_icon-only":e,[`m3-button-group__wrapper_${t}`]:t&&t!==n}],N=o({inheritAttrs:!1,props:{value:{type:String,required:!0},appearance:{type:String,default:`tonal`},kind:{type:String,default:`button`},size:{type:String,default:void 0},width:{type:String,default:`medium`},disabled:{type:Boolean,default:!1}},emits:{click:e=>!0},setup(e,{attrs:t,emit:n,expose:r,slots:i}){let o=a(E);if(!o)throw Error(`M3ButtonGroupItem must be inside M3ButtonGroup`);let c=p(null);r({get el(){return c.value?.el??null},click:()=>c.value?.click(),focus:()=>c.value?.focus(),blur:()=>c.value?.blur()});let l=t=>{n(`click`,t),!t.defaultPrevented&&!e.disabled&&o.activate(e.value)};return()=>{let n=y(i.default?.()??[]),r=n.length===1&&n[0][1],a=o.selected(e.value),u=o.selection.value!==`none`;if(o.variant.value===`connected`&&e.size&&e.size!==o.size.value)throw Error(`Connected M3ButtonGroup items must use the group size`);let d=s(t,{ref:c,type:`button`,disabled:e.disabled,size:e.size,rounding:o.rounding.value,toggleable:u,selected:a,class:[`m3-button-group__item`,{"m3-button-group__item_icon-only":r,"m3-button-group__item_selected":a}],onClick:l}),p=e.kind===`icon`?f(x,{...d,appearance:e.appearance,width:e.width},()=>i.default?.()):f(x,{...d,appearance:e.appearance},()=>i.default?.());return f(`span`,{class:M(r,e.size,o.size.value),onClick:t=>{t.target===t.currentTarget&&!e.disabled&&c.value?.click()}},[p])}}})})))()}function F(){return(F=e((()=>{j(),P()})))()}var I=t({ConnectedActions:()=>V,ConnectedLarge:()=>U,ConnectedMultiple:()=>B,ConnectedSingle:()=>z,ConnectedSquare:()=>H,ExtraSmallActions:()=>G,ExtraSmallToggle:()=>Y,IconKinds:()=>K,MixedSizes:()=>q,StandardActions:()=>W,StandardToggle:()=>J,__namedExportsOrder:()=>X,default:()=>R}),L,R,z,B,V,H,U,W,G,K,q,J,Y,X;function Z(){return(Z=e((()=>{F(),T(),d(),L={"en-US":{additionalActions:`More actions`,calendarView:`Calendar view`,copy:`Copy`,day:`Day`,documentActions:`Document actions`,download:`Download`,editingActions:`Editing actions`,iconButton:`Wide icon button`,month:`Month`,moreActions:`More actions`,next:`Next`,ordinaryButton:`Ordinary icon-only button`,play:`Play`,playback:`Playback`,previous:`Previous`,save:`Save`,share:`Share`,week:`Week`},"ru-RU":{additionalActions:`Дополнительные действия`,calendarView:`Вид календаря`,copy:`Копировать`,day:`День`,documentActions:`Действия с документом`,download:`Скачать`,editingActions:`Действия редактирования`,iconButton:`Широкая кнопка с иконкой`,month:`Месяц`,moreActions:`Другие действия`,next:`Вперёд`,ordinaryButton:`Обычная кнопка с иконкой`,play:`Играть`,playback:`Воспроизведение`,previous:`Назад`,save:`Сохранить`,share:`Поделиться`,week:`Неделя`}},R={title:`Components/M3ButtonGroup`,component:A,argTypes:{variant:{control:`select`,options:[`standard`,`connected`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},rounding:{control:`select`,options:[`round`,`square`]},selection:{control:`select`,options:[`none`,`single`,`multiple`]}},args:{variant:`connected`,size:`sm`,rounding:`round`,selection:`single`,defaultValue:`day`},render:(e,{globals:t})=>({components:{M3ButtonGroup:A,M3ButtonGroupItem:N,M3Icon:w},setup:()=>({args:e,text:u(t.locale,L)}),template:`
        <div class="p-6" style="width: min(560px, 90vw); background: var(--m3-sys-surface-container-low); border-radius: 24px">
            <M3ButtonGroup v-bind="args" :aria-label="text.calendarView">
                <M3ButtonGroupItem value="day">
                    <M3Icon name="calendar_today" />{{ text.day }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="week">
                    <M3Icon name="date_range" />{{ text.week }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="month">
                    <M3Icon name="calendar_month" />{{ text.month }}
                </M3ButtonGroupItem>
            </M3ButtonGroup>
        </div>
    `}),parameters:{layout:`centered`}},z={},B={args:{selection:`multiple`,defaultValue:[`day`,`week`]}},V={render:(e,{globals:t})=>({components:{M3ButtonGroup:A,M3ButtonGroupItem:N,M3Icon:w},setup:()=>({text:u(t.locale,L)}),template:`
        <div class="p-6" style="width: min(560px, 90vw); background: var(--m3-sys-surface-container-low); border-radius: 24px">
            <M3ButtonGroup variant="connected" selection="none" :aria-label="text.documentActions">
                <M3ButtonGroupItem value="copy">
                    <M3Icon name="content_copy" />{{ text.copy }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="download">
                    <M3Icon name="download" />{{ text.download }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="share">
                    <M3Icon name="share" />{{ text.share }}
                </M3ButtonGroupItem>
            </M3ButtonGroup>
        </div>
    `})},H={args:{rounding:`square`}},U={args:{size:`lg`}},W={render:(e,{globals:t})=>({components:{M3ButtonGroup:A,M3ButtonGroupItem:N,M3Icon:w},setup:()=>({args:e,text:u(t.locale,L)}),template:`
        <div class="p-6" style="background: var(--m3-sys-surface-container-low); border-radius: 24px">
            <M3ButtonGroup variant="standard" :size="args.size" :rounding="args.rounding" :aria-label="text.editingActions">
                <M3ButtonGroupItem value="save" appearance="filled">
                    <M3Icon name="save" />{{ text.save }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="share" appearance="tonal">
                    <M3Icon name="share" />{{ text.share }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="more" kind="icon" appearance="outlined" :aria-label="text.moreActions">
                    <M3Icon name="more_vert" />
                </M3ButtonGroupItem>
            </M3ButtonGroup>
        </div>
    `})},G={...W,args:{size:`xs`}},K={render:(e,{globals:t})=>({components:{M3ButtonGroup:A,M3ButtonGroupItem:N,M3Icon:w},setup:()=>({text:u(t.locale,L)}),template:`
        <M3ButtonGroup variant="standard" :aria-label="text.additionalActions">
            <M3ButtonGroupItem value="ordinary" :aria-label="text.ordinaryButton">
                <M3Icon name="more_vert" />
            </M3ButtonGroupItem>
            <M3ButtonGroupItem value="icon" kind="icon" width="wide" :aria-label="text.iconButton">
                <M3Icon name="more_vert" />
            </M3ButtonGroupItem>
        </M3ButtonGroup>
    `})},q={render:(e,{globals:t})=>({components:{M3ButtonGroup:A,M3ButtonGroupItem:N,M3Icon:w},setup:()=>({text:u(t.locale,L)}),template:`
        <M3ButtonGroup variant="standard" size="sm" :aria-label="text.playback">
            <M3ButtonGroupItem value="previous" kind="icon" appearance="tonal" :aria-label="text.previous">
                <M3Icon name="skip_previous" />
            </M3ButtonGroupItem>
            <M3ButtonGroupItem value="play" size="md" appearance="filled">
                <M3Icon name="play_arrow" />{{ text.play }}
            </M3ButtonGroupItem>
            <M3ButtonGroupItem value="next" kind="icon" appearance="tonal" :aria-label="text.next">
                <M3Icon name="skip_next" />
            </M3ButtonGroupItem>
        </M3ButtonGroup>
    `})},J={args:{variant:`standard`,selection:`multiple`,defaultValue:[`day`]}},Y={args:{variant:`standard`,size:`xs`,selection:`multiple`,defaultValue:[`day`]}},X=[`ConnectedSingle`,`ConnectedMultiple`,`ConnectedActions`,`ConnectedSquare`,`ConnectedLarge`,`StandardActions`,`ExtraSmallActions`,`IconKinds`,`MixedSizes`,`StandardToggle`,`ExtraSmallToggle`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    selection: 'multiple',
    defaultValue: ['day', 'week']
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3ButtonGroup,
      M3ButtonGroupItem,
      M3Icon
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div class="p-6" style="width: min(560px, 90vw); background: var(--m3-sys-surface-container-low); border-radius: 24px">
            <M3ButtonGroup variant="connected" selection="none" :aria-label="text.documentActions">
                <M3ButtonGroupItem value="copy">
                    <M3Icon name="content_copy" />{{ text.copy }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="download">
                    <M3Icon name="download" />{{ text.download }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="share">
                    <M3Icon name="share" />{{ text.share }}
                </M3ButtonGroupItem>
            </M3ButtonGroup>
        </div>
    \`
  })
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    rounding: 'square'
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => ({
    components: {
      M3ButtonGroup,
      M3ButtonGroupItem,
      M3Icon
    },
    setup: () => ({
      args,
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div class="p-6" style="background: var(--m3-sys-surface-container-low); border-radius: 24px">
            <M3ButtonGroup variant="standard" :size="args.size" :rounding="args.rounding" :aria-label="text.editingActions">
                <M3ButtonGroupItem value="save" appearance="filled">
                    <M3Icon name="save" />{{ text.save }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="share" appearance="tonal">
                    <M3Icon name="share" />{{ text.share }}
                </M3ButtonGroupItem>
                <M3ButtonGroupItem value="more" kind="icon" appearance="outlined" :aria-label="text.moreActions">
                    <M3Icon name="more_vert" />
                </M3ButtonGroupItem>
            </M3ButtonGroup>
        </div>
    \`
  })
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  ...StandardActions,
  args: {
    size: 'xs'
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3ButtonGroup,
      M3ButtonGroupItem,
      M3Icon
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <M3ButtonGroup variant="standard" :aria-label="text.additionalActions">
            <M3ButtonGroupItem value="ordinary" :aria-label="text.ordinaryButton">
                <M3Icon name="more_vert" />
            </M3ButtonGroupItem>
            <M3ButtonGroupItem value="icon" kind="icon" width="wide" :aria-label="text.iconButton">
                <M3Icon name="more_vert" />
            </M3ButtonGroupItem>
        </M3ButtonGroup>
    \`
  })
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3ButtonGroup,
      M3ButtonGroupItem,
      M3Icon
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
        <M3ButtonGroup variant="standard" size="sm" :aria-label="text.playback">
            <M3ButtonGroupItem value="previous" kind="icon" appearance="tonal" :aria-label="text.previous">
                <M3Icon name="skip_previous" />
            </M3ButtonGroupItem>
            <M3ButtonGroupItem value="play" size="md" appearance="filled">
                <M3Icon name="play_arrow" />{{ text.play }}
            </M3ButtonGroupItem>
            <M3ButtonGroupItem value="next" kind="icon" appearance="tonal" :aria-label="text.next">
                <M3Icon name="skip_next" />
            </M3ButtonGroupItem>
        </M3ButtonGroup>
    \`
  })
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'standard',
    selection: 'multiple',
    defaultValue: ['day']
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'standard',
    size: 'xs',
    selection: 'multiple',
    defaultValue: ['day']
  }
}`,...Y.parameters?.docs?.source}}}})))()}export{H as a,q as c,z as i,W as l,U as n,K as o,B as r,I as s,V as t,Z as u};