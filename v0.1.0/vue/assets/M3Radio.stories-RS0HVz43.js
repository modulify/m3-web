import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,I as r,O as i,P as a,Q as o,S as s,Y as c,d as l,h as u,m as d,n as f,nt as p,v as m}from"./iframe-DqoEP6-3.js";import{n as h,t as g}from"./ripple-axkc_TDH.js";import{n as _,t as v}from"./id-8ELSJK95.js";var y,b;function x(){return(x=e((()=>{f(),g(),v(),y=[`id`,`name`,`aria-checked`,`aria-disabled`,`aria-invalid`,`checked`,`disabled`],b=n({__name:`M3Radio`,props:{id:{},name:{},model:{},value:{},invalid:{type:Boolean},disabled:{type:Boolean},equalsFn:{type:Function}},emits:[`change`,`update:model`],setup(e,{expose:t,emit:n}){let r=e,l=n,f=c(null),p=_(`m3-radio`,d(()=>r.id)),g=c(null),v=d(()=>r.value===void 0||r.value);t({get el(){return f.value},click:()=>g.value?.click(),focus:()=>g.value?.focus(),blur:()=>g.value?.blur()});let b=(e,t)=>r.equalsFn?.call(null,e,t)??e===t,x=d(()=>b(r.model,v.value)),S=e=>{e.target.checked&&(l(`change`,v.value),l(`update:model`,v.value))};return(t,n)=>(a(),m(`span`,i({ref_key:`root`,ref:f,class:{"m3-radio":!0,"m3-radio_checked":x.value,"m3-radio_invalid":e.invalid,"m3-radio_disabled":e.disabled}},t.$attrs),[s(o(h),{owner:c(f.value)},null,8,[`owner`]),u(`input`,{id:o(p),ref_key:`_input`,ref:g,name:e.name,"aria-checked":x.value?`true`:`false`,"aria-disabled":e.disabled?`true`:`false`,"aria-invalid":e.invalid?`true`:`false`,checked:x.value,disabled:e.disabled,type:`radio`,class:`m3-radio__input`,onChange:S},null,40,y),n[0]||=u(`span`,{"aria-hidden":`true`,class:`m3-radio__state`},null,-1),n[1]||=u(`span`,{"aria-hidden":`true`,class:`m3-radio__icon`},null,-1)],16))}})})))()}var S;function C(){return(C=e((()=>{x(),S=b,b.__docgenInfo=Object.assign({displayName:b.name??b.__name},{exportName:`default`,displayName:`M3Radio`,description:``,tags:{},props:[{name:`id`,required:!1,type:{name:`string`}},{name:`name`,required:!1,type:{name:`string`}},{name:`model`,required:!1,type:{name:`Value`}},{name:`value`,required:!1,type:{name:`Value`}},{name:`invalid`,required:!1,type:{name:`boolean`}},{name:`disabled`,required:!1,type:{name:`boolean`}},{name:`equalsFn`,required:!1,type:{name:`TSFunctionType`}}],events:[{name:`change`,type:{names:[`Value`]}},{name:`update:model`,type:{names:[`Value`]}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/radio/M3Radio.vue`]})})))()}function w(){return(w=e((()=>{C()})))()}var T,E;function D(){return(D=e((()=>{f(),w(),v(),T=[`for`],E=n({__name:`RadioGroup`,props:{legend:{default:`Selection`},options:{},invalid:{type:Boolean,default:!1}},setup(e){let t=e,n=_(`m3-radio-group`),i=c(t.options[0]?.value),d={margin:0,padding:0,border:`none`,display:`grid`,gap:`12px`,minWidth:`280px`},f={padding:0,marginBottom:`8px`,fontSize:`14px`,lineHeight:`20px`,color:`var(--m3-sys-on-surface-variant)`},h={display:`flex`,alignItems:`center`,gap:`12px`};return(t,c)=>(a(),m(`fieldset`,{style:d},[u(`legend`,{style:f},p(e.legend),1),(a(!0),m(l,null,r(e.options,t=>(a(),m(`label`,{key:t.value,for:o(n)+`-`+t.value,style:h},[s(o(S),{id:o(n)+`-`+t.value,name:o(n),model:i.value,value:t.value,invalid:e.invalid,disabled:t.disabled,"onUpdate:model":c[0]||=e=>i.value=e},null,8,[`id`,`name`,`model`,`value`,`invalid`,`disabled`]),u(`span`,null,p(t.label),1)],8,T))),128))]))}})})))()}var O;function k(){return(k=e((()=>{D(),O=E,E.__docgenInfo=Object.assign({displayName:E.name??E.__name},{exportName:`default`,displayName:`RadioGroup`,description:``,tags:{},props:[{name:`legend`,required:!1,type:{name:`string`},defaultValue:{func:!1,value:`'Selection'`}},{name:`options`,required:!0,type:{name:`Array`,elements:[{name:`RadioOption`}]}},{name:`invalid`,required:!1,type:{name:`boolean`},defaultValue:{func:!1,value:`false`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/radio/RadioGroup.vue`]})})))()}var A=t({InvalidGroup:()=>P,PreferenceGroup:()=>N,Standard:()=>M,__namedExportsOrder:()=>F,default:()=>j}),j,M,N,P,F;function I(){return(I=e((()=>{f(),w(),v(),k(),j={title:`Components/M3Radio`,component:S,args:{invalid:!1,disabled:!1},render:e=>({components:{M3Radio:S},setup:()=>({id:_(`m3-radio`),name:_(`m3-radio-group`),args:e,model:c(`choice`)}),template:`
      <label style="display: flex; align-items: center; gap: 12px;">
          <M3Radio
              :id="id"
              :name="name"
              :model="model"
              value="choice"
              v-bind="args"
              @update:model="model = $event"
          />

          <span>Choice</span>
      </label>
    `}),parameters:{layout:`centered`}},M={},N={render:()=>({components:{RadioGroup:O},template:`
      <RadioGroup
          legend="Notification channel"
          :options="[{
              label: 'Email',
              value: 'email',
          }, {
              label: 'Push',
              value: 'push',
          }, {
              label: 'SMS',
              value: 'sms',
              disabled: true,
          }]"
      />
    `})},P={render:()=>({components:{RadioGroup:O},template:`
      <RadioGroup
          legend="Release cadence"
          invalid
          :options="[{
              label: 'Stable',
              value: 'stable',
          }, {
              label: 'Preview',
              value: 'preview',
          }]"
      />
    `})},F=[`Standard`,`PreferenceGroup`,`InvalidGroup`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      RadioGroup
    },
    template: \`
      <RadioGroup
          legend="Notification channel"
          :options="[{
              label: 'Email',
              value: 'email',
          }, {
              label: 'Push',
              value: 'push',
          }, {
              label: 'SMS',
              value: 'sms',
              disabled: true,
          }]"
      />
    \`
  })
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      RadioGroup
    },
    template: \`
      <RadioGroup
          legend="Release cadence"
          invalid
          :options="[{
              label: 'Stable',
              value: 'stable',
          }, {
              label: 'Preview',
              value: 'preview',
          }]"
      />
    \`
  })
}`,...P.parameters?.docs?.source}}}})))()}export{k as i,I as n,O as r,A as t};