import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i}from"./blocks-NwLwj9yT.js";import{i as a,r as o}from"./iframe-wale67Qv.js";import{t as s}from"./jsx-runtime-DeHZSEgm.js";import{n as c,t as l}from"./M3SideSheet.stories-D_8pk2QW.js";function u(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(i,{of:l}),`
`,(0,f.jsxs)(o,{locale:`en-US`,children:[(0,f.jsx)(n.h1,{id:`side-sheets`,children:`Side Sheets`}),(0,f.jsxs)(n.p,{children:[`Side sheets extend `,(0,f.jsx)(n.code,{children:`M3Surface`}),` into a right-edge panel with dedicated header, scrollable content area, and optional footer actions.`]}),(0,f.jsx)(n.h2,{id:`api`,children:`API`}),(0,f.jsx)(n.h3,{id:`when-to-use`,children:`When to use`}),(0,f.jsxs)(n.p,{children:[`Use `,(0,f.jsx)(n.code,{children:`M3SideSheet`}),` when the user needs supplemental context, filters, or secondary editing controls while keeping the main task visible. Compared with dialogs, side sheets are better for medium-density supporting content that still belongs to the current page.`]}),(0,f.jsx)(n.h3,{id:`modes-in-this-implementation`,children:`Modes in this implementation`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:`Standard mode opens as a modal sheet over the page.`}),`
`,(0,f.jsx)(n.li,{children:`Docked mode keeps the sheet in layout as a persistent companion region.`}),`
`]}),(0,f.jsx)(n.p,{children:`This follows the Material 3 distinction between temporary supporting surfaces and page-participating companion surfaces.`}),(0,f.jsx)(n.h3,{id:`content-anatomy`,children:`Content anatomy`}),(0,f.jsxs)(n.p,{children:[(0,f.jsx)(n.code,{children:`M3SideSheet`}),` gives you dedicated composition slots:`]}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.code,{children:`M3SideSheet.Title`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.code,{children:`M3SideSheet.CloseIcon`})}),`
`,(0,f.jsx)(n.li,{children:`default body content`}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.code,{children:`M3SideSheet.Footer`})}),`
`]}),(0,f.jsx)(n.p,{children:`The header and footer stay structurally distinct from the scrollable content region, so actions and dismiss affordances remain discoverable while the body changes.`}),(0,f.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility semantics`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsxs)(n.li,{children:[`Use a clear title so the sheet can expose `,(0,f.jsx)(n.code,{children:`aria-labelledby`}),`.`]}),`
`,(0,f.jsx)(n.li,{children:`Keep close affordances discoverable through the close button and, in modal mode, the scrim.`}),`
`,(0,f.jsx)(n.li,{children:`Reserve footer actions for final or high-signal decisions.`}),`
`,(0,f.jsx)(n.li,{children:`Treat modal side sheets as interruptive overlays and docked sheets as companion layout regions.`}),`
`]}),(0,f.jsx)(n.h2,{id:`stories`,children:`Stories`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`?path=/story/components-m3sidesheet--standard`,children:`Standard`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`?path=/story/components-m3sidesheet--docked`,children:`Docked`})}),`
`]}),(0,f.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),(0,f.jsx)(n.h3,{id:`standard-vs-docked`,children:`Standard vs docked`}),(0,f.jsxs)(n.p,{children:[`Choose `,(0,f.jsx)(n.code,{children:`docked`}),` when the page should continuously reserve space for the sheet and the surface is part of the working layout. Choose modal mode when the same content should feel temporary, dismissible, and layered above the page.`]}),(0,f.jsx)(n.h3,{id:`footer-usage`,children:`Footer usage`}),(0,f.jsx)(n.p,{children:`Use the footer for apply, save, or clear actions that summarize the sheet's purpose. Avoid turning the footer into a second content area; supporting explanation belongs in the body.`}),(0,f.jsx)(n.h3,{id:`dismissal`,children:`Dismissal`}),(0,f.jsx)(n.p,{children:`In modal mode, users should be able to close the sheet from the close icon and by leaving the sheet context. In docked mode, think of hide/show as a layout state change rather than as a modal dismissal.`}),(0,f.jsx)(n.h2,{id:`code-example`,children:`Code example`}),(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-tsx`,children:`<M3SideSheet shown={shown} onToggle={setShown}>
  <M3SideSheet.Title>
    Filters
  </M3SideSheet.Title>

  <M3SideSheet.CloseIcon>
    <M3Icon name="close" />
  </M3SideSheet.CloseIcon>

  <p className="m-4">Choose filters and apply changes.</p>

  <M3SideSheet.Footer>
    <div className="p-4">Footer actions</div>
  </M3SideSheet.Footer>
</M3SideSheet>
`})}),(0,f.jsx)(n.h2,{id:`resources`,children:`Resources`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`https://m3.material.io/components/side-sheets/overview`,rel:`nofollow`,children:`M3 Side sheets overview`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`https://m3.material.io/components/side-sheets/guidelines`,rel:`nofollow`,children:`M3 Side sheets guidelines`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Dialog (Modal) Pattern`})}),`
`]})]}),`
`,(0,f.jsxs)(o,{locale:`ru-RU`,children:[(0,f.jsx)(n.h1,{id:`боковые-панели`,children:`Боковые панели`}),(0,f.jsxs)(n.p,{children:[(0,f.jsx)(n.code,{children:`M3SideSheet`}),` расширяет `,(0,f.jsx)(n.code,{children:`M3Surface`}),` правой панелью с отдельным заголовком, прокручиваемым содержимым и необязательными действиями в footer.`]}),(0,f.jsx)(n.h2,{id:`api-1`,children:`API`}),(0,f.jsx)(n.h3,{id:`когда-использовать`,children:`Когда использовать`}),(0,f.jsxs)(n.p,{children:[`Используйте `,(0,f.jsx)(n.code,{children:`M3SideSheet`}),` для дополнительного контекста, фильтров и вторичного редактирования с сохранением видимой основной задачи. По сравнению с диалогом side sheet лучше подходит для вспомогательного содержимого средней плотности.`]}),(0,f.jsx)(n.h3,{id:`режимы`,children:`Режимы`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:`стандартный режим открывает модальную панель поверх страницы`}),`
`,(0,f.jsxs)(n.li,{children:[(0,f.jsx)(n.code,{children:`docked`}),` сохраняет панель в компоновке как постоянную область`]}),`
`]}),(0,f.jsx)(n.h3,{id:`структура-содержимого`,children:`Структура содержимого`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.code,{children:`M3SideSheet.Title`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.code,{children:`M3SideSheet.CloseIcon`})}),`
`,(0,f.jsx)(n.li,{children:`основное содержимое`}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.code,{children:`M3SideSheet.Footer`})}),`
`]}),(0,f.jsx)(n.p,{children:`Заголовок и footer отделены от прокручиваемой области, поэтому действия остаются доступными при изменении содержимого.`}),(0,f.jsx)(n.h2,{id:`доступность`,children:`Доступность`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsxs)(n.li,{children:[`Используйте ясный заголовок для `,(0,f.jsx)(n.code,{children:`aria-labelledby`}),`.`]}),`
`,(0,f.jsx)(n.li,{children:`Делайте кнопку закрытия заметной; в модальном режиме поддерживайте закрытие через scrim.`}),`
`,(0,f.jsx)(n.li,{children:`Оставляйте в footer итоговые или наиболее важные действия.`}),`
`,(0,f.jsx)(n.li,{children:`Считайте модальную панель оверлеем, а docked-панель — частью компоновки.`}),`
`]}),(0,f.jsx)(n.h2,{id:`примеры-в-storybook`,children:`Примеры в Storybook`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`?path=/story/components-m3sidesheet--standard`,children:`Стандартная`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`?path=/story/components-m3sidesheet--docked`,children:`Закреплённая`})}),`
`]}),(0,f.jsx)(n.h2,{id:`рекомендации`,children:`Рекомендации`}),(0,f.jsxs)(n.p,{children:[`Выбирайте `,(0,f.jsx)(n.code,{children:`docked`}),`, когда страница должна постоянно резервировать место для панели. Модальный режим подходит для временного, закрываемого содержимого поверх страницы.`]}),(0,f.jsx)(n.p,{children:`Используйте footer для применения, сохранения и очистки; пояснения оставляйте в основной области.`}),(0,f.jsx)(n.h2,{id:`пример-кода`,children:`Пример кода`}),(0,f.jsx)(n.pre,{children:(0,f.jsx)(n.code,{className:`language-tsx`,children:`<M3SideSheet shown={shown} onToggle={setShown}>
  <M3SideSheet.Title>Фильтры</M3SideSheet.Title>
  <M3SideSheet.CloseIcon><M3Icon name="close" /></M3SideSheet.CloseIcon>
  <p className="m-4">Выберите фильтры и примените изменения.</p>
  <M3SideSheet.Footer><div className="p-4">Действия</div></M3SideSheet.Footer>
</M3SideSheet>
`})}),(0,f.jsx)(n.h2,{id:`полезные-ссылки`,children:`Полезные ссылки`}),(0,f.jsxs)(n.ul,{children:[`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`https://m3.material.io/components/side-sheets/overview`,rel:`nofollow`,children:`Обзор M3 Side sheets`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`https://m3.material.io/components/side-sheets/guidelines`,rel:`nofollow`,children:`Рекомендации M3 Side sheets`})}),`
`,(0,f.jsx)(n.li,{children:(0,f.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: паттерн Dialog`})}),`
`]})]})]})}function d(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,f.jsx)(n,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=s(),n(),r(),a(),c()})))()}p();export{d as default};