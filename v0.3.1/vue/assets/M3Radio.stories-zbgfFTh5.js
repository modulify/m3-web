import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,O as i,P as a,S as o,U as s,V as c,a as l,at as u,b as d,g as f,i as p,nt as m,s as h,ut as g,x as _,y as v}from"./iframe-o20GbCI8.js";import{n as y,t as b}from"./id-DfHbCVB7.js";import{n as x,t as S}from"./ripple-HxSsQpU2.js";var C,w;function T(){return(T=e((()=>{h(),S(),b(),C=[`id`,`name`,`aria-checked`,`aria-disabled`,`aria-invalid`,`checked`,`disabled`],w=i({__name:`M3Radio`,props:{id:{},name:{},model:{},value:{},invalid:{type:Boolean},disabled:{type:Boolean},equalsFn:{type:Function}},emits:[`change`,`update:model`],setup(e,{expose:t,emit:r}){let i=e,s=r,l=m(null),f=m(null),p=y(`m3-radio`,v(()=>i.id)),h=m(null),g=v(()=>i.value===void 0||i.value);t({get el(){return l.value},click:()=>h.value?.click(),focus:()=>h.value?.focus(),blur:()=>h.value?.blur()});let b=(e,t)=>i.equalsFn?.call(null,e,t)??e===t,S=v(()=>b(i.model,g.value)),w=e=>{!i.disabled&&e.target.checked&&(s(`change`,g.value),s(`update:model`,g.value))};return(t,r)=>(c(),n(`span`,a({ref_key:`root`,ref:l,class:{"m3-radio":!0,"m3-radio_checked":S.value,"m3-radio_invalid":e.invalid,"m3-radio_disabled":e.disabled}},t.$attrs),[d(`input`,{id:u(p),ref_key:`_input`,ref:h,name:e.name,"aria-checked":S.value?`true`:`false`,"aria-disabled":e.disabled?`true`:`false`,"aria-invalid":e.invalid?`true`:`false`,checked:S.value,disabled:e.disabled,type:`radio`,class:`m3-radio__input`,onChange:w},null,40,C),r[0]||=d(`span`,{"aria-hidden":`true`,class:`m3-radio__state`},null,-1),d(`span`,{ref_key:`rippleSurface`,ref:f,"aria-hidden":`true`,class:`m3-radio__ripple`},[e.disabled?o(``,!0):(c(),_(u(x),{key:0,owner:m(l.value),surface:f.value},null,8,[`owner`,`surface`]))],512),r[1]||=d(`span`,{"aria-hidden":`true`,class:`m3-radio__icon`},null,-1)],16))}})})))()}var E;function D(){return(D=e((()=>{T(),E=w,w.__docgenInfo=Object.assign({displayName:w.name??w.__name},{exportName:`default`,displayName:`M3Radio`,description:``,tags:{},props:[{name:`id`,required:!1,type:{name:`string`}},{name:`name`,required:!1,type:{name:`string`}},{name:`model`,required:!1,type:{name:`Value`}},{name:`value`,required:!1,type:{name:`Value`}},{name:`invalid`,required:!1,type:{name:`boolean`}},{name:`disabled`,required:!1,type:{name:`boolean`}},{name:`equalsFn`,required:!1,type:{name:`TSFunctionType`}}],events:[{name:`change`,type:{names:[`Value`]}},{name:`update:model`,type:{names:[`Value`]}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/radio/M3Radio.vue`]})})))()}function O(){return(O=e((()=>{D()})))()}var k,A;function j(){return(j=e((()=>{h(),O(),b(),k=[`for`],A=i({__name:`RadioGroup`,props:{legend:{default:`Selection`},options:{},invalid:{type:Boolean,default:!1}},setup(e){let t=e,i=y(`m3-radio-group`),a=m(t.options[0]?.value),o={margin:0,border:`none`,minWidth:`280px`},l={fontSize:`14px`,lineHeight:`20px`,color:`var(--m3-sys-on-surface-variant)`};return(t,p)=>(c(),n(`fieldset`,{style:o,class:`d-grid gap-3`},[d(`legend`,{style:l,class:`p-0 mb-2`},g(e.legend),1),(c(!0),n(f,null,s(e.options,t=>(c(),n(`label`,{key:t.value,for:u(i)+`-`+t.value,class:`flex-row gap-3`},[r(u(E),{id:u(i)+`-`+t.value,name:u(i),model:a.value,value:t.value,invalid:e.invalid,disabled:t.disabled,"onUpdate:model":p[0]||=e=>a.value=e},null,8,[`id`,`name`,`model`,`value`,`invalid`,`disabled`]),d(`span`,null,g(t.label),1)],8,k))),128))]))}})})))()}var M;function N(){return(N=e((()=>{j(),M=A,A.__docgenInfo=Object.assign({displayName:A.name??A.__name},{exportName:`default`,displayName:`RadioGroup`,description:``,tags:{},props:[{name:`legend`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`'Selection'`}},{name:`options`,required:!0,type:{name:`Array`,elements:[{name:`RadioOption`}]}},{name:`invalid`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/radio/RadioGroup.vue`]})})))()}var P=t({InvalidGroup:()=>z,PreferenceGroup:()=>R,Standard:()=>L,__namedExportsOrder:()=>B,default:()=>I}),F,I,L,R,z,B;function V(){return(V=e((()=>{h(),O(),b(),p(),N(),F={"en-US":{choice:`Choice`,email:`Email`,notificationChannel:`Notification channel`,preview:`Preview`,push:`Push`,releaseCadence:`Release cadence`,sms:`SMS`,stable:`Stable`},"ru-RU":{choice:`Выбор`,email:`Электронная почта`,notificationChannel:`Канал уведомлений`,preview:`Предварительные версии`,push:`Push-уведомления`,releaseCadence:`Канал обновлений`,sms:`SMS`,stable:`Стабильные версии`}},I={title:`Components/M3Radio`,component:E,args:{invalid:!1,disabled:!1},render:(e,{globals:t})=>({components:{M3Radio:E},setup:()=>({id:y(`m3-radio`),name:y(`m3-radio-group`),args:e,label:l(t.locale,F).choice,model:m(`choice`)}),template:`
      <label class="flex-row gap-3">
          <M3Radio
              :id="id"
              :name="name"
              :model="model"
              value="choice"
              v-bind="args"
              @update:model="model = $event"
          />

          <span>{{ label }}</span>
      </label>
    `}),parameters:{layout:`centered`}},L={},R={render:(e,{globals:t})=>({components:{RadioGroup:M},setup:()=>({text:l(t.locale,F)}),template:`
      <RadioGroup
          :legend="text.notificationChannel"
          :options="[{
              label: text.email,
              value: 'email',
          }, {
              label: text.push,
              value: 'push',
          }, {
              label: text.sms,
              value: 'sms',
              disabled: true,
          }]"
      />
    `})},z={render:(e,{globals:t})=>({components:{RadioGroup:M},setup:()=>({text:l(t.locale,F)}),template:`
      <RadioGroup
          :legend="text.releaseCadence"
          invalid
          :options="[{
              label: text.stable,
              value: 'stable',
          }, {
              label: text.preview,
              value: 'preview',
          }]"
      />
    `})},B=[`Standard`,`PreferenceGroup`,`InvalidGroup`],L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      RadioGroup
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
      <RadioGroup
          :legend="text.notificationChannel"
          :options="[{
              label: text.email,
              value: 'email',
          }, {
              label: text.push,
              value: 'push',
          }, {
              label: text.sms,
              value: 'sms',
              disabled: true,
          }]"
      />
    \`
  })
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      RadioGroup
    },
    setup: () => ({
      text: localize(globals.locale, messages)
    }),
    template: \`
      <RadioGroup
          :legend="text.releaseCadence"
          invalid
          :options="[{
              label: text.stable,
              value: 'stable',
          }, {
              label: text.preview,
              value: 'preview',
          }]"
      />
    \`
  })
}`,...z.parameters?.docs?.source}}}})))()}export{N as i,V as n,M as r,P as t};