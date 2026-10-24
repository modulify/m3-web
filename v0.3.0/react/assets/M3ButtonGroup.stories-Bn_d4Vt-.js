import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{t as n}from"./react-Q1GcV6wX.js";import{a as r,i}from"./iframe-D8ji4XVX.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{B as o,N as s,V as c,t as l}from"./hooks-C8H38iP7.js";import{i as u,o as d}from"./content-DvUXzEtz.js";import{n as f,t as p}from"./styling-6Blru8yv.js";import{r as m,t as h}from"./icon-4W1iC_Ck.js";import{a as g,i as _,n as v,t as y}from"./button-wQR3CB3H.js";var b,x,S,C,w;function T(){return(T=e((()=>{b=n(),y(),g(),c(),u(),p(),l(),x=a(),S=(0,b.createContext)(null),C=o(function({ref:e,variant:t=`standard`,size:n=`sm`,rounding:r=`round`,selection:i,required:a=!1,value:o,defaultValue:c=null,onChange:l=()=>{},className:u=``,children:d,onFocusCapture:p=()=>{},onKeyDown:m=()=>{},...h},{expose:g}){let v=(0,b.useRef)(null),[y,C]=(0,b.useState)(c),w=i??(t===`connected`?`single`:`none`),T=o===void 0?y:o;(0,b.useLayoutEffect)(()=>{let e=Array.from(v.current?.querySelectorAll(`:scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)`)??[]),t=e.find(e=>e===document.activeElement),n=e.find(e=>e.getAttribute(`aria-pressed`)===`true`),r=t??n??e[0];e.forEach(e=>e.tabIndex=e===r?0:-1)}),g(s(v));let E=(0,b.useCallback)(e=>w===`multiple`?Array.isArray(T)&&T.includes(e):w===`single`&&T===e,[w,T]),D=(0,b.useCallback)(e=>{if(w===`none`)return;let t;if(w===`multiple`){let n=Array.isArray(T)?T:[];if(t=n.includes(e)?n.filter(t=>t!==e):[...n,e],a&&t.length===0)return}else if(t=T===e?null:e,a&&t===null)return;o===void 0&&C(t),l(t)},[w,T,a,o,l]),O=e=>{let{key:t}=e;if(![`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`].includes(t))return;let n=Array.from(v.current?.querySelectorAll(`:scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)`)??[]),r=n.indexOf(e.target);if(r<0||n.length===0)return;let i=getComputedStyle(v.current).direction===`rtl`,a=(r+(t===`ArrowUp`||t===`ArrowLeft`&&!i||t===`ArrowRight`&&i?-1:1)+n.length)%n.length;n.forEach(e=>e.tabIndex=e===n[a]?0:-1),n[a]?.focus(),e.preventDefault()};return(0,x.jsx)(_.Provider,{value:n,children:(0,x.jsx)(S.Provider,{value:{variant:t,size:n,rounding:r,selection:w,selected:E,activate:D},children:(0,x.jsx)(`div`,{ref:v,role:`group`,className:f([u,`m3-button-group`,`m3-button-group_${t}`,`m3-button-group_${n}`,`m3-button-group_${r}`]),...h,onFocusCapture:e=>{p(e);let t=e.target;t instanceof HTMLButtonElement&&t.matches(`.m3-button-group__item:not(:disabled)`)&&v.current?.querySelectorAll(`.m3-button-group__item:not(:disabled)`).forEach(e=>e.tabIndex=e===t?0:-1)},onKeyDown:e=>{m(e),e.defaultPrevented||O(e)},children:d})})})}),w=o(function({ref:e,value:t,appearance:n=`tonal`,kind:r=`button`,size:i,width:a=`medium`,disabled:o=!1,type:s=`button`,className:c=``,children:l,onClick:u=()=>{},...p},{expose:m}){let h=(0,b.useContext)(S);if(!h)throw Error(`M3ButtonGroupItem must be inside M3ButtonGroup`);if(h.variant===`connected`&&i&&i!==h.size)throw Error(`Connected M3ButtonGroup items must use the group size`);let g=(0,b.useRef)(null);m({get el(){return g.current?.el??null},click:()=>g.current?.click(),focus:()=>g.current?.focus(),blur:()=>g.current?.blur()});let _=h.selected(t),y=h.selection!==`none`,C=d(l),w=C.length===1&&C[0][1],T=f([c,`m3-button-group__item`,{"m3-button-group__item_icon-only":w,"m3-button-group__item_selected":_}]),E={...p,ref:g,type:s,disabled:o,size:i,rounding:h.rounding,toggleable:y,selected:_,className:T,onClick:e=>{u(e),!e.defaultPrevented&&!o&&h.activate(t)}};return(0,x.jsx)(`span`,{className:f([`m3-button-group__wrapper`,{"m3-button-group__wrapper_icon-only":w,[`m3-button-group__wrapper_${i}`]:i&&i!==h.size}]),onClick:e=>{e.target===e.currentTarget&&!o&&g.current?.click()},children:r===`icon`?(0,x.jsx)(v,{appearance:n,...E,width:a,children:l}):(0,x.jsx)(v,{appearance:n,...E,children:l})})}),C.__docgenInfo={description:``,methods:[],displayName:`M3ButtonGroup`,props:{ref:{required:!1,tsType:{name:`Ref`,elements:[{name:`M3ButtonGroupExposed`}],raw:`Ref<M3ButtonGroupExposed>`},description:``},variant:{required:!1,tsType:{name:`Variant`},description:``,defaultValue:{value:`'standard'`,computed:!1}},size:{required:!1,tsType:{name:`Size`},description:``,defaultValue:{value:`'sm'`,computed:!1}},rounding:{required:!1,tsType:{name:`Rounding`},description:``,defaultValue:{value:`'round'`,computed:!1}},selection:{required:!1,tsType:{name:`Selection`},description:``},required:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},value:{required:!1,tsType:{name:`Value`},description:``},defaultValue:{required:!1,tsType:{name:`Value`},description:``,defaultValue:{value:`null`,computed:!1}},onChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: Value) => void`,signature:{arguments:[{type:{name:`Value`},name:`value`}],return:{name:`void`}}},description:``,defaultValue:{value:`() => {}`,computed:!1}},className:{defaultValue:{value:`''`,computed:!1},required:!1},onFocusCapture:{defaultValue:{value:`() => {}`,computed:!1},required:!1},onKeyDown:{defaultValue:{value:`() => {}`,computed:!1},required:!1}},composes:[`Omit`]},w.__docgenInfo={description:``,methods:[],displayName:`M3ButtonGroupItem`,props:{ref:{required:!1,tsType:{name:`Ref`,elements:[{name:`M3ButtonGroupItemExposed`}],raw:`Ref<M3ButtonGroupItemExposed>`},description:``},value:{required:!0,tsType:{name:`string`},description:``},appearance:{required:!1,tsType:{name:`Appearance`},description:``,defaultValue:{value:`'tonal'`,computed:!1}},kind:{required:!1,tsType:{name:`Kind`},description:``,defaultValue:{value:`'button'`,computed:!1}},size:{required:!1,tsType:{name:`Size`},description:``},width:{required:!1,tsType:{name:`Exclude`,elements:[{name:`Width`},{name:`literal`,value:`'auto'`}],raw:`Exclude<Width, 'auto'>`},description:``,defaultValue:{value:`'medium'`,computed:!1}},disabled:{defaultValue:{value:`false`,computed:!1},required:!1},type:{defaultValue:{value:`'button'`,computed:!1},required:!1},className:{defaultValue:{value:`''`,computed:!1},required:!1},onClick:{defaultValue:{value:`() => {}`,computed:!1},required:!1}},composes:[`Omit`]}})))()}function E(){return(E=e((()=>{T()})))()}var D=t({ConnectedActions:()=>P,ConnectedLarge:()=>I,ConnectedMultiple:()=>N,ConnectedSingle:()=>M,ConnectedSquare:()=>F,ExtraSmallActions:()=>R,ExtraSmallToggle:()=>H,IconKinds:()=>z,MixedSizes:()=>B,StandardActions:()=>L,StandardToggle:()=>V,__namedExportsOrder:()=>U,default:()=>j}),O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{E(),h(),i(),O=a(),k={"en-US":{additionalActions:`More actions`,calendarView:`Calendar view`,copy:`Copy`,day:`Day`,documentActions:`Document actions`,download:`Download`,editingActions:`Editing actions`,iconButton:`Wide icon button`,month:`Month`,moreActions:`More actions`,next:`Next`,ordinaryButton:`Ordinary icon-only button`,play:`Play`,playback:`Playback`,previous:`Previous`,save:`Save`,share:`Share`,week:`Week`},"ru-RU":{additionalActions:`Дополнительные действия`,calendarView:`Вид календаря`,copy:`Копировать`,day:`День`,documentActions:`Действия с документом`,download:`Скачать`,editingActions:`Действия редактирования`,iconButton:`Широкая кнопка с иконкой`,month:`Месяц`,moreActions:`Другие действия`,next:`Вперёд`,ordinaryButton:`Обычная кнопка с иконкой`,play:`Играть`,playback:`Воспроизведение`,previous:`Назад`,save:`Сохранить`,share:`Поделиться`,week:`Неделя`}},A={background:`var(--m3-sys-surface-container-low)`,borderRadius:`24px`},j={title:`Components/M3ButtonGroup`,component:C,argTypes:{variant:{control:`select`,options:[`standard`,`connected`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},rounding:{control:`select`,options:[`round`,`square`]},selection:{control:`select`,options:[`none`,`single`,`multiple`]}},args:{variant:`connected`,size:`sm`,rounding:`round`,selection:`single`,defaultValue:`day`},render:(e,{globals:t})=>{let n=r(t.locale,k);return(0,O.jsx)(`div`,{className:`p-6`,style:{...A,width:`min(560px, 90vw)`},children:(0,O.jsxs)(C,{"aria-label":n.calendarView,...e,children:[(0,O.jsxs)(w,{value:`day`,children:[(0,O.jsx)(m,{name:`calendar_today`}),n.day]}),(0,O.jsxs)(w,{value:`week`,children:[(0,O.jsx)(m,{name:`date_range`}),n.week]}),(0,O.jsxs)(w,{value:`month`,children:[(0,O.jsx)(m,{name:`calendar_month`}),n.month]})]})})},parameters:{layout:`centered`}},M={},N={args:{selection:`multiple`,defaultValue:[`day`,`week`]}},P={render:(e,{globals:t})=>{let n=r(t.locale,k);return(0,O.jsx)(`div`,{className:`p-6`,style:{...A,width:`min(560px, 90vw)`},children:(0,O.jsxs)(C,{variant:`connected`,selection:`none`,"aria-label":n.documentActions,children:[(0,O.jsxs)(w,{value:`copy`,children:[(0,O.jsx)(m,{name:`content_copy`}),n.copy]}),(0,O.jsxs)(w,{value:`download`,children:[(0,O.jsx)(m,{name:`download`}),n.download]}),(0,O.jsxs)(w,{value:`share`,children:[(0,O.jsx)(m,{name:`share`}),n.share]})]})})}},F={args:{rounding:`square`}},I={args:{size:`lg`}},L={render:(e,{globals:t})=>{let n=r(t.locale,k);return(0,O.jsx)(`div`,{className:`p-6`,style:A,children:(0,O.jsxs)(C,{variant:`standard`,size:e.size,rounding:e.rounding,"aria-label":n.editingActions,children:[(0,O.jsxs)(w,{value:`save`,appearance:`filled`,children:[(0,O.jsx)(m,{name:`save`}),n.save]}),(0,O.jsxs)(w,{value:`share`,appearance:`tonal`,children:[(0,O.jsx)(m,{name:`share`}),n.share]}),(0,O.jsx)(w,{value:`more`,kind:`icon`,appearance:`outlined`,"aria-label":n.moreActions,children:(0,O.jsx)(m,{name:`more_vert`})})]})})}},R={...L,args:{size:`xs`}},z={render:(e,{globals:t})=>{let n=r(t.locale,k);return(0,O.jsxs)(C,{variant:`standard`,"aria-label":n.additionalActions,children:[(0,O.jsx)(w,{value:`ordinary`,"aria-label":n.ordinaryButton,children:(0,O.jsx)(m,{name:`more_vert`})}),(0,O.jsx)(w,{value:`icon`,kind:`icon`,width:`wide`,"aria-label":n.iconButton,children:(0,O.jsx)(m,{name:`more_vert`})})]})}},B={render:(e,{globals:t})=>{let n=r(t.locale,k);return(0,O.jsxs)(C,{variant:`standard`,size:`sm`,"aria-label":n.playback,children:[(0,O.jsx)(w,{value:`previous`,kind:`icon`,appearance:`tonal`,"aria-label":n.previous,children:(0,O.jsx)(m,{name:`skip_previous`})}),(0,O.jsxs)(w,{value:`play`,size:`md`,appearance:`filled`,children:[(0,O.jsx)(m,{name:`play_arrow`}),n.play]}),(0,O.jsx)(w,{value:`next`,kind:`icon`,appearance:`tonal`,"aria-label":n.next,children:(0,O.jsx)(m,{name:`skip_next`})})]})}},V={args:{variant:`standard`,selection:`multiple`,defaultValue:[`day`]}},H={args:{variant:`standard`,size:`xs`,selection:`multiple`,defaultValue:[`day`]}},U=[`ConnectedSingle`,`ConnectedMultiple`,`ConnectedActions`,`ConnectedSquare`,`ConnectedLarge`,`StandardActions`,`ExtraSmallActions`,`IconKinds`,`MixedSizes`,`StandardToggle`,`ExtraSmallToggle`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    selection: 'multiple',
    defaultValue: ['day', 'week']
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <div className="p-6" style={{
      ...surfaceStyle,
      width: 'min(560px, 90vw)'
    }}>
        <M3ButtonGroup variant="connected" selection="none" aria-label={text.documentActions}>
          <M3ButtonGroupItem value="copy">
            <M3Icon name="content_copy" />{text.copy}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="download">
            <M3Icon name="download" />{text.download}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="share">
            <M3Icon name="share" />{text.share}
          </M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>;
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    rounding: 'square'
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: (args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <div className="p-6" style={surfaceStyle}>
        <M3ButtonGroup variant="standard" size={args.size} rounding={args.rounding} aria-label={text.editingActions}>
          <M3ButtonGroupItem value="save" appearance="filled">
            <M3Icon name="save" />{text.save}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="share" appearance="tonal">
            <M3Icon name="share" />{text.share}
          </M3ButtonGroupItem>
          <M3ButtonGroupItem value="more" kind="icon" appearance="outlined" aria-label={text.moreActions}>
            <M3Icon name="more_vert" />
          </M3ButtonGroupItem>
        </M3ButtonGroup>
      </div>;
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  ...StandardActions,
  args: {
    size: 'xs'
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3ButtonGroup variant="standard" aria-label={text.additionalActions}>
        <M3ButtonGroupItem value="ordinary" aria-label={text.ordinaryButton}>
          <M3Icon name="more_vert" />
        </M3ButtonGroupItem>
        <M3ButtonGroupItem value="icon" kind="icon" width="wide" aria-label={text.iconButton}>
          <M3Icon name="more_vert" />
        </M3ButtonGroupItem>
      </M3ButtonGroup>;
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => {
    const text = localize(globals.locale, messages);
    return <M3ButtonGroup variant="standard" size="sm" aria-label={text.playback}>
        <M3ButtonGroupItem value="previous" kind="icon" appearance="tonal" aria-label={text.previous}>
          <M3Icon name="skip_previous" />
        </M3ButtonGroupItem>
        <M3ButtonGroupItem value="play" size="md" appearance="filled">
          <M3Icon name="play_arrow" />{text.play}
        </M3ButtonGroupItem>
        <M3ButtonGroupItem value="next" kind="icon" appearance="tonal" aria-label={text.next}>
          <M3Icon name="skip_next" />
        </M3ButtonGroupItem>
      </M3ButtonGroup>;
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'standard',
    selection: 'multiple',
    defaultValue: ['day']
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'standard',
    size: 'xs',
    selection: 'multiple',
    defaultValue: ['day']
  }
}`,...H.parameters?.docs?.source}}}})))()}export{F as a,B as c,M as i,L as l,I as n,z as o,N as r,D as s,P as t,W as u};