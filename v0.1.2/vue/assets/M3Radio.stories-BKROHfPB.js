import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,D as r,N as i,O as a,V as o,a as s,b as c,et as l,g as u,i as d,rt as f,s as p,st as m,y as h,z as g}from"./iframe-hIq0EEjR.js";import{n as _,t as v}from"./ripple-vFigACnV.js";import{n as y,t as b}from"./id-Nxxsyh-m.js";var x,S;function C(){return(C=e((()=>{p(),v(),b(),x=[`id`,`name`,`aria-checked`,`aria-disabled`,`aria-invalid`,`checked`,`disabled`],S=a({__name:`M3Radio`,props:{id:{},name:{},model:{},value:{},invalid:{type:Boolean},disabled:{type:Boolean},equalsFn:{type:Function}},emits:[`change`,`update:model`],setup(e,{expose:t,emit:a}){let o=e,s=a,u=l(null),d=y(`m3-radio`,h(()=>o.id)),p=l(null),m=h(()=>o.value===void 0||o.value);t({get el(){return u.value},click:()=>p.value?.click(),focus:()=>p.value?.focus(),blur:()=>p.value?.blur()});let v=(e,t)=>o.equalsFn?.call(null,e,t)??e===t,b=h(()=>v(o.model,m.value)),S=e=>{e.target.checked&&(s(`change`,m.value),s(`update:model`,m.value))};return(t,a)=>(g(),n(`span`,i({ref_key:`root`,ref:u,class:{"m3-radio":!0,"m3-radio_checked":b.value,"m3-radio_invalid":e.invalid,"m3-radio_disabled":e.disabled}},t.$attrs),[r(f(_),{owner:l(u.value)},null,8,[`owner`]),c(`input`,{id:f(d),ref_key:`_input`,ref:p,name:e.name,"aria-checked":b.value?`true`:`false`,"aria-disabled":e.disabled?`true`:`false`,"aria-invalid":e.invalid?`true`:`false`,checked:b.value,disabled:e.disabled,type:`radio`,class:`m3-radio__input`,onChange:S},null,40,x),a[0]||=c(`span`,{"aria-hidden":`true`,class:`m3-radio__state`},null,-1),a[1]||=c(`span`,{"aria-hidden":`true`,class:`m3-radio__icon`},null,-1)],16))}})})))()}var w;function T(){return(T=e((()=>{C(),w=S,S.__docgenInfo=Object.assign({displayName:S.name??S.__name},{exportName:`default`,displayName:`M3Radio`,description:``,tags:{},props:[{name:`id`,required:!1,type:{name:`string`}},{name:`name`,required:!1,type:{name:`string`}},{name:`model`,required:!1,type:{name:`Value`}},{name:`value`,required:!1,type:{name:`Value`}},{name:`invalid`,required:!1,type:{name:`boolean`}},{name:`disabled`,required:!1,type:{name:`boolean`}},{name:`equalsFn`,required:!1,type:{name:`TSFunctionType`}}],events:[{name:`change`,type:{names:[`Value`]}},{name:`update:model`,type:{names:[`Value`]}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/radio/M3Radio.vue`]})})))()}function E(){return(E=e((()=>{T()})))()}var D,O;function k(){return(k=e((()=>{p(),E(),b(),D=[`for`],O=a({__name:`RadioGroup`,props:{legend:{default:`Selection`},options:{},invalid:{type:Boolean,default:!1}},setup(e){let t=e,i=y(`m3-radio-group`),a=l(t.options[0]?.value),s={margin:0,padding:0,border:`none`,display:`grid`,gap:`12px`,minWidth:`280px`},d={padding:0,marginBottom:`8px`,fontSize:`14px`,lineHeight:`20px`,color:`var(--m3-sys-on-surface-variant)`},p={display:`flex`,alignItems:`center`,gap:`12px`};return(t,l)=>(g(),n(`fieldset`,{style:s},[c(`legend`,{style:d},m(e.legend),1),(g(!0),n(u,null,o(e.options,t=>(g(),n(`label`,{key:t.value,for:f(i)+`-`+t.value,style:p},[r(f(w),{id:f(i)+`-`+t.value,name:f(i),model:a.value,value:t.value,invalid:e.invalid,disabled:t.disabled,"onUpdate:model":l[0]||=e=>a.value=e},null,8,[`id`,`name`,`model`,`value`,`invalid`,`disabled`]),c(`span`,null,m(t.label),1)],8,D))),128))]))}})})))()}var A;function j(){return(j=e((()=>{k(),A=O,O.__docgenInfo=Object.assign({displayName:O.name??O.__name},{exportName:`default`,displayName:`RadioGroup`,description:``,tags:{},props:[{name:`legend`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`'Selection'`}},{name:`options`,required:!0,type:{name:`Array`,elements:[{name:`RadioOption`}]}},{name:`invalid`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/radio/RadioGroup.vue`]})})))()}var M=t({InvalidGroup:()=>L,PreferenceGroup:()=>I,Standard:()=>F,__namedExportsOrder:()=>R,default:()=>P}),N,P,F,I,L,R;function z(){return(z=e((()=>{p(),E(),b(),d(),j(),N={"en-US":{choice:`Choice`,email:`Email`,notificationChannel:`Notification channel`,preview:`Preview`,push:`Push`,releaseCadence:`Release cadence`,sms:`SMS`,stable:`Stable`},"ru-RU":{choice:`Выбор`,email:`Электронная почта`,notificationChannel:`Канал уведомлений`,preview:`Предварительные версии`,push:`Push-уведомления`,releaseCadence:`Канал обновлений`,sms:`SMS`,stable:`Стабильные версии`}},P={title:`Components/M3Radio`,component:w,args:{invalid:!1,disabled:!1},render:(e,{globals:t})=>({components:{M3Radio:w},setup:()=>({id:y(`m3-radio`),name:y(`m3-radio-group`),args:e,label:s(t.locale,N).choice,model:l(`choice`)}),template:`
      <label style="display: flex; align-items: center; gap: 12px;">
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
    `}),parameters:{layout:`centered`}},F={},I={render:(e,{globals:t})=>({components:{RadioGroup:A},setup:()=>({text:s(t.locale,N)}),template:`
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
    `})},L={render:(e,{globals:t})=>({components:{RadioGroup:A},setup:()=>({text:s(t.locale,N)}),template:`
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