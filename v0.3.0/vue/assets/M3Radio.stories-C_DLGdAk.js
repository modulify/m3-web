import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,O as i,P as a,U as o,V as s,a as c,at as l,b as u,g as d,i as f,nt as p,s as m,ut as h,y as g}from"./iframe-DlP_3VDG.js";import{n as _,t as v}from"./id-DkFC80RS.js";import{n as y,t as b}from"./ripple-CmuynTA7.js";var x,S;function C(){return(C=e((()=>{m(),b(),v(),x=[`id`,`name`,`aria-checked`,`aria-disabled`,`aria-invalid`,`checked`,`disabled`],S=i({__name:`M3Radio`,props:{id:{},name:{},model:{},value:{},invalid:{type:Boolean},disabled:{type:Boolean},equalsFn:{type:Function}},emits:[`change`,`update:model`],setup(e,{expose:t,emit:i}){let o=e,c=i,d=p(null),f=_(`m3-radio`,g(()=>o.id)),m=p(null),h=g(()=>o.value===void 0||o.value);t({get el(){return d.value},click:()=>m.value?.click(),focus:()=>m.value?.focus(),blur:()=>m.value?.blur()});let v=(e,t)=>o.equalsFn?.call(null,e,t)??e===t,b=g(()=>v(o.model,h.value)),S=e=>{e.target.checked&&(c(`change`,h.value),c(`update:model`,h.value))};return(t,i)=>(s(),n(`span`,a({ref_key:`root`,ref:d,class:{"m3-radio":!0,"m3-radio_checked":b.value,"m3-radio_invalid":e.invalid,"m3-radio_disabled":e.disabled}},t.$attrs),[r(l(y),{owner:p(d.value)},null,8,[`owner`]),u(`input`,{id:l(f),ref_key:`_input`,ref:m,name:e.name,"aria-checked":b.value?`true`:`false`,"aria-disabled":e.disabled?`true`:`false`,"aria-invalid":e.invalid?`true`:`false`,checked:b.value,disabled:e.disabled,type:`radio`,class:`m3-radio__input`,onChange:S},null,40,x),i[0]||=u(`span`,{"aria-hidden":`true`,class:`m3-radio__state`},null,-1),i[1]||=u(`span`,{"aria-hidden":`true`,class:`m3-radio__icon`},null,-1)],16))}})})))()}var w;function T(){return(T=e((()=>{C(),w=S,S.__docgenInfo=Object.assign({displayName:S.name??S.__name},{exportName:`default`,displayName:`M3Radio`,description:``,tags:{},props:[{name:`id`,required:!1,type:{name:`string`}},{name:`name`,required:!1,type:{name:`string`}},{name:`model`,required:!1,type:{name:`Value`}},{name:`value`,required:!1,type:{name:`Value`}},{name:`invalid`,required:!1,type:{name:`boolean`}},{name:`disabled`,required:!1,type:{name:`boolean`}},{name:`equalsFn`,required:!1,type:{name:`TSFunctionType`}}],events:[{name:`change`,type:{names:[`Value`]}},{name:`update:model`,type:{names:[`Value`]}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/radio/M3Radio.vue`]})})))()}function E(){return(E=e((()=>{T()})))()}var D,O;function k(){return(k=e((()=>{m(),E(),v(),D=[`for`],O=i({__name:`RadioGroup`,props:{legend:{default:`Selection`},options:{},invalid:{type:Boolean,default:!1}},setup(e){let t=e,i=_(`m3-radio-group`),a=p(t.options[0]?.value),c={margin:0,border:`none`,minWidth:`280px`},f={fontSize:`14px`,lineHeight:`20px`,color:`var(--m3-sys-on-surface-variant)`};return(t,p)=>(s(),n(`fieldset`,{style:c,class:`d-grid gap-3`},[u(`legend`,{style:f,class:`p-0 mb-2`},h(e.legend),1),(s(!0),n(d,null,o(e.options,t=>(s(),n(`label`,{key:t.value,for:l(i)+`-`+t.value,class:`flex-row gap-3`},[r(l(w),{id:l(i)+`-`+t.value,name:l(i),model:a.value,value:t.value,invalid:e.invalid,disabled:t.disabled,"onUpdate:model":p[0]||=e=>a.value=e},null,8,[`id`,`name`,`model`,`value`,`invalid`,`disabled`]),u(`span`,null,h(t.label),1)],8,D))),128))]))}})})))()}var A;function j(){return(j=e((()=>{k(),A=O,O.__docgenInfo=Object.assign({displayName:O.name??O.__name},{exportName:`default`,displayName:`RadioGroup`,description:``,tags:{},props:[{name:`legend`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`'Selection'`}},{name:`options`,required:!0,type:{name:`Array`,elements:[{name:`RadioOption`}]}},{name:`invalid`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/radio/RadioGroup.vue`]})})))()}var M=t({InvalidGroup:()=>L,PreferenceGroup:()=>I,Standard:()=>F,__namedExportsOrder:()=>R,default:()=>P}),N,P,F,I,L,R;function z(){return(z=e((()=>{m(),E(),v(),f(),j(),N={"en-US":{choice:`Choice`,email:`Email`,notificationChannel:`Notification channel`,preview:`Preview`,push:`Push`,releaseCadence:`Release cadence`,sms:`SMS`,stable:`Stable`},"ru-RU":{choice:`Выбор`,email:`Электронная почта`,notificationChannel:`Канал уведомлений`,preview:`Предварительные версии`,push:`Push-уведомления`,releaseCadence:`Канал обновлений`,sms:`SMS`,stable:`Стабильные версии`}},P={title:`Components/M3Radio`,component:w,args:{invalid:!1,disabled:!1},render:(e,{globals:t})=>({components:{M3Radio:w},setup:()=>({id:_(`m3-radio`),name:_(`m3-radio-group`),args:e,label:c(t.locale,N).choice,model:p(`choice`)}),template:`
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
    `}),parameters:{layout:`centered`}},F={},I={render:(e,{globals:t})=>({components:{RadioGroup:A},setup:()=>({text:c(t.locale,N)}),template:`
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
    `})},L={render:(e,{globals:t})=>({components:{RadioGroup:A},setup:()=>({text:c(t.locale,N)}),template:`
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
    `})},R=[`Standard`,`PreferenceGroup`,`InvalidGroup`],F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}}})))()}export{j as i,z as n,A as r,M as t};