import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-DlP_3VDG.js";import{n as i,t as a}from"./divider-B_gcBSia.js";var o=t({EndInset:()=>d,FullWidth:()=>c,MiddleInset:()=>u,Semantic:()=>p,StartInset:()=>l,Vertical:()=>f,__namedExportsOrder:()=>m,default:()=>s}),s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{a(),r(),s={title:`Components/M3Divider`,component:i,argTypes:{orientation:{control:`select`,options:[`horizontal`,`vertical`]},inset:{control:`select`,options:[`none`,`start`,`end`,`middle`]}},args:{orientation:`horizontal`,inset:`none`},render:(e,{globals:t})=>({components:{M3Divider:i},setup(){return{args:e,first:n(t.locale,{"en-US":`First section`,"ru-RU":`Первый раздел`}),second:n(t.locale,{"en-US":`Second section`,"ru-RU":`Второй раздел`})}},template:`
        <div
            :style="{
                display: args.orientation === 'vertical' ? 'flex' : 'block',
                width: '420px',
                height: args.orientation === 'vertical' ? '160px' : undefined,
                padding: '24px',
                borderRadius: '16px',
                background: 'var(--m3-sys-surface-container-low)',
            }"
        >
            <div :style="{ flex: 1, padding: args.orientation === 'vertical' ? '12px' : '12px 0' }">{{ first }}</div>
            <M3Divider v-bind="args" />
            <div :style="{ flex: 1, padding: args.orientation === 'vertical' ? '12px' : '12px 0' }">{{ second }}</div>
        </div>
    `}),parameters:{layout:`centered`}},c={},l={args:{inset:`start`}},u={args:{inset:`middle`}},d={args:{inset:`end`}},f={args:{orientation:`vertical`}},p={render:(e,{globals:t})=>({components:{M3Divider:i},setup(){return{label:n(t.locale,{"en-US":`Sections`,"ru-RU":`Разделы`})}},template:`<M3Divider role="separator" :aria-label="label" style="width: 420px" />`})},m=[`FullWidth`,`StartInset`,`MiddleInset`,`EndInset`,`Vertical`,`Semantic`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    inset: 'start'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    inset: 'middle'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    inset: 'end'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Divider
    },
    setup() {
      return {
        label: localize(globals.locale, {
          'en-US': 'Sections',
          'ru-RU': 'Разделы'
        })
      };
    },
    template: '<M3Divider role="separator" :aria-label="label" style="width: 420px" />'
  })
}`,...p.parameters?.docs?.source}}}})))()}export{f as a,l as i,o as n,h as o,u as r,c as t};