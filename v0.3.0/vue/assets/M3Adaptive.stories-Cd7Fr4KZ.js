import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{O as n,a as r,i,s as a}from"./iframe-DlP_3VDG.js";import{t as o}from"./breakpoint-EJ6hpXW4.js";import{n as s,t as c}from"./adaptive-DkSZtiwb.js";import{t as l}from"./animation-CD0k-O-z.js";import{t as u}from"./id-DkFC80RS.js";import{t as d}from"./layers-CVxKGLNh.js";import{t as f}from"./observer-BitNgKCl.js";import{t as p}from"./timing-W3FZiEgd.js";var m;function h(){return(h=e((()=>{a(),c(),m=n({name:`M3Adaptive`,props:{regular:{type:null,default:void 0},compact:{type:null,default:void 0},medium:{type:null,default:void 0},expanded:{type:null,default:void 0},large:{type:null,default:void 0},extraLarge:{type:null,default:void 0}},setup(e,{slots:t}){return()=>{let n=s(t.default??e.regular,{compact:t.compact??e.compact,medium:t.medium??e.medium,expanded:t.expanded??e.expanded,large:t.large??e.large,"extra-large":t[`extra-large`]??e.extraLarge});return typeof n==`function`?n():n}}})})))()}function g(){return(g=e((()=>{h()})))()}function _(){return(_=e((()=>{l(),c(),o(),u(),d(),f(),p()})))()}var v=t({BreakpointContent:()=>x,__namedExportsOrder:()=>S,default:()=>b}),y,b,x,S;function C(){return(C=e((()=>{g(),_(),i(),y={"en-US":{notice:`Use adaptive content only as a last resort to meet Material 3 guidance. First reconsider how the affected component is used, or replace it where possible.`},"ru-RU":{notice:`Адаптивное содержимое — крайнее средство для соблюдения рекомендаций Material 3. Сначала пересмотрите способ применения проблемного компонента или, если возможно, замените его.`}},b={title:`Components/M3Adaptive`,component:m},x={render:(e,{globals:t})=>({components:{M3Adaptive:m},setup:()=>({m3Adaptive:s,notice:r(t.locale,y).notice}),template:`
        <div class="d-grid gap-4 p-6">
            <p>{{ notice }}</p>
            <div>Utility: {{ m3Adaptive('Inbox', { compact: 'Mail', large: 'Incoming messages' }) }}</div>
            <div>Props: <M3Adaptive regular="Inbox" compact="Mail" large="Incoming messages" /></div>
            <div>
                Slots:
                <M3Adaptive>
                    Inbox
                    <template #compact>Mail</template>
                    <template #large>Incoming messages</template>
                </M3Adaptive>
            </div>
        </div>
    `})},S=[`BreakpointContent`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: (_args, {
    globals
  }) => ({
    components: {
      M3Adaptive
    },
    setup: () => ({
      m3Adaptive,
      notice: localize(globals.locale, messages).notice
    }),
    template: \`
        <div class="d-grid gap-4 p-6">
            <p>{{ notice }}</p>
            <div>Utility: {{ m3Adaptive('Inbox', { compact: 'Mail', large: 'Incoming messages' }) }}</div>
            <div>Props: <M3Adaptive regular="Inbox" compact="Mail" large="Incoming messages" /></div>
            <div>
                Slots:
                <M3Adaptive>
                    Inbox
                    <template #compact>Mail</template>
                    <template #large>Incoming messages</template>
                </M3Adaptive>
            </div>
        </div>
    \`
  })
}`,...x.parameters?.docs?.source}}}})))()}export{C as n,v as t};