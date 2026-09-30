import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{a as n,i as r}from"./iframe-CwdcI8lG.js";import{n as i,t as a}from"./surface-ClOxLK9M.js";import{n as o,t as s}from"./scroll-rail-DUiCYTkG.js";var c=t({Both:()=>u,__namedExportsOrder:()=>d,default:()=>l}),l,u,d;function f(){return(f=e((()=>{s(),a(),r(),l={title:`Components/M3ScrollRail`,component:o,argTypes:{horizontal:{control:!1},disabled:{control:`boolean`}},args:{disabled:!1},render:(e,{globals:t})=>({name:`M3ScrollRailStory`,components:{M3ScrollRail:o,M3Surface:i},setup(){return{args:e,item:n(t.locale,{"en-US":`Item`,"ru-RU":`Элемент`}),items:30,scrollArea:n(t.locale,{"en-US":`Scrollable items`,"ru-RU":`Прокручиваемые элементы`})}},template:`
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
                <div
                    :aria-label="scrollArea"
                    class="m3-scroll-box__content"
                    style="padding: 0 8px;"
                    tabindex="0"
                >
                    <M3ScrollRail v-bind="args" />
                    <M3ScrollRail v-bind="args" horizontal />
                    <div v-for="i in items" :key="i" style="width: 480px;">
                      {{ item }} {{ i }}
                    </div>
                </div>
            </div>
        </M3Surface>
    `}),parameters:{layout:`centered`}},u={},d=[`Both`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}}})))()}export{c as n,f as r,u as t};