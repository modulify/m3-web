import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{n,t as r}from"./surface-JSn1WMio.js";import{n as i,t as a}from"./scroll-rail-6re0x3ry.js";var o=t({Both:()=>c,__namedExportsOrder:()=>l,default:()=>s}),s,c,l;function u(){return(u=e((()=>{a(),r(),s={title:`Components/M3ScrollRail`,component:i,argTypes:{horizontal:{control:!1},disabled:{control:`boolean`}},args:{disabled:!1},render:e=>({name:`M3ScrollRailStory`,components:{M3ScrollRail:i,M3Surface:n},setup(){return{args:e,items:30}},template:`
        <M3Surface
            :fill-width="false"
            :fill-height="false"
            :rounding="16"
            :elevation="0"
            variant="surface-container"
            style="padding: 4px;"
        >
            <div
                class="m3-scroll-box m3-scroll-box_scroll-x m3-scroll-box_scroll-y"
                style="max-width: 360px; max-height: 360px;"
            >
                <div class="m3-scroll-box__content" style="padding: 0 8px;">
                    <M3ScrollRail v-bind="args" />
                    <M3ScrollRail v-bind="args" horizontal />
                    <div v-for="i in items" :key="i" style="width: 480px;">
                      Item {{ i }}
                    </div>
                </div>
            </div>
        </M3Surface>
    `}),parameters:{layout:`centered`}},c={},l=[`Both`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}}})))()}export{o as n,u as r,c as t};