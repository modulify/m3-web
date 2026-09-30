import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,s as n}from"./blocks-Coxbmtpx.js";import{C as r,D as i,E as a,O as o,Y as s,a as c,b as l,et as u,g as d,i as f,r as p,rt as m,s as h,st as g,y as _,z as v}from"./iframe-CwdcI8lG.js";import{i as y,r as b}from"./react-BXJ34t_g.js";import{a as x}from"./chunk-W22LQPXL-5sr8Qdrs.js";import{n as S,t as C}from"./Inline-70rto0Ra.js";import{n as w,t as T}from"./button-5ZBWLve0.js";import{i as E,t as D}from"./icon-DNAJkfNS.js";import{n as O,t as k}from"./dialog-D3ZZw19Y.js";var A,j,M;function N(){return(N=e((()=>{h(),T(),k(),D(),f(),A={id:`dialog-confirmation-title`},j={id:`dialog-confirmation-description`},M=o({__name:`DialogConfirmation`,props:{locale:{}},setup(e){let t=e,n={"en-US":{cancel:`Cancel`,delete:`Delete`,description:`Deleting the selected messages will also remove them from all synced devices.`,title:`Permanently delete?`},"ru-RU":{cancel:`Отмена`,delete:`Удалить`,description:`Выбранные сообщения также будут удалены со всех синхронизированных устройств.`,title:`Удалить навсегда?`}},o=u(!1),f=_(()=>c(t.locale,n));return(e,t)=>(v(),r(d,null,[i(m(w),{appearance:`tonal`,onClick:t[0]||=e=>o.value=!0},{default:s(()=>[a(g(f.value.delete),1)]),_:1}),i(m(O),{opened:o.value,"onUpdate:opened":t[3]||=e=>o.value=e,role:`dialog`,"aria-modal":`true`,"aria-labelledby":`dialog-confirmation-title`,"aria-describedby":`dialog-confirmation-description`},{icon:s(()=>[i(m(E),{name:`delete`,appearance:`outlined`})]),header:s(()=>[l(`h3`,A,g(f.value.title),1)]),footer:s(()=>[i(m(w),{appearance:`text`,onClick:t[1]||=e=>o.value=!1},{default:s(()=>[a(g(f.value.cancel),1)]),_:1}),i(m(w),{appearance:`tonal`,onClick:t[2]||=e=>o.value=!1},{default:s(()=>[a(g(f.value.delete),1)]),_:1})]),default:s(()=>[l(`p`,j,g(f.value.description),1)]),_:1},8,[`opened`])],64))}})})))()}var P;function F(){return(F=e((()=>{N(),P=M,M.__docgenInfo=Object.assign({displayName:M.name??M.__name},{exportName:`default`,displayName:`DialogConfirmation`,description:``,tags:{},props:[{name:`locale`,required:!0,type:{name:`StorybookLocale`}}],sourceFiles:[`/home/runner/work/m3-web/m3-web/m3-vue/storybook/examples/dialog/DialogConfirmation.vue`]})})))()}function I(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...y(),...e.components};return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)(p,{locale:`en-US`,children:[(0,R.jsx)(t.h1,{id:`dialogs`,children:`Dialogs`}),(0,R.jsx)(t.p,{children:`Dialogs communicate important information and block the underlying interface until the user responds.`}),(0,R.jsx)(t.h2,{id:`api`,children:`API`}),(0,R.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),(0,R.jsxs)(t.p,{children:[`Use `,(0,R.jsx)(t.code,{children:`M3Dialog`}),` for short, interruptive decisions that need an explicit user choice before the page can continue. In Material 3 terms this maps best to confirmation, acknowledgement, and blocking task flows rather than to long-form editing or navigation.`]}),(0,R.jsx)(t.h3,{id:`structure`,children:`Structure`}),(0,R.jsxs)(t.p,{children:[(0,R.jsx)(t.code,{children:`M3Dialog`}),` keeps the same content anatomy across React and Vue:`]}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsxs)(t.li,{children:[(0,R.jsx)(t.code,{children:`icon`}),` slot for a leading visual cue`]}),`
`,(0,R.jsxs)(t.li,{children:[(0,R.jsx)(t.code,{children:`header`}),` slot for the title area`]}),`
`,(0,R.jsx)(t.li,{children:`default slot for supporting text or compact form controls`}),`
`,(0,R.jsxs)(t.li,{children:[(0,R.jsx)(t.code,{children:`footer`}),` slot for high-signal actions`]}),`
`]}),(0,R.jsxs)(t.p,{children:[`The component now renders on top of `,(0,R.jsx)(t.code,{children:`M3Surface`}),`, so dialog presentation and motion are aligned with the same modal surface vocabulary used by side sheets and orchestration stories.`]}),(0,R.jsx)(t.h3,{id:`behavior-in-this-implementation`,children:`Behavior in this implementation`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsx)(t.li,{children:`Non-fullscreen dialogs open as centered modal surfaces with a scrim.`}),`
`,(0,R.jsx)(t.li,{children:`Fullscreen dialogs remove the scrim and expand to the viewport.`}),`
`,(0,R.jsx)(t.li,{children:`The surface enters with a short fade plus a slight upward settle, matching the modal choreography used in the nested-surface stories.`}),`
`,(0,R.jsx)(t.li,{children:`Dialog content stays mounted briefly during exit so the leave animation can finish before unmount.`}),`
`]}),(0,R.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsxs)(t.li,{children:[`Set `,(0,R.jsx)(t.code,{children:`role="dialog"`}),` (or `,(0,R.jsx)(t.code,{children:`alertdialog`}),` for urgent confirmations).`]}),`
`,(0,R.jsxs)(t.li,{children:[`Provide `,(0,R.jsx)(t.code,{children:`aria-modal="true"`}),` for modal flows.`]}),`
`,(0,R.jsxs)(t.li,{children:[`Connect title and description with `,(0,R.jsx)(t.code,{children:`aria-labelledby`}),` and `,(0,R.jsx)(t.code,{children:`aria-describedby`}),`.`]}),`
`,(0,R.jsx)(t.li,{children:`Keep focus inside the dialog while it is opened.`}),`
`,(0,R.jsx)(t.li,{children:`Keep action labels explicit and outcome-oriented.`}),`
`]}),(0,R.jsx)(n,{children:(0,R.jsx)(`div`,{className:`mb-3`,children:(0,R.jsx)(C,{is:P,locale:`en-US`})})}),(0,R.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),(0,R.jsx)(t.h3,{id:`content-density`,children:`Content density`}),(0,R.jsx)(t.p,{children:`Prefer one short title, one supporting message, and one clear primary action. If the flow starts needing dense forms, multiple scrolling regions, or navigation-like exploration, a side sheet or dedicated page usually communicates the state change more clearly.`}),(0,R.jsx)(t.h3,{id:`actions`,children:`Actions`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsx)(t.li,{children:`Use the footer for the final decision point.`}),`
`,(0,R.jsx)(t.li,{children:`Keep destructive actions explicit in both label and placement.`}),`
`,(0,R.jsxs)(t.li,{children:[`Prefer a dismissive secondary action such as `,(0,R.jsx)(t.code,{children:`Cancel`}),` over relying on scrim click alone.`]}),`
`]}),(0,R.jsx)(t.h3,{id:`fullscreen-mode`,children:`Fullscreen mode`}),(0,R.jsxs)(t.p,{children:[`Use `,(0,R.jsx)(t.code,{children:`fullscreen`}),` only when the task needs the full viewport or when compact dialog proportions would constrain readability. This mode still keeps dialog semantics, but visually behaves closer to a temporary task surface than to a small confirmation window.`]}),(0,R.jsx)(t.h2,{id:`code-example`,children:`Code example`}),(0,R.jsx)(t.pre,{children:(0,R.jsx)(t.code,{className:`language-html`,children:`<M3Dialog
  v-model:opened="opened"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-confirmation-title"
  aria-describedby="dialog-confirmation-description"
>
  <template #icon>
    <M3Icon name="delete" appearance="outlined" />
  </template>

  <template #header>
    <h3 id="dialog-confirmation-title">
      Permanently delete?
    </h3>
  </template>

  <p id="dialog-confirmation-description">
    Deleting the selected messages will also remove them from all synced devices.
  </p>

  <template #footer>
    <M3Button appearance="text" @click="opened = false">
      Cancel
    </M3Button>

    <M3Button appearance="tonal" @click="opened = false">
      Delete
    </M3Button>
  </template>
</M3Dialog>
`})}),(0,R.jsx)(t.h2,{id:`resources`,children:`Resources`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsx)(t.li,{children:(0,R.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`M3 Dialogs overview`})}),`
`,(0,R.jsx)(t.li,{children:(0,R.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/guidelines`,rel:`nofollow`,children:`M3 Dialogs guidelines`})}),`
`,(0,R.jsx)(t.li,{children:(0,R.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Modal Dialog Pattern`})}),`
`]})]}),`
`,(0,R.jsxs)(p,{locale:`ru-RU`,children:[(0,R.jsx)(t.h1,{id:`диалоги`,children:`Диалоги`}),(0,R.jsx)(t.p,{children:`Диалоги сообщают важную информацию и блокируют основной интерфейс, пока пользователь не ответит.`}),(0,R.jsx)(t.h2,{id:`api-1`,children:`API`}),(0,R.jsx)(t.h3,{id:`когда-использовать`,children:`Когда использовать`}),(0,R.jsxs)(t.p,{children:[`Используйте `,(0,R.jsx)(t.code,{children:`M3Dialog`}),` для коротких прерывающих решений, которые требуют явного выбора перед продолжением работы со страницей. В терминах Material 3 это прежде всего подтверждения, уведомления и блокирующие задачи, а не длинные формы редактирования или навигация.`]}),(0,R.jsx)(t.h3,{id:`структура`,children:`Структура`}),(0,R.jsxs)(t.p,{children:[(0,R.jsx)(t.code,{children:`M3Dialog`}),` сохраняет одинаковую анатомию содержимого в React и Vue:`]}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsxs)(t.li,{children:[`слот `,(0,R.jsx)(t.code,{children:`icon`}),` для ведущей визуальной подсказки`]}),`
`,(0,R.jsxs)(t.li,{children:[`слот `,(0,R.jsx)(t.code,{children:`header`}),` для заголовка`]}),`
`,(0,R.jsx)(t.li,{children:`слот по умолчанию для поясняющего текста или компактных полей формы`}),`
`,(0,R.jsxs)(t.li,{children:[`слот `,(0,R.jsx)(t.code,{children:`footer`}),` для наиболее важных действий`]}),`
`]}),(0,R.jsxs)(t.p,{children:[`Компонент построен поверх `,(0,R.jsx)(t.code,{children:`M3Surface`}),`, поэтому оформление и движение диалога согласованы с тем же языком модальных поверхностей, который используется боковыми панелями и композиционными историями.`]}),(0,R.jsx)(t.h3,{id:`особенности-реализации`,children:`Особенности реализации`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsx)(t.li,{children:`Обычные диалоги открываются как центрированные модальные поверхности со scrim.`}),`
`,(0,R.jsx)(t.li,{children:`Полноэкранные диалоги убирают scrim и занимают весь viewport.`}),`
`,(0,R.jsx)(t.li,{children:`Поверхность появляется с коротким fade-эффектом и небольшим движением вверх, соответствующим модальной анимации вложенных поверхностей.`}),`
`,(0,R.jsx)(t.li,{children:`Во время закрытия содержимое ненадолго остаётся смонтированным, чтобы анимация успела завершиться.`}),`
`]}),(0,R.jsx)(t.h2,{id:`доступность`,children:`Доступность`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsxs)(t.li,{children:[`Укажите `,(0,R.jsx)(t.code,{children:`role="dialog"`}),` или `,(0,R.jsx)(t.code,{children:`alertdialog`}),` для срочных подтверждений.`]}),`
`,(0,R.jsxs)(t.li,{children:[`Для модальных сценариев задайте `,(0,R.jsx)(t.code,{children:`aria-modal="true"`}),`.`]}),`
`,(0,R.jsxs)(t.li,{children:[`Свяжите заголовок и описание через `,(0,R.jsx)(t.code,{children:`aria-labelledby`}),` и `,(0,R.jsx)(t.code,{children:`aria-describedby`}),`.`]}),`
`,(0,R.jsx)(t.li,{children:`Пока диалог открыт, удерживайте фокус внутри него.`}),`
`,(0,R.jsx)(t.li,{children:`Используйте явные подписи действий, описывающие результат.`}),`
`]}),(0,R.jsx)(n,{children:(0,R.jsx)(`div`,{className:`mb-3`,children:(0,R.jsx)(C,{is:P,locale:`ru-RU`})})}),(0,R.jsx)(t.h2,{id:`рекомендации`,children:`Рекомендации`}),(0,R.jsx)(t.h3,{id:`плотность-содержимого`,children:`Плотность содержимого`}),(0,R.jsx)(t.p,{children:`Предпочитайте короткий заголовок, одно поясняющее сообщение и одно понятное основное действие. Если сценарию требуются большие формы, несколько прокручиваемых областей или навигация, боковая панель или отдельная страница обычно лучше передают смену состояния.`}),(0,R.jsx)(t.h3,{id:`действия`,children:`Действия`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsx)(t.li,{children:`Оставляйте окончательное решение в футере.`}),`
`,(0,R.jsx)(t.li,{children:`Явно обозначайте опасные действия и подписью, и расположением.`}),`
`,(0,R.jsxs)(t.li,{children:[`Предпочитайте вторичную кнопку отмены, например `,(0,R.jsx)(t.code,{children:`Отмена`}),`, вместо закрытия только по нажатию на scrim.`]}),`
`]}),(0,R.jsx)(t.h3,{id:`полноэкранный-режим`,children:`Полноэкранный режим`}),(0,R.jsxs)(t.p,{children:[`Используйте `,(0,R.jsx)(t.code,{children:`fullscreen`}),`, только если задаче нужен весь viewport или компактные размеры диалога ухудшают читаемость. Семантика диалога сохраняется, но визуально такой режим ближе к временной рабочей поверхности, чем к небольшому окну подтверждения.`]}),(0,R.jsx)(t.h2,{id:`пример-кода`,children:`Пример кода`}),(0,R.jsx)(t.pre,{children:(0,R.jsx)(t.code,{className:`language-html`,children:`<M3Dialog
  v-model:opened="opened"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-confirmation-title"
  aria-describedby="dialog-confirmation-description"
>
  <template #icon>
    <M3Icon name="delete" appearance="outlined" />
  </template>

  <template #header>
    <h3 id="dialog-confirmation-title">
      Удалить навсегда?
    </h3>
  </template>

  <p id="dialog-confirmation-description">
    Выбранные сообщения также будут удалены со всех синхронизированных устройств.
  </p>

  <template #footer>
    <M3Button appearance="text" @click="opened = false">
      Отмена
    </M3Button>

    <M3Button appearance="tonal" @click="opened = false">
      Удалить
    </M3Button>
  </template>
</M3Dialog>
`})}),(0,R.jsx)(t.h2,{id:`полезные-ссылки`,children:`Полезные ссылки`}),(0,R.jsxs)(t.ul,{children:[`
`,(0,R.jsx)(t.li,{children:(0,R.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`Обзор M3 Dialogs`})}),`
`,(0,R.jsx)(t.li,{children:(0,R.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/guidelines`,rel:`nofollow`,children:`Рекомендации M3 Dialogs`})}),`
`,(0,R.jsx)(t.li,{children:(0,R.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: шаблон модального диалога`})}),`
`]})]})]})}function L(e={}){let{wrapper:t}={...y(),...e.components};return t?(0,R.jsx)(t,{...e,children:(0,R.jsx)(I,{...e})}):I(e)}var R;function z(){return(z=e((()=>{R=x(),b(),t(),S(),F(),f()})))()}z();export{L as default};