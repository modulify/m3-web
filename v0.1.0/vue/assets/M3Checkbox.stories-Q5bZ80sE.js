import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{C as n,I as r,O as i,P as a,Q as o,S as s,W as c,Y as l,_ as u,d,et as f,g as p,h as m,m as h,n as g,nt as _,v}from"./iframe-DqoEP6-3.js";import{n as ee,t as y}from"./ripple-axkc_TDH.js";import{n as b,r as x}from"./predicates-Fn35WtiC.js";import{n as S,t as C}from"./id-8ELSJK95.js";import{n as w,t as T}from"./surface-JSn1WMio.js";import{n as E,t as D}from"./_plugin-vue_export-helper-BqBa3wPr.js";function te(e,t){return a(),v(`svg`,ne,[...t[0]||=[m(`path`,{fill:`currentColor`,d:`m10 16.4-4-4L7.4 11l2.6 2.6L16.6 7 18 8.4z`},null,-1)]])}var ne,re;function O(){return(O=e((()=>{g(),ne={xmlns:`http://www.w3.org/2000/svg`,width:`24`,height:`24`,fill:`none`},re={render:te}})))()}function ie(e,t){return a(),v(`svg`,k,[...t[0]||=[m(`path`,{fill:`currentColor`,d:`M7 13v-2h10v2z`},null,-1)]])}var k,A;function j(){return(j=e((()=>{g(),k={xmlns:`http://www.w3.org/2000/svg`,width:`24`,height:`24`,fill:`none`},A={render:ie}})))()}var M,N,P;function F(){return(F=e((()=>{g(),b(),y(),C(),O(),j(),M=[`id`,`name`,`aria-checked`,`aria-invalid`,`value`,`checked`,`disabled`],N={"aria-hidden":`true`,class:`m3-checkbox__checkmark`},P=n({__name:`M3Checkbox`,props:{id:{},name:{},model:{},value:{},indeterminate:{type:Boolean},invalid:{type:Boolean},disabled:{type:Boolean},trueValue:{},falseValue:{},equalsFn:{type:Function}},emits:[`change`,`update:model`],setup(e,{expose:t,emit:n}){let r=e,c=n,d=l(null),f=S(`m3-checkbox`,h(()=>r.id)),g=h(()=>r.name??f.value),_=l(null),y=h(()=>r.trueValue===void 0||r.trueValue),b=h(()=>r.falseValue!==void 0&&r.falseValue);t({get el(){return d.value},click:()=>_.value?.click(),focus:()=>_.value?.focus(),blur:()=>_.value?.blur()});let C=(e,t)=>r.equalsFn?.call(null,e,t)??e===t,w=(e,t)=>e.some(e=>C(e,t)),T=h(()=>x(r.model)?w(r.model,r.value):C(r.model,y.value)),E=e=>x(r.model)?e?w(r.model,r.value)?r.model:[...r.model,r.value]:[...r.model].filter(e=>!C(e,r.value)):e?y.value:b.value,D=e=>{let t=E(e.target.checked);c(`change`,t),c(`update:model`,t)};return(t,n)=>(a(),v(`span`,i({ref_key:`root`,ref:d,class:{"m3-checkbox":!0,"m3-checkbox_checked":T.value,"m3-checkbox_indeterminate":e.indeterminate,"m3-checkbox_invalid":e.invalid,"m3-checkbox_disabled":e.disabled}},t.$attrs),[s(o(ee),{owner:l(d.value)},null,8,[`owner`]),m(`input`,{id:o(f),ref_key:`_input`,ref:_,name:g.value,"aria-checked":T.value?`true`:`false`,"aria-invalid":e.invalid?`true`:`false`,value:e.value,checked:T.value,disabled:e.disabled,type:`checkbox`,class:`m3-checkbox__input`,onChange:D},null,40,M),n[0]||=m(`span`,{"aria-hidden":`true`,class:`m3-checkbox__state`},null,-1),m(`span`,N,[e.indeterminate?(a(),p(o(A),{key:0})):T.value?(a(),p(o(re),{key:1})):u(``,!0)])],16))}})})))()}var I;function L(){return(L=e((()=>{F(),I=P,P.__docgenInfo=Object.assign({displayName:P.name??P.__name},{exportName:`default`,displayName:`M3Checkbox`,description:``,tags:{},props:[{name:`id`,required:!1,type:{name:`string`}},{name:`name`,required:!1,type:{name:`string`}},{name:`model`,required:!1,type:{name:`Model`}},{name:`value`,required:!1,type:{name:`Value`}},{name:`indeterminate`,required:!1,type:{name:`boolean`}},{name:`invalid`,required:!1,type:{name:`boolean`}},{name:`disabled`,required:!1,type:{name:`boolean`}},{name:`trueValue`,required:!1,type:{name:`Model`}},{name:`falseValue`,required:!1,type:{name:`Model`}},{name:`equalsFn`,required:!1,type:{name:`TSFunctionType`}}],events:[{name:`change`,type:{names:[`Model`]},description:`Переключение чекбокса`},{name:`update:model`,type:{names:[`Model`]},description:`Изменение значения модели`}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/src/components/checkbox/M3Checkbox.vue`]})})))()}function R(){return(R=e((()=>{L()})))()}var z,B,V,H,U;function W(){return(W=e((()=>{g(),R(),T(),C(),z=[`for`],B={style:{"padding-left":`32px`}},V=[`for`],H=[`for`],U=n({__name:`CheckboxList`,props:{options:{type:Array,default:()=>[]}},setup(e){let t=S(`m3-checkbox-example`),n=l([]),i=e=>e.subordinates?.every(e=>n.value.includes(e.value))??!1,u=e=>e.subordinates?.some(e=>n.value.includes(e.value))===!0&&!i(e),h=(e,t)=>{let r=(e.subordinates??[]).map(e=>e.value);t?n.value.push(...r.filter(e=>!n.value.includes(e))):n.value=n.value.filter(e=>!r.includes(e))};return(l,g)=>(a(),p(o(w),{class:f(l.$style.panel),"fill-width":!1,"fill-height":!1,rounding:16,elevation:0,variant:`surface-container`},{default:c(()=>[(a(!0),v(d,null,r(e.options,(e,c)=>(a(),v(d,{key:o(t)+`-option-`+c},[e.subordinates?(a(),v(d,{key:0},[m(`div`,{class:f(l.$style.line)},[s(o(I),{id:o(t)+`-option-`+c,model:i(e),indeterminate:u(e),onChange:t=>h(e,t)},null,8,[`id`,`model`,`indeterminate`,`onChange`]),m(`label`,{for:o(t)+`-option-`+c},_(e.label),9,z)],2),m(`div`,B,[(a(!0),v(d,null,r(e.subordinates,(e,r)=>(a(),v(`div`,{key:o(t)+`-option-`+c+`-`+r,class:f(l.$style.line)},[s(o(I),{id:o(t)+`-option-`+c+`-`+r,model:n.value,"onUpdate:model":g[0]||=e=>n.value=e,value:e.value},null,8,[`id`,`model`,`value`]),m(`label`,{for:o(t)+`-option-`+c+`-`+r},_(e.label),9,V)],2))),128))])],64)):(a(),v(`div`,{key:1,class:f(l.$style.line)},[s(o(I),{id:o(t)+`-option-`+c,model:n.value,"onUpdate:model":g[1]||=e=>n.value=e,value:e.value},null,8,[`id`,`model`,`value`]),m(`label`,{for:o(t)+`-option-`+c},_(e.label),9,H)],2))],64))),128))]),_:1},8,[`class`]))}})})))()}var G,K,q;function J(){return(J=e((()=>{G=`_panel_ulmsc_2`,K=`_line_ulmsc_7`,q={panel:G,line:K}})))()}var Y,X;function Z(){return(Z=e((()=>{W(),J(),E(),Y={$style:q},X=D(U,[[`__cssModules`,Y]]),U.__docgenInfo=Object.assign({displayName:U.name??U.__name},{exportName:`default`,displayName:`CheckboxList`,description:``,tags:{},props:[{name:`options`,type:{name:`OptionWithSubordinates[]`},defaultValue:{func:!0,value:`() => []`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/checkbox/CheckboxList.vue`]})})))()}var ae=t({NestedSelection:()=>$,Standard:()=>Q,__namedExportsOrder:()=>se,default:()=>oe}),oe,Q,$,se;function ce(){return(ce=e((()=>{g(),R(),C(),Z(),oe={title:`Components/M3Checkbox`,component:I,args:{disabled:!1},render:e=>({components:{M3Checkbox:I},setup:()=>({id:S(`m3-checkbox`),args:e,model:l(!1)}),template:`
      <div class="flex-row">
          <M3Checkbox
              :id="id"
              v-model:model="model"
              v-bind="args"
          />

          <label :for="id">Choice</label>
      </div>
    `}),parameters:{layout:`centered`}},Q={},$={render:()=>({components:{CheckboxList:X},template:`
      <CheckboxList
          :options="[{
              label: 'Notifications',
              value: 'notifications',
              subordinates: [{
                  label: 'Email',
                  value: 'email',
              }, {
                  label: 'Push',
                  value: 'push',
              }, {
                  label: 'SMS',
                  value: 'sms',
              }],
          }]"
      />
    `})},se=[`Standard`,`NestedSelection`],Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      CheckboxList
    },
    template: \`
      <CheckboxList
          :options="[{
              label: 'Notifications',
              value: 'notifications',
              subordinates: [{
                  label: 'Email',
                  value: 'email',
              }, {
                  label: 'Push',
                  value: 'push',
              }, {
                  label: 'SMS',
                  value: 'sms',
              }],
          }]"
      />
    \`
  })
}`,...$.parameters?.docs?.source}}}})))()}export{Z as i,ce as n,X as r,ae as t};