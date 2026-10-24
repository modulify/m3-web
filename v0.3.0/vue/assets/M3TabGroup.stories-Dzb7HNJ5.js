import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{B as n,L as r,O as i,P as a,X as o,a as s,i as c,j as l,nt as u,s as d,z as f}from"./iframe-DlP_3VDG.js";import{n as p,t as m}from"./id-DkFC80RS.js";import{n as h,t as g}from"./ripple-CmuynTA7.js";import{n as _,t as v}from"./runtime-BrGqCp3U.js";import{n as y,t as ee}from"./icon-BHYZNUrK.js";import{n as b,t as x}from"./badge-Dod6rS2X.js";var S;function C(){return(C=e((()=>{d(),S=i({name:`M3Tab`,props:{value:{type:String,required:!0},label:{type:String,default:``},badge:{type:[String,Number],default:void 0},disabled:{type:Boolean,default:!1}},slots:Object,setup:()=>()=>null})})))()}var w;function T(){return(T=e((()=>{_(),C(),w=e=>v(e).filter(e=>e.type===S).map(e=>{let t=e.props??{};return{value:String(t.value),label:String(t.label??``),slots:e.children??{},disabled:t.disabled===!0||t.disabled===``,badge:t.badge,accessibleLabel:t[`aria-label`]}})})))()}var E;function D(){return(D=e((()=>{d(),x(),g(),E=i({props:{id:{type:String,required:!0},panelId:{type:String,required:!0},tab:{type:Object,required:!0},active:{type:Boolean,required:!0},focused:{type:Boolean,required:!0},onActivate:{type:Function,required:!0},onFocus:{type:Function,required:!0}},setup(e){let t=u(null);return()=>{let n=!!e.tab.slots.icon&&!e.tab.label&&!e.tab.slots.label;return l(`button`,{id:e.id,ref:t,type:`button`,role:`tab`,"aria-controls":e.panelId,"aria-selected":e.active,"aria-label":e.tab.accessibleLabel,disabled:e.tab.disabled,tabindex:e.focused?0:-1,class:[`m3-tab-group__tab`,{"m3-tab-group__tab_icon-only":n}],onClick:e.onActivate,onFocus:e.onFocus},[e.tab.slots.icon&&l(`span`,{class:`m3-tab-group__icon`,"aria-hidden":`true`},[e.tab.slots.icon(),(e.tab.slots.badge||e.tab.badge!==void 0)&&l(b,{class:`m3-tab-group__badge`},{default:()=>e.tab.slots.badge?.()??String(e.tab.badge)})]),!n&&l(`span`,{class:`m3-tab-group__label-row`},[l(`span`,{class:`m3-tab-group__label`},e.tab.slots.label?.()??e.tab.label),!e.tab.slots.icon&&(e.tab.slots.badge||e.tab.badge!==void 0)&&l(b,{class:`m3-tab-group__badge`,"aria-hidden":`true`},{default:()=>e.tab.slots.badge?.()??String(e.tab.badge)})]),l(h,{owner:t})])}}})})))()}var O,k,A;function j(){return(j=e((()=>{d(),D(),O=(e,t)=>{let n=t.target;if(n.getAttribute(`role`)!==`tab`)return;let r=Array.from(e.value?.querySelectorAll(`[role="tab"]:not(:disabled)`)??[]),i=r.indexOf(n);if(i<0)return;let a=getComputedStyle(e.value).direction===`rtl`,o=t.key===`ArrowRight`?a?-1:1:t.key===`ArrowLeft`?a?1:-1:0,s=t.key===`Home`?r[0]:t.key===`End`?r.at(-1):o?r[(i+o+r.length)%r.length]:null;s&&(t.preventDefault(),s.focus(),s.scrollIntoView?.({block:`nearest`,inline:`nearest`}))},k=(e,t,n,r)=>l(`div`,{class:`m3-tab-group__scroll`},[l(`div`,{ref:e.track,class:`m3-tab-group__track`,role:`tablist`,"aria-label":e.attrs[`aria-label`],"aria-labelledby":e.attrs[`aria-labelledby`],style:{"--m3-tab-group-indicator-offset":`${e.indicator.value.offset}px`,"--m3-tab-group-indicator-width":`${e.indicator.value.width}px`}},[...t.map(t=>l(E,{key:t.value,id:`${e.id}-tab-${t.value}`,panelId:`${e.id}-panel-${t.value}`,tab:t,active:t===n,focused:t.value===r,onActivate:()=>e.activate(t.value),onFocus:()=>e.focusedValue.value=t.value})),l(`span`,{class:`m3-tab-group__indicator`,"aria-hidden":`true`})])]),A=e=>{let t=e.tabs,n=t.filter(e=>!e.disabled),r=e.selected,i=t.find(e=>e.value===r&&!e.disabled),o=n.some(t=>t.value===e.focusedValue.value)?e.focusedValue.value:n.find(e=>e.value===r)?.value??n[0]?.value;return l(`div`,a(e.attrs,{id:e.id,ref:e.root,class:[`m3-tab-group`,`m3-tab-group_${e.variant}`,`m3-tab-group_${e.layout}`,{"m3-tab-group_with-icons":t.some(e=>e.slots.icon)}],onKeydown:t=>{t.defaultPrevented||O(e.track,t)}}),[k(e,t,i,o),...t.map(t=>l(`div`,{key:t.value,id:`${e.id}-panel-${t.value}`,role:`tabpanel`,"aria-labelledby":`${e.id}-tab-${t.value}`,tabindex:t===i?0:-1,hidden:t!==i,class:`m3-tab-group__panel`},t===i?t.slots.default?.():void 0))])}})))()}var M;function N(){return(N=e((()=>{d(),M=(e,t)=>{let i=u({offset:0,width:0}),a,o,s=()=>{let n=e.value?.querySelector(`[role="tab"][aria-selected="true"]`),r=t()===`primary`?n?.querySelector(`.m3-tab-group__label-row, .m3-tab-group__icon`):null,s=n?r?{offset:n.offsetLeft+r.offsetLeft+Math.min(2,(r.offsetWidth-24)/2),width:Math.max(24,r.offsetWidth-4)}:{offset:n.offsetLeft,width:n.offsetWidth}:{offset:0,width:0};(i.value.offset!==s.offset||i.value.width!==s.width)&&(i.value=s),n?.id!==o&&(o=n?.id,n?.scrollIntoView?.({block:`nearest`,inline:`nearest`})),e.value?.querySelectorAll(`[role="tab"]`).forEach(e=>a?.observe(e))};return f(()=>{typeof ResizeObserver<`u`&&e.value&&(a=new ResizeObserver(s),a.observe(e.value),s())}),n(s),r(()=>a?.disconnect()),i}})))()}var P,F;function I(){return(I=e((()=>{P=(e,t,n=`tab`)=>{if(t===`query`)return e.searchParams.get(n);let r=e.hash.slice(1);if(!r)return null;try{return decodeURIComponent(r)}catch{return null}},F=(e,t,n,r=`tab`)=>{let i=new URL(e);return t===`hash`?i.hash=encodeURIComponent(n):i.searchParams.set(r,n),i}})))()}var L,R;function z(){return(z=e((()=>{d(),I(),L=({options:e,getAvailable:t,selected:i,internalValue:a,emit:s})=>{let c=t=>{if(!e.navigation||typeof window>`u`)return;let n=new URL(window.location.href),r=F(n,e.navigation,t,e.queryKey);r.href!==n.href&&window.history.pushState(window.history.state,``,r)},l=n=>{if(!e.navigation||typeof window>`u`)return;let r=t(),o=P(new URL(window.location.href),e.navigation,e.queryKey),c=r.includes(e.value??``)?e.value:r[0],l=o!==null&&r.includes(o)?o:c;l!==i()&&(a.value=l,n&&l&&(s(`update:value`,l),s(`change`,l)))},u=()=>l(!0);return f(()=>{l(!1),window.addEventListener(`popstate`,u),window.addEventListener(`hashchange`,u)}),n(()=>l(!1)),r(()=>{window.removeEventListener(`popstate`,u),window.removeEventListener(`hashchange`,u)}),o(()=>e.value,(e,n)=>{e!==void 0&&e!==n&&t().includes(e)&&(a.value=e,c(e))}),o(()=>[e.navigation,e.queryKey],()=>l(!1),{flush:`post`}),c},R=(e,t,n)=>{let r=u(e.value),i=()=>{let e=t();return e.includes(r.value??``)?r.value:e[0]},a=L({options:e,getAvailable:t,selected:i,internalValue:r,emit:n});return{selected:i,activate:e=>{e!==i()&&t().includes(e)&&(r.value=e,a(e),n(`update:value`,e),n(`change`,e))}}}})))()}var B;function V(){return(V=e((()=>{d(),m(),T(),j(),N(),z(),B=i({name:`M3TabGroup`,inheritAttrs:!1,props:{variant:{type:String,default:`primary`},layout:{type:String,default:`fixed`},value:{type:String,default:void 0},navigation:{type:String,default:void 0},queryKey:{type:String,default:`tab`}},emits:{"update:value":e=>!0,change:e=>!0},setup(e,{attrs:t,slots:n,emit:r,expose:i}){let a=p(`m3-tab-group`,()=>t.id),o=u(null),s=u(null),c=[],{selected:l,activate:d}=R(e,()=>c.filter(e=>!e.disabled).map(e=>e.value),(e,t)=>{r(e===`change`?`change`:`update:value`,t)}),f=u(),m=M(s,()=>e.variant);return i({get el(){return o.value}}),()=>(c=w(n.default?.()??[]),A({id:a.value,tabs:c,selected:l(),activate:d,variant:e.variant,layout:e.layout,focusedValue:f,indicator:m,root:o,track:s,attrs:t}))}})})))()}function H(){return(H=e((()=>{C(),V()})))()}var U=t({IconOnly:()=>X,IconsAndBadges:()=>Y,PrimaryFixed:()=>K,Scrollable:()=>J,SecondaryFixed:()=>q,UrlNavigation:()=>Z,__namedExportsOrder:()=>Q,default:()=>G}),W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{ee(),H(),c(),W={"en-US":{all:`All`,archived:`Archived`,drafts:`Drafts`,inbox:`Inbox`,inboxCount:`Inbox, 24 unread messages`,labels:`Mail folders`,photos:`Photos`,recent:`Recent`,shared:`Shared`,starred:`Starred`,trash:`Trash`},"ru-RU":{all:`Все`,archived:`Архив`,drafts:`Черновики`,inbox:`Входящие`,inboxCount:`Входящие, 24 непрочитанных сообщения`,labels:`Папки почты`,photos:`Фотографии`,recent:`Недавние`,shared:`Общие`,starred:`Избранные`,trash:`Корзина`}},G={title:`Components/M3TabGroup`,component:B,argTypes:{variant:{control:`select`,options:[`primary`,`secondary`]},layout:{control:`select`,options:[`fixed`,`scrollable`]}},args:{variant:`primary`,layout:`fixed`},render:(e,{globals:t})=>({components:{M3Icon:y,M3Tab:S,M3TabGroup:B},setup:()=>({args:e,text:s(t.locale,W)}),template:`
        <div style="width: min(640px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :label="text.inbox">{{ text.inbox }}</M3Tab>
                <M3Tab value="drafts" :label="text.drafts">{{ text.drafts }}</M3Tab>
                <M3Tab value="starred" :label="text.starred">{{ text.starred }}</M3Tab>
            </M3TabGroup>
        </div>
    `}),parameters:{layout:`centered`}},K={},q={args:{variant:`secondary`}},J={args:{layout:`scrollable`},render:(e,{globals:t})=>({components:{M3Tab:S,M3TabGroup:B},setup:()=>({args:e,text:s(t.locale,W)}),template:`
        <div style="width: min(360px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="all" :label="text.all">{{ text.all }}</M3Tab>
                <M3Tab value="recent" :label="text.recent">{{ text.recent }}</M3Tab>
                <M3Tab value="shared" :label="text.shared">{{ text.shared }}</M3Tab>
                <M3Tab value="archived" :label="text.archived">{{ text.archived }}</M3Tab>
                <M3Tab value="trash" :label="text.trash">{{ text.trash }}</M3Tab>
            </M3TabGroup>
        </div>
    `})},Y={render:(e,{globals:t})=>({components:{M3Icon:y,M3Tab:S,M3TabGroup:B},setup:()=>({args:e,text:s(t.locale,W)}),template:`
        <div style="width: min(640px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :label="text.inbox" :aria-label="text.inboxCount" badge="24">
                    <template #icon><M3Icon name="inbox" /></template>
                    {{ text.inbox }}
                </M3Tab>
                <M3Tab value="drafts" :label="text.drafts">
                    <template #icon><M3Icon name="drafts" /></template>
                    {{ text.drafts }}
                </M3Tab>
                <M3Tab value="photos" :label="text.photos">
                    <template #icon><M3Icon name="image" /></template>
                    {{ text.photos }}
                </M3Tab>
            </M3TabGroup>
        </div>
    `})},X={render:(e,{globals:t})=>({components:{M3Icon:y,M3Tab:S,M3TabGroup:B},setup:()=>({args:e,text:s(t.locale,W)}),template:`
        <div style="width: min(400px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :aria-label="text.inbox">
                    <template #icon><M3Icon name="inbox" /></template>
                    {{ text.inbox }}
                </M3Tab>
                <M3Tab value="drafts" :aria-label="text.drafts">
                    <template #icon><M3Icon name="drafts" /></template>
                    {{ text.drafts }}
                </M3Tab>
                <M3Tab value="photos" :aria-label="text.photos">
                    <template #icon><M3Icon name="image" /></template>
                    {{ text.photos }}
                </M3Tab>
            </M3TabGroup>
        </div>
    `})},Z={args:{navigation:`query`,queryKey:`section`}},Q=[`PrimaryFixed`,`SecondaryFixed`,`Scrollable`,`IconsAndBadges`,`IconOnly`,`UrlNavigation`],K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary'
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'scrollable'
  },
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Tab,
      M3TabGroup
    },
    setup: () => ({
      args,
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="width: min(360px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="all" :label="text.all">{{ text.all }}</M3Tab>
                <M3Tab value="recent" :label="text.recent">{{ text.recent }}</M3Tab>
                <M3Tab value="shared" :label="text.shared">{{ text.shared }}</M3Tab>
                <M3Tab value="archived" :label="text.archived">{{ text.archived }}</M3Tab>
                <M3Tab value="trash" :label="text.trash">{{ text.trash }}</M3Tab>
            </M3TabGroup>
        </div>
    \`
  })
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3Tab,
      M3TabGroup
    },
    setup: () => ({
      args,
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="width: min(640px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :label="text.inbox" :aria-label="text.inboxCount" badge="24">
                    <template #icon><M3Icon name="inbox" /></template>
                    {{ text.inbox }}
                </M3Tab>
                <M3Tab value="drafts" :label="text.drafts">
                    <template #icon><M3Icon name="drafts" /></template>
                    {{ text.drafts }}
                </M3Tab>
                <M3Tab value="photos" :label="text.photos">
                    <template #icon><M3Icon name="image" /></template>
                    {{ text.photos }}
                </M3Tab>
            </M3TabGroup>
        </div>
    \`
  })
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: (args: unknown, {
    globals
  }) => ({
    components: {
      M3Icon,
      M3Tab,
      M3TabGroup
    },
    setup: () => ({
      args,
      text: localize(globals.locale, messages)
    }),
    template: \`
        <div style="width: min(400px, 90vw); background: var(--m3-sys-surface)">
            <M3TabGroup v-bind="args" :aria-label="text.labels">
                <M3Tab value="inbox" :aria-label="text.inbox">
                    <template #icon><M3Icon name="inbox" /></template>
                    {{ text.inbox }}
                </M3Tab>
                <M3Tab value="drafts" :aria-label="text.drafts">
                    <template #icon><M3Icon name="drafts" /></template>
                    {{ text.drafts }}
                </M3Tab>
                <M3Tab value="photos" :aria-label="text.photos">
                    <template #icon><M3Icon name="image" /></template>
                    {{ text.photos }}
                </M3Tab>
            </M3TabGroup>
        </div>
    \`
  })
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    navigation: 'query',
    queryKey: 'section'
  }
}`,...Z.parameters?.docs?.source}}}})))()}export{J as a,$ as c,K as i,Y as n,q as o,U as r,Z as s,X as t};