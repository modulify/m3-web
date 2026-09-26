import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,N as ee,P as r,Q as i,S as a,T as o,W as s,Y as c,_ as l,et as u,g as d,h as f,m as p,n as m,nt as h,v as g,x as _}from"./iframe-DqoEP6-3.js";import{n as v,t as y}from"./button-C5ZOfJIb.js";import{i as b,t as x}from"./icon-BzqhEXMj.js";import{n as te,t as S}from"./icon-button-DfGrghLx.js";import{i as C,t as w}from"./surface-JSn1WMio.js";import{i as ne,n as T,t as E}from"./list-kKpzxVE6.js";import{i as D,n as O,t as k}from"./menu-CUTCviYd.js";var A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{m(),y(),x(),S(),E(),k(),w(),A={class:`m3-local-theme m3-local-theme_showcase m3-local-theme-showcase`},j={class:`sb-container-fluid px-6 py-6`},M={key:0,class:`m3-local-theme-showcase__comparison`},N={class:`m3-local-theme-showcase__sample`},P={class:`m3-local-theme-showcase__title`},F={class:`m3-local-theme-showcase__actions`},I={class:`m3-local-theme-showcase__eyebrow`},L={class:`m3-local-theme-showcase__title`},R={class:`m3-local-theme-showcase__copy`},z={class:`m3-local-theme-showcase__actions`},B={key:0,class:`m3-local-theme m3-local-theme_reset`},V={class:`m3-local-theme-showcase__menu-anchor`},H=n({name:`LocalThemeShowcase`,__name:`LocalThemeShowcase`,props:{variant:{}},setup(e){let t=e,m=n({name:`ColorStrip`,setup:()=>()=>o(`div`,{"aria-label":`Token sample`,class:`m3-local-theme-showcase__palette`},[o(`span`,{class:`m3-local-theme-showcase__palette-item`},[o(`span`,{class:`m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_surface`}),o(`span`,`Surface`)]),o(`span`,{class:`m3-local-theme-showcase__palette-item`},[o(`span`,{class:`m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_container`}),o(`span`,`Container high`)]),o(`span`,{class:`m3-local-theme-showcase__palette-item`},[o(`span`,{class:`m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_primary`}),o(`span`,`Primary`)]),o(`span`,{class:`m3-local-theme-showcase__palette-item`},[o(`span`,{class:`m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_on-primary`}),o(`span`,`On primary`)])])}),y={danger:{eyebrow:`Danger scope`,title:`Release deletion requested`,copy:`The destructive notification keeps the same component API while primary actions, surfaces, and state layers shift into a local danger palette.`,scopeClassName:`m3-local-theme m3-local-theme_danger`,primaryAction:`Delete release`,secondaryAction:`Review logs`,resetAction:`Cancel`},"warm-alert":{eyebrow:`Warm alert scope`,title:`Invoice retry scheduled`,copy:`The warning notification uses warmer container tones for urgency without making every control destructive.`,scopeClassName:`m3-local-theme m3-local-theme_warm-alert`,primaryAction:`Resolve hold`,secondaryAction:`View invoices`},success:{eyebrow:`Success scope`,title:`Release published`,copy:`The success scope moves the module into a green accent while preserving the same hierarchy and component behavior.`,scopeClassName:`m3-local-theme m3-local-theme_success`,primaryAction:`Share update`,secondaryAction:`Review rollout`},"brand-muted":{eyebrow:`Brand-muted scope`,title:`Guidelines updated`,copy:`The muted brand scope keeps a product accent but lowers the visual pressure for editorial or secondary guidance.`,scopeClassName:`m3-local-theme m3-local-theme_brand-muted`,primaryAction:`Open guidelines`,secondaryAction:`Download assets`}},x=c(null),S=c(null),w=c(!1),E=()=>x.value,k=p(()=>t.variant===`list-menu`?null:y[t.variant]);return ee(()=>{w.value=!0}),(e,t)=>(r(),g(`div`,A,[f(`div`,j,[t[6]||=f(`div`,{class:`m3-local-theme-showcase__intro mb-6`},[f(`div`,{class:`m3-local-theme-showcase__eyebrow`},` Guide `),f(`h1`,{class:`m3-local-theme-showcase__headline`},` Theming with local token scopes `),f(`p`,{class:`m3-local-theme-showcase__copy`},` This guide intentionally uses an azure-blue baseline theme instead of the standard Material default, so local token changes are easier to compare. `)],-1),k.value?(r(),g(`div`,M,[f(`div`,N,[a(i(m)),a(i(C),{"fill-height":!1,rounding:12,elevation:1,class:`m3-local-theme-showcase__notification`,variant:`surface-container-high`},{default:s(()=>[t[0]||=f(`div`,{class:`m3-local-theme-showcase__eyebrow`},` Azure-blue baseline `,-1),f(`h3`,P,h(k.value.title),1),t[1]||=f(`p`,{class:`m3-local-theme-showcase__copy`},` This notification inherits the guide baseline theme. It is intentionally azure blue, not the standard Material purple default. `,-1),f(`div`,F,[k.value.secondaryAction?(r(),d(i(v),{key:0,appearance:`tonal`},{default:s(()=>[_(h(k.value.secondaryAction),1)]),_:1})):l(``,!0),a(i(v),{appearance:`filled`},{default:s(()=>[_(h(k.value.primaryAction),1)]),_:1})])]),_:1})]),f(`div`,{class:u([`m3-local-theme-showcase__sample`,k.value.scopeClassName])},[a(i(m)),a(i(C),{"fill-height":!1,rounding:12,elevation:1,class:`m3-local-theme-showcase__notification`,variant:`surface-container-high`},{default:s(()=>[f(`div`,I,h(k.value.eyebrow),1),f(`h3`,L,h(k.value.title),1),f(`p`,R,h(k.value.copy),1),f(`div`,z,[k.value.resetAction?(r(),g(`span`,B,[a(i(v),{appearance:`text`},{default:s(()=>[_(h(k.value.resetAction),1)]),_:1})])):l(``,!0),k.value.secondaryAction?(r(),d(i(v),{key:1,appearance:`tonal`},{default:s(()=>[_(h(k.value.secondaryAction),1)]),_:1})):l(``,!0),a(i(v),{appearance:`filled`},{default:s(()=>[_(h(k.value.primaryAction),1)]),_:1})])]),_:1})],2)])):(r(),d(i(C),{key:1,"fill-height":!1,rounding:28,elevation:0,class:`m3-local-theme-showcase__cookbook`,variant:`surface-container-high`},{default:s(()=>[t[5]||=f(`div`,{class:`m3-local-theme-showcase__workspace-header`},[f(`div`,null,[f(`div`,{class:`m3-local-theme-showcase__eyebrow`},` Cookbook `),f(`h3`,{class:`m3-local-theme-showcase__title`},` List with a destructive menu action `),f(`p`,{class:`m3-local-theme-showcase__copy`},` The list inherits the azure-blue guide theme. The release checklist item owns an icon action with a popper menu, and only the delete menu item enters the local danger scope. `)])],-1),f(`div`,{ref_key:`menuContainer`,ref:S,class:`m3-local-theme-showcase__list-area`},[a(i(ne),{class:`m3-local-theme-showcase__list`,divided:``},{default:s(()=>[a(i(T),{lines:`2`,headline:`Billing hold`,"supporting-text":`Payment retry is waiting for a finance owner.`}),a(i(T),{lines:`2`,headline:`Release checklist`,"supporting-text":`Three items need review before publication.`},{trailing:s(()=>[f(`span`,V,[f(`span`,{ref_key:`menuTarget`,ref:x},[a(i(te),{"aria-label":`Actions`},{default:s(()=>[a(i(b),{name:`more_vert`})]),_:1})],512),w.value?(r(),d(i(D),{key:0,target:E,container:S.value??void 0,"offset-main-axis":8,placement:`bottom-end`,strategy:`absolute`,class:`m3-local-theme m3-local-theme_showcase m3-local-theme-showcase__menu`,shown:``},{default:s(()=>[a(i(O),null,{leading:s(()=>[a(i(b),{name:`edit`})]),default:s(()=>[t[2]||=_(` Rename list `,-1)]),_:1}),a(i(O),null,{leading:s(()=>[a(i(b),{name:`archive`})]),default:s(()=>[t[3]||=_(` Archive `,-1)]),_:1}),a(i(O),{class:`m3-local-theme m3-local-theme_danger`},{leading:s(()=>[a(i(b),{name:`delete`})]),default:s(()=>[t[4]||=_(` Delete list `,-1)]),_:1})]),_:1},8,[`container`])):l(``,!0)])]),_:1}),a(i(T),{lines:`2`,headline:`Access review`,"supporting-text":`Two external collaborators still have access.`})]),_:1})],512)]),_:1}))])]))}})})))()}var W;function G(){return(G=e((()=>{U(),W=H,H.__docgenInfo=Object.assign({displayName:H.name??H.__name},{name:`LocalThemeShowcase`,exportName:`default`,displayName:`LocalThemeShowcase`,description:``,tags:{},props:[{name:`variant`,required:!0,type:{name:`LocalThemeVariant`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/local-theme/LocalThemeShowcase.vue`]})})))()}var re=t({BrandMutedNotification:()=>X,DangerNotification:()=>q,ListWithDangerMenu:()=>Z,SuccessNotification:()=>Y,WarmAlertNotification:()=>J,__namedExportsOrder:()=>Q,default:()=>K}),K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{G(),K={title:`Guides/Theming`,parameters:{layout:`fullscreen`}},q={render:()=>({components:{LocalThemeShowcase:W},template:`
        <LocalThemeShowcase variant="danger" />
    `})},J={render:()=>({components:{LocalThemeShowcase:W},template:`
        <LocalThemeShowcase variant="warm-alert" />
    `})},Y={render:()=>({components:{LocalThemeShowcase:W},template:`
        <LocalThemeShowcase variant="success" />
    `})},X={render:()=>({components:{LocalThemeShowcase:W},template:`
        <LocalThemeShowcase variant="brand-muted" />
    `})},Z={render:()=>({components:{LocalThemeShowcase:W},template:`
        <LocalThemeShowcase variant="list-menu" />
    `})},Q=[`DangerNotification`,`WarmAlertNotification`,`SuccessNotification`,`BrandMutedNotification`,`ListWithDangerMenu`],q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      LocalThemeShowcase
    },
    template: \`
        <LocalThemeShowcase variant="danger" />
    \`
  })
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      LocalThemeShowcase
    },
    template: \`
        <LocalThemeShowcase variant="warm-alert" />
    \`
  })
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      LocalThemeShowcase
    },
    template: \`
        <LocalThemeShowcase variant="success" />
    \`
  })
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      LocalThemeShowcase
    },
    template: \`
        <LocalThemeShowcase variant="brand-muted" />
    \`
  })
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      LocalThemeShowcase
    },
    template: \`
        <LocalThemeShowcase variant="list-menu" />
    \`
  })
}`,...Z.parameters?.docs?.source}}}})))()}export{Y as a,re as i,q as n,J as o,Z as r,$ as s,X as t};