import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{E as n,T as r,c as i,s as a}from"./blocks-NwLwj9yT.js";import{a as o,i as s,r as c}from"./iframe-wale67Qv.js";import{t as l}from"./jsx-runtime-DeHZSEgm.js";import{n as u,t as d}from"./button-Bg5IbSnS.js";import{r as f,t as p}from"./icon-qppvVYBr.js";import{n as m,t as h}from"./dialog-TupeemeK.js";var g,_,v,y;function b(){return(b=e((()=>{g=t(),d(),h(),p(),s(),_=l(),v={"en-US":{cancel:`Cancel`,delete:`Delete`,description:`Deleting the selected messages will also remove them from all synced devices.`,title:`Permanently delete?`},"ru-RU":{cancel:`Отмена`,delete:`Удалить`,description:`Выбранные сообщения также будут удалены со всех синхронизированных устройств.`,title:`Удалить навсегда?`}},y=({locale:e})=>{let[t,n]=(0,g.useState)(!1),r=`dialog-confirmation-title`,i=`dialog-confirmation-description`,a=o(e,v);return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(u,{appearance:`tonal`,onClick:()=>n(!0),children:a.delete}),(0,_.jsxs)(m,{opened:t,role:`dialog`,"aria-modal":`true`,"aria-labelledby":r,"aria-describedby":i,onToggle:n,children:[(0,_.jsx)(m.Icon,{children:(0,_.jsx)(f,{name:`delete`,appearance:`outlined`})}),(0,_.jsx)(m.Header,{children:(0,_.jsx)(`h3`,{id:r,children:a.title})}),(0,_.jsx)(`p`,{id:i,children:a.description}),(0,_.jsxs)(m.Footer,{children:[(0,_.jsx)(u,{appearance:`text`,onClick:()=>n(!1),children:a.cancel}),(0,_.jsx)(u,{appearance:`tonal`,onClick:()=>n(!1),children:a.delete})]})]})]})},y.__docgenInfo={description:``,methods:[],displayName:`DialogConfirmation`,props:{locale:{required:!0,tsType:{name:`union`,raw:`'en-US' | 'ru-RU'`,elements:[{name:`literal`,value:`'en-US'`},{name:`literal`,value:`'ru-RU'`}]},description:``}}}})))()}function x(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)(c,{locale:`en-US`,children:[(0,C.jsx)(t.h1,{id:`dialogs`,children:`Dialogs`}),(0,C.jsx)(t.p,{children:`Dialogs communicate important information and block the underlying interface until the user responds.`}),(0,C.jsx)(t.h2,{id:`api`,children:`API`}),(0,C.jsx)(t.h3,{id:`when-to-use`,children:`When to use`}),(0,C.jsxs)(t.p,{children:[`Use `,(0,C.jsx)(t.code,{children:`M3Dialog`}),` for short, interruptive decisions that need an explicit user choice before the page can continue. In Material 3 terms this maps best to confirmation, acknowledgement, and blocking task flows rather than to long-form editing or navigation.`]}),(0,C.jsx)(t.h3,{id:`structure`,children:`Structure`}),(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`M3Dialog`}),` keeps the same content anatomy across React and Vue:`]}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`M3Dialog.Icon`}),` for a leading visual cue`]}),`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`M3Dialog.Header`}),` for the title area`]}),`
`,(0,C.jsx)(t.li,{children:`default content for supporting text or compact form controls`}),`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`M3Dialog.Footer`}),` for high-signal actions`]}),`
`]}),(0,C.jsxs)(t.p,{children:[`The component now renders on top of `,(0,C.jsx)(t.code,{children:`M3Surface`}),`, so dialog presentation and motion are aligned with the same modal surface vocabulary used by side sheets and orchestration stories.`]}),(0,C.jsx)(t.h3,{id:`behavior-in-this-implementation`,children:`Behavior in this implementation`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:`Non-fullscreen dialogs open as centered modal surfaces with a scrim.`}),`
`,(0,C.jsx)(t.li,{children:`Fullscreen dialogs remove the scrim and expand to the viewport.`}),`
`,(0,C.jsx)(t.li,{children:`The surface enters with a short fade plus a slight upward settle, matching the modal choreography used in the nested-surface stories.`}),`
`,(0,C.jsx)(t.li,{children:`Dialog content stays mounted briefly during exit so the leave animation can finish before unmount.`}),`
`]}),(0,C.jsx)(t.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsxs)(t.li,{children:[`Set `,(0,C.jsx)(t.code,{children:`role="dialog"`}),` (or `,(0,C.jsx)(t.code,{children:`alertdialog`}),` for urgent confirmations).`]}),`
`,(0,C.jsxs)(t.li,{children:[`Provide `,(0,C.jsx)(t.code,{children:`aria-modal="true"`}),` for modal flows.`]}),`
`,(0,C.jsxs)(t.li,{children:[`Connect title and description with `,(0,C.jsx)(t.code,{children:`aria-labelledby`}),` and `,(0,C.jsx)(t.code,{children:`aria-describedby`}),`.`]}),`
`,(0,C.jsx)(t.li,{children:`Keep focus inside the dialog while it is opened.`}),`
`,(0,C.jsx)(t.li,{children:`Keep action labels explicit and outcome-oriented.`}),`
`]}),(0,C.jsx)(a,{children:(0,C.jsx)(`div`,{className:`mb-3`,children:(0,C.jsx)(y,{locale:`en-US`})})}),(0,C.jsx)(t.h2,{id:`usage-guidance`,children:`Usage guidance`}),(0,C.jsx)(t.h3,{id:`content-density`,children:`Content density`}),(0,C.jsx)(t.p,{children:`Prefer one short title, one supporting message, and one clear primary action. If the flow starts needing dense forms, multiple scrolling regions, or navigation-like exploration, a side sheet or dedicated page usually communicates the state change more clearly.`}),(0,C.jsx)(t.h3,{id:`actions`,children:`Actions`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:`Use the footer for the final decision point.`}),`
`,(0,C.jsx)(t.li,{children:`Keep destructive actions explicit in both label and placement.`}),`
`,(0,C.jsxs)(t.li,{children:[`Prefer a dismissive secondary action such as `,(0,C.jsx)(t.code,{children:`Cancel`}),` over relying on scrim click alone.`]}),`
`]}),(0,C.jsx)(t.h3,{id:`fullscreen-mode`,children:`Fullscreen mode`}),(0,C.jsxs)(t.p,{children:[`Use `,(0,C.jsx)(t.code,{children:`fullscreen`}),` only when the task needs the full viewport or when compact dialog proportions would constrain readability. This mode still keeps dialog semantics, but visually behaves closer to a temporary task surface than to a small confirmation window.`]}),(0,C.jsx)(t.h2,{id:`code-example`,children:`Code example`}),(0,C.jsx)(t.pre,{children:(0,C.jsx)(t.code,{className:`language-tsx`,children:`const dialogTitleId = 'dialog-confirmation-title'
const dialogDescriptionId = 'dialog-confirmation-description'

<M3Dialog
  opened={opened}
  role="dialog"
  aria-modal="true"
  aria-labelledby={dialogTitleId}
  aria-describedby={dialogDescriptionId}
  onToggle={setOpened}
>
  <M3Dialog.Icon>
    <M3Icon name="delete" appearance="outlined" />
  </M3Dialog.Icon>

  <M3Dialog.Header>
    <h3 id={dialogTitleId}>Permanently delete?</h3>
  </M3Dialog.Header>

  <p id={dialogDescriptionId}>
    Deleting the selected messages will also remove them from all synced devices.
  </p>

  <M3Dialog.Footer>
    <M3Button appearance="text" onClick={() => setOpened(false)}>
      Cancel
    </M3Button>

    <M3Button appearance="tonal" onClick={() => setOpened(false)}>
      Delete
    </M3Button>
  </M3Dialog.Footer>
</M3Dialog>
`})}),(0,C.jsx)(t.h2,{id:`resources`,children:`Resources`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:(0,C.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`M3 Dialogs overview`})}),`
`,(0,C.jsx)(t.li,{children:(0,C.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/guidelines`,rel:`nofollow`,children:`M3 Dialogs guidelines`})}),`
`,(0,C.jsx)(t.li,{children:(0,C.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Modal Dialog Pattern`})}),`
`]})]}),`
`,(0,C.jsxs)(c,{locale:`ru-RU`,children:[(0,C.jsx)(t.h1,{id:`диалоги`,children:`Диалоги`}),(0,C.jsx)(t.p,{children:`Диалоги сообщают важную информацию и блокируют основной интерфейс, пока пользователь не ответит.`}),(0,C.jsx)(t.h2,{id:`api-1`,children:`API`}),(0,C.jsx)(t.h3,{id:`когда-использовать`,children:`Когда использовать`}),(0,C.jsxs)(t.p,{children:[`Используйте `,(0,C.jsx)(t.code,{children:`M3Dialog`}),` для коротких прерывающих решений, которые требуют явного выбора перед продолжением работы со страницей. В терминах Material 3 это прежде всего подтверждения, уведомления и блокирующие задачи, а не длинные формы редактирования или навигация.`]}),(0,C.jsx)(t.h3,{id:`структура`,children:`Структура`}),(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`M3Dialog`}),` сохраняет одинаковую анатомию содержимого в React и Vue:`]}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`M3Dialog.Icon`}),` для ведущей визуальной подсказки`]}),`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`M3Dialog.Header`}),` для заголовка`]}),`
`,(0,C.jsx)(t.li,{children:`содержимое по умолчанию для поясняющего текста или компактных полей формы`}),`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`M3Dialog.Footer`}),` для наиболее важных действий`]}),`
`]}),(0,C.jsxs)(t.p,{children:[`Компонент построен поверх `,(0,C.jsx)(t.code,{children:`M3Surface`}),`, поэтому оформление и движение диалога согласованы с тем же языком модальных поверхностей, который используется боковыми панелями и композиционными историями.`]}),(0,C.jsx)(t.h3,{id:`особенности-реализации`,children:`Особенности реализации`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:`Обычные диалоги открываются как центрированные модальные поверхности со scrim.`}),`
`,(0,C.jsx)(t.li,{children:`Полноэкранные диалоги убирают scrim и занимают весь viewport.`}),`
`,(0,C.jsx)(t.li,{children:`Поверхность появляется с коротким fade-эффектом и небольшим движением вверх, соответствующим модальной анимации вложенных поверхностей.`}),`
`,(0,C.jsx)(t.li,{children:`Во время закрытия содержимое ненадолго остаётся смонтированным, чтобы анимация успела завершиться.`}),`
`]}),(0,C.jsx)(t.h2,{id:`доступность`,children:`Доступность`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsxs)(t.li,{children:[`Укажите `,(0,C.jsx)(t.code,{children:`role="dialog"`}),` или `,(0,C.jsx)(t.code,{children:`alertdialog`}),` для срочных подтверждений.`]}),`
`,(0,C.jsxs)(t.li,{children:[`Для модальных сценариев задайте `,(0,C.jsx)(t.code,{children:`aria-modal="true"`}),`.`]}),`
`,(0,C.jsxs)(t.li,{children:[`Свяжите заголовок и описание через `,(0,C.jsx)(t.code,{children:`aria-labelledby`}),` и `,(0,C.jsx)(t.code,{children:`aria-describedby`}),`.`]}),`
`,(0,C.jsx)(t.li,{children:`Пока диалог открыт, удерживайте фокус внутри него.`}),`
`,(0,C.jsx)(t.li,{children:`Используйте явные подписи действий, описывающие результат.`}),`
`]}),(0,C.jsx)(a,{children:(0,C.jsx)(`div`,{className:`mb-3`,children:(0,C.jsx)(y,{locale:`ru-RU`})})}),(0,C.jsx)(t.h2,{id:`рекомендации`,children:`Рекомендации`}),(0,C.jsx)(t.h3,{id:`плотность-содержимого`,children:`Плотность содержимого`}),(0,C.jsx)(t.p,{children:`Предпочитайте короткий заголовок, одно поясняющее сообщение и одно понятное основное действие. Если сценарию требуются большие формы, несколько прокручиваемых областей или навигация, боковая панель или отдельная страница обычно лучше передают смену состояния.`}),(0,C.jsx)(t.h3,{id:`действия`,children:`Действия`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:`Оставляйте окончательное решение в футере.`}),`
`,(0,C.jsx)(t.li,{children:`Явно обозначайте опасные действия и подписью, и расположением.`}),`
`,(0,C.jsxs)(t.li,{children:[`Предпочитайте вторичную кнопку отмены, например `,(0,C.jsx)(t.code,{children:`Отмена`}),`, вместо закрытия только по нажатию на scrim.`]}),`
`]}),(0,C.jsx)(t.h3,{id:`полноэкранный-режим`,children:`Полноэкранный режим`}),(0,C.jsxs)(t.p,{children:[`Используйте `,(0,C.jsx)(t.code,{children:`fullscreen`}),`, только если задаче нужен весь viewport или компактные размеры диалога ухудшают читаемость. Семантика диалога сохраняется, но визуально такой режим ближе к временной рабочей поверхности, чем к небольшому окну подтверждения.`]}),(0,C.jsx)(t.h2,{id:`пример-кода`,children:`Пример кода`}),(0,C.jsx)(t.pre,{children:(0,C.jsx)(t.code,{className:`language-tsx`,children:`const dialogTitleId = 'dialog-confirmation-title'
const dialogDescriptionId = 'dialog-confirmation-description'

<M3Dialog
  opened={opened}
  role="dialog"
  aria-modal="true"
  aria-labelledby={dialogTitleId}
  aria-describedby={dialogDescriptionId}
  onToggle={setOpened}
>
  <M3Dialog.Icon>
    <M3Icon name="delete" appearance="outlined" />
  </M3Dialog.Icon>

  <M3Dialog.Header>
    <h3 id={dialogTitleId}>Удалить навсегда?</h3>
  </M3Dialog.Header>

  <p id={dialogDescriptionId}>
    Выбранные сообщения также будут удалены со всех синхронизированных устройств.
  </p>

  <M3Dialog.Footer>
    <M3Button appearance="text" onClick={() => setOpened(false)}>
      Отмена
    </M3Button>

    <M3Button appearance="tonal" onClick={() => setOpened(false)}>
      Удалить
    </M3Button>
  </M3Dialog.Footer>
</M3Dialog>
`})}),(0,C.jsx)(t.h2,{id:`полезные-ссылки`,children:`Полезные ссылки`}),(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:(0,C.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`Обзор M3 Dialogs`})}),`
`,(0,C.jsx)(t.li,{children:(0,C.jsx)(t.a,{href:`https://m3.material.io/components/dialogs/guidelines`,rel:`nofollow`,children:`Рекомендации M3 Dialogs`})}),`
`,(0,C.jsx)(t.li,{children:(0,C.jsx)(t.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: шаблон модального диалога`})}),`
`]})]})]})}function S(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,C.jsx)(t,{...e,children:(0,C.jsx)(x,{...e})}):x(e)}var C;function w(){return(w=e((()=>{C=l(),r(),i(),b(),s()})))()}w();export{S as default};