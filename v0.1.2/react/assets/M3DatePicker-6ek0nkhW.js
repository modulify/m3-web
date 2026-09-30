import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,n as i,o as a}from"./blocks-NwLwj9yT.js";import{i as o,r as s}from"./iframe-wale67Qv.js";import{t as c}from"./jsx-runtime-DeHZSEgm.js";import{a as l,c as u,i as d,l as f,n as p,o as m,r as h,s as g,t as _,u as v}from"./M3DatePicker.stories-Crb_5pIV.js";function y(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(a,{of:d}),`
`,(0,x.jsxs)(s,{locale:`en-US`,children:[(0,x.jsx)(n.h1,{id:`date-picker`,children:`Date Picker`}),(0,x.jsxs)(n.p,{children:[`Date pickers let people choose a single date from a calendar grid. `,(0,x.jsx)(n.code,{children:`M3DatePicker`}),` provides the calendar surface; docked field flows are composed with `,(0,x.jsx)(n.code,{children:`M3DatePickerField`}),`, and modal flows are composed with `,(0,x.jsx)(n.code,{children:`M3DatePickerDialog`}),`.`]}),(0,x.jsx)(n.h2,{id:`api`,children:`API`}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`M3DatePicker`}),` is controlled by `,(0,x.jsx)(n.code,{children:`value`}),` and emits the selected date or date range through `,(0,x.jsx)(n.code,{children:`onChange`}),`. Use `,(0,x.jsx)(n.code,{children:`layout="docked"`}),` for Material's compact anchored surface; the default `,(0,x.jsx)(n.code,{children:`layout="modal"`}),` keeps the dialog-oriented header and geometry.`]}),(0,x.jsxs)(n.p,{children:[`Compose docked actions with `,(0,x.jsx)(n.code,{children:`M3DatePicker.Footer`}),`. The picker owns the footer container and hides it while a month or year selection list is open.`]}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`M3DatePickerField`}),` combines an `,(0,x.jsx)(n.code,{children:`M3TextField`}),`, a calendar icon button, and a docked popper. It keeps the date picker value as `,(0,x.jsx)(n.code,{children:`Date | null`}),`, accepts safe text-field props such as `,(0,x.jsx)(n.code,{children:`id`}),`, `,(0,x.jsx)(n.code,{children:`name`}),`, `,(0,x.jsx)(n.code,{children:`label`}),`, `,(0,x.jsx)(n.code,{children:`placeholder`}),`, `,(0,x.jsx)(n.code,{children:`invalid`}),`, `,(0,x.jsx)(n.code,{children:`disabled`}),`, `,(0,x.jsx)(n.code,{children:`readonly`}),`, and `,(0,x.jsx)(n.code,{children:`outlined`}),`, and normalizes typed dates to `,(0,x.jsx)(n.code,{children:`MM/DD/YYYY`}),`. Use the root `,(0,x.jsx)(n.code,{children:`className`}),`, `,(0,x.jsx)(n.code,{children:`popperClassName`}),`, and rich `,(0,x.jsx)(n.code,{children:`supportingText`}),` when a form needs local composition hooks without taking over date picker state.`]}),(0,x.jsxs)(n.p,{children:[`The docked field uses an outlined text field by default, opens the calendar in an elevated popup below the field, and keeps the popup interaction local to the form instead of interrupting the page with a modal dialog. A day click updates a local draft; Cancel discards it and OK commits it through `,(0,x.jsx)(n.code,{children:`onChange`}),`.`]}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`M3DatePickerDialog`}),` wraps the same calendar surface in a modal shell. It keeps a draft value while the dialog is open and commits it through `,(0,x.jsx)(n.code,{children:`onChange`}),` only after the user presses OK. Use `,(0,x.jsx)(n.code,{children:`appearance="input"`}),` to start from Material's modal date input layout; when `,(0,x.jsx)(n.code,{children:`switchable`}),` is enabled, users can switch between calendar and text input modes.`]}),(0,x.jsxs)(n.p,{children:[`Use `,(0,x.jsx)(n.code,{children:`firstDayOfWeek`}),` to shift the grid start, `,(0,x.jsx)(n.code,{children:`min`}),`/`,(0,x.jsx)(n.code,{children:`max`}),` to disable dates outside an allowed range, and `,(0,x.jsx)(n.code,{children:`availability`}),` for custom date/year availability rules. Modal layouts keep a stable six-week grid. Docked layouts follow the M3 surface height for the visible month and render only the required four, five, or six rows.`]}),(0,x.jsxs)(n.p,{children:[`The selected `,(0,x.jsx)(n.code,{children:`value`}),` and navigation `,(0,x.jsx)(n.code,{children:`cursor`}),` are separate states. Month arrows, month selection, year selection, and swipe navigation move only the cursor; they do not call `,(0,x.jsx)(n.code,{children:`onChange`}),` until a day is selected. Use `,(0,x.jsx)(n.code,{children:`cursor`}),` and `,(0,x.jsx)(n.code,{children:`onCursorChange`}),` when the calendar position must be controlled by parent state.`]}),(0,x.jsxs)(n.p,{children:[`Use `,(0,x.jsx)(n.code,{children:`navigation`}),` to choose the navigation surface and `,(0,x.jsx)(n.code,{children:`views`}),` to declare the reachable `,(0,x.jsx)(n.code,{children:`days`}),`, `,(0,x.jsx)(n.code,{children:`months`}),`, and `,(0,x.jsx)(n.code,{children:`years`}),` states. The default `,(0,x.jsx)(n.code,{children:`navigation="split"`}),` stays outside the swipe track; `,(0,x.jsx)(n.code,{children:`navigation="inline"`}),` places the controls inside each swipable month page; `,(0,x.jsx)(n.code,{children:`navigation="none"`}),` hides them. Horizontal swipe between available months is always enabled on the calendar grid.`]}),(0,x.jsx)(n.p,{children:`In the docked layout, month and year controls open separate vertical selection lists. The active list keeps its control enabled, disables the other control, and returns to the day grid after selection.`}),(0,x.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility Semantics`}),(0,x.jsxs)(n.ul,{children:[`
`,(0,x.jsxs)(n.li,{children:[`The root uses `,(0,x.jsx)(n.code,{children:`role="group"`}),` and is named by `,(0,x.jsx)(n.code,{children:`label`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`The days are exposed as a `,(0,x.jsx)(n.code,{children:`grid`}),` with one row per week.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Grid month and year pickers use `,(0,x.jsx)(n.code,{children:`grid`}),` semantics; docked vertical selectors use explicit `,(0,x.jsx)(n.code,{children:`list`}),` and `,(0,x.jsx)(n.code,{children:`listitem`}),` roles through `,(0,x.jsx)(n.code,{children:`M3List`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Each day is a native button with `,(0,x.jsx)(n.code,{children:`aria-selected`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Disabled dates use native `,(0,x.jsx)(n.code,{children:`disabled`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`The month/year button uses `,(0,x.jsx)(n.code,{children:`aria-expanded`}),` while year selection is open.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Modal flows use `,(0,x.jsx)(n.code,{children:`M3DatePickerDialog`}),`, which supplies dialog semantics through `,(0,x.jsx)(n.code,{children:`M3Dialog`}),`.`]}),`
`]}),(0,x.jsx)(n.h2,{id:`story-guide`,children:`Story Guide`}),(0,x.jsxs)(n.ul,{children:[`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--standard`,children:`Standard`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--monday-first`,children:`Monday First`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--restricted-range`,children:`Restricted Range`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--availability`,children:`Availability`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--range-selection`,children:`Range Selection`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--controlled-cursor`,children:`Controlled Cursor`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--without-navigation`,children:`Without Navigation`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--without-year-view`,children:`Without Year View`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--swipe-navigation`,children:`Swipe Navigation`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--inline-navigation`,children:`Inline Navigation`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--docked-field`,children:`Docked Field`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--modal-composition`,children:`Modal Composition`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--modal-date-input`,children:`Modal Date Input`})}),`
`]}),(0,x.jsx)(n.h2,{id:`demo`,children:`Demo`}),(0,x.jsx)(i,{of:u}),(0,x.jsx)(i,{of:g}),(0,x.jsx)(i,{of:_}),(0,x.jsx)(i,{of:m}),(0,x.jsx)(i,{of:p}),(0,x.jsx)(i,{of:h}),(0,x.jsx)(i,{of:l}),(0,x.jsx)(i,{of:f}),(0,x.jsx)(n.h2,{id:`usage-guidance`,children:`Usage Guidance`}),(0,x.jsx)(n.p,{children:`Use the inline picker when the calendar is already the main task. Use modal composition when date selection interrupts a form or a compact workflow.`}),(0,x.jsx)(n.p,{children:`Use the docked field when date selection is part of a form and the selected value must remain visible in the field.`}),(0,x.jsx)(n.p,{children:`Keep range constraints visible through disabled dates instead of hiding days, so the month grid remains predictable.`}),(0,x.jsx)(n.h2,{id:`docked-field-example`,children:`Docked field example`}),(0,x.jsx)(n.pre,{children:(0,x.jsx)(n.code,{className:`language-tsx`,children:`const [date, setDate] = useState<Date | null>(new Date(2026, 6, 10))

<M3DatePickerField
  value={date}
  min={new Date(2026, 6, 3)}
  max={new Date(2026, 6, 24)}
  label="Trip date"
  name="trip_date"
  supportingText={<span>MM/DD/YYYY</span>}
  className="trip-date"
  popperClassName={['trip-date-popper', { 'trip-date-popper_open': true }]}
  placeholder="MM/DD/YYYY"
  onChange={setDate}
/>
`})}),(0,x.jsx)(n.h2,{id:`modal-dialog-example`,children:`Modal dialog example`}),(0,x.jsx)(n.pre,{children:(0,x.jsx)(n.code,{className:`language-tsx`,children:`const [opened, setOpened] = useState(false)
const [date, setDate] = useState<Date | null>(new Date(2026, 6, 10))

<M3DatePickerDialog
  opened={opened}
  value={date}
  label="Trip date"
  onToggle={setOpened}
  onChange={setDate}
/>
`})}),(0,x.jsx)(n.h2,{id:`modal-date-input-example`,children:`Modal date input example`}),(0,x.jsx)(n.pre,{children:(0,x.jsx)(n.code,{className:`language-tsx`,children:`<M3DatePickerDialog
  opened={opened}
  appearance="input"
  value={date}
  label="Trip date"
  onToggle={setOpened}
  onChange={setDate}
/>
`})}),(0,x.jsx)(n.h2,{id:`resources`,children:`Resources`}),(0,x.jsxs)(n.ul,{children:[`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`https://m3.material.io/components/date-pickers/overview`,rel:`nofollow`,children:`M3 Date pickers overview`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Dialog Modal Pattern`})}),`
`]})]}),`
`,(0,x.jsxs)(s,{locale:`ru-RU`,children:[(0,x.jsx)(n.h1,{id:`выбор-даты`,children:`Выбор даты`}),(0,x.jsxs)(n.p,{children:[`Компоненты выбора даты позволяют выбрать одну дату в календарной сетке. `,(0,x.jsx)(n.code,{children:`M3DatePicker`}),` предоставляет поверхность календаря, сценарии с закреплённым полем собираются с помощью `,(0,x.jsx)(n.code,{children:`M3DatePickerField`}),`, а модальные сценарии — с помощью `,(0,x.jsx)(n.code,{children:`M3DatePickerDialog`}),`.`]}),(0,x.jsx)(n.h2,{id:`api-1`,children:`API`}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`M3DatePicker`}),` управляется через `,(0,x.jsx)(n.code,{children:`value`}),` и передаёт выбранную дату или диапазон в `,(0,x.jsx)(n.code,{children:`onChange`}),`. Используйте `,(0,x.jsx)(n.code,{children:`layout="docked"`}),` для компактной закреплённой поверхности Material; стандартный `,(0,x.jsx)(n.code,{children:`layout="modal"`}),` сохраняет заголовок и геометрию модального варианта.`]}),(0,x.jsxs)(n.p,{children:[`Действия закреплённого календаря можно собрать через `,(0,x.jsx)(n.code,{children:`M3DatePicker.Footer`}),`. Компонент сам управляет контейнером футера и скрывает его, пока открыт список месяцев или лет.`]}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`M3DatePickerField`}),` объединяет `,(0,x.jsx)(n.code,{children:`M3TextField`}),`, кнопку с иконкой календаря и закреплённый popper. Значение остаётся типа `,(0,x.jsx)(n.code,{children:`Date | null`}),`; поддерживаются безопасные свойства текстового поля, включая `,(0,x.jsx)(n.code,{children:`id`}),`, `,(0,x.jsx)(n.code,{children:`name`}),`, `,(0,x.jsx)(n.code,{children:`label`}),`, `,(0,x.jsx)(n.code,{children:`placeholder`}),`, `,(0,x.jsx)(n.code,{children:`invalid`}),`, `,(0,x.jsx)(n.code,{children:`disabled`}),`, `,(0,x.jsx)(n.code,{children:`readonly`}),` и `,(0,x.jsx)(n.code,{children:`outlined`}),`. Введённые даты нормализуются в `,(0,x.jsx)(n.code,{children:`MM/DD/YYYY`}),`. Корневой `,(0,x.jsx)(n.code,{children:`className`}),`, `,(0,x.jsx)(n.code,{children:`popperClassName`}),` и составной `,(0,x.jsx)(n.code,{children:`supportingText`}),` дают локальные точки расширения формы, не перехватывая состояние календаря.`]}),(0,x.jsxs)(n.p,{children:[`По умолчанию закреплённое поле использует outlined-вариант и открывает календарь в приподнятом popup под полем. Нажатие на день меняет локальный черновик: Cancel отменяет его, а OK передаёт результат в `,(0,x.jsx)(n.code,{children:`onChange`}),`.`]}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`M3DatePickerDialog`}),` оборачивает тот же календарь в модальную оболочку. Пока диалог открыт, значение хранится как черновик и попадает в `,(0,x.jsx)(n.code,{children:`onChange`}),` только после нажатия OK. `,(0,x.jsx)(n.code,{children:`appearance="input"`}),` включает модальный ввод даты Material; при включённом `,(0,x.jsx)(n.code,{children:`switchable`}),` можно переключаться между календарём и текстовым вводом.`]}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`firstDayOfWeek`}),` задаёт первый день недели, `,(0,x.jsx)(n.code,{children:`min`}),` и `,(0,x.jsx)(n.code,{children:`max`}),` отключают даты вне диапазона, а `,(0,x.jsx)(n.code,{children:`availability`}),` описывает дополнительные правила доступности дат и лет. Модальная раскладка всегда содержит шесть недель. Высота закреплённой раскладки следует поверхности M3 и показывает только необходимые четыре, пять или шесть строк.`]}),(0,x.jsxs)(n.p,{children:[`Выбранное `,(0,x.jsx)(n.code,{children:`value`}),` и навигационный `,(0,x.jsx)(n.code,{children:`cursor`}),` — независимые состояния. Стрелки, выбор месяца или года и свайп двигают только курсор; `,(0,x.jsx)(n.code,{children:`onChange`}),` вызывается лишь после выбора дня. Используйте `,(0,x.jsx)(n.code,{children:`cursor`}),` и `,(0,x.jsx)(n.code,{children:`onCursorChange`}),`, когда положением календаря управляет родитель.`]}),(0,x.jsxs)(n.p,{children:[(0,x.jsx)(n.code,{children:`navigation`}),` задаёт вид навигации, а `,(0,x.jsx)(n.code,{children:`views`}),` — доступные состояния `,(0,x.jsx)(n.code,{children:`days`}),`, `,(0,x.jsx)(n.code,{children:`months`}),` и `,(0,x.jsx)(n.code,{children:`years`}),`. Стандартный `,(0,x.jsx)(n.code,{children:`navigation="split"`}),` остаётся вне области свайпа; `,(0,x.jsx)(n.code,{children:`navigation="inline"`}),` помещает управление внутрь каждой страницы месяца; `,(0,x.jsx)(n.code,{children:`navigation="none"`}),` скрывает его. Горизонтальный свайп между доступными месяцами всегда работает на календарной сетке.`]}),(0,x.jsx)(n.p,{children:`В закреплённой раскладке выбор месяца и года открывает отдельные вертикальные списки. Активный список сохраняет свою кнопку доступной, отключает другую и после выбора возвращает сетку дней.`}),(0,x.jsx)(n.h2,{id:`доступность`,children:`Доступность`}),(0,x.jsxs)(n.ul,{children:[`
`,(0,x.jsxs)(n.li,{children:[`Корень использует `,(0,x.jsx)(n.code,{children:`role="group"`}),` и получает доступное имя из `,(0,x.jsx)(n.code,{children:`label`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Дни представлены как `,(0,x.jsx)(n.code,{children:`grid`}),` с одной строкой на неделю.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Сетки выбора месяца и года используют семантику `,(0,x.jsx)(n.code,{children:`grid`}),`; закреплённые вертикальные селекторы — явные роли `,(0,x.jsx)(n.code,{children:`list`}),` и `,(0,x.jsx)(n.code,{children:`listitem`}),` через `,(0,x.jsx)(n.code,{children:`M3List`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Каждый день — нативная кнопка с `,(0,x.jsx)(n.code,{children:`aria-selected`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Недоступные даты используют нативный `,(0,x.jsx)(n.code,{children:`disabled`}),`.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Кнопка месяца и года использует `,(0,x.jsx)(n.code,{children:`aria-expanded`}),`, пока открыт выбор года.`]}),`
`,(0,x.jsxs)(n.li,{children:[`Модальные сценарии используют `,(0,x.jsx)(n.code,{children:`M3DatePickerDialog`}),`, который получает семантику диалога через `,(0,x.jsx)(n.code,{children:`M3Dialog`}),`.`]}),`
`]}),(0,x.jsx)(n.h2,{id:`примеры-в-storybook`,children:`Примеры в Storybook`}),(0,x.jsxs)(n.ul,{children:[`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--standard`,children:`Стандартная`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--monday-first`,children:`Неделя с понедельника`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--restricted-range`,children:`Ограниченный диапазон`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--availability`,children:`Доступность дат`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--range-selection`,children:`Выбор диапазона`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--controlled-cursor`,children:`Управляемый курсор`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--without-navigation`,children:`Без навигации`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--without-year-view`,children:`Без выбора года`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--swipe-navigation`,children:`Навигация свайпом`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--inline-navigation`,children:`Встроенная навигация`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--docked-field`,children:`Закреплённое поле`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--modal-composition`,children:`Модальная композиция`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`?path=/story/components-m3datepicker--modal-date-input`,children:`Модальный ввод даты`})}),`
`]}),(0,x.jsx)(n.h2,{id:`демонстрация`,children:`Демонстрация`}),(0,x.jsx)(i,{of:u}),(0,x.jsx)(i,{of:g}),(0,x.jsx)(i,{of:_}),(0,x.jsx)(i,{of:m}),(0,x.jsx)(i,{of:p}),(0,x.jsx)(i,{of:h}),(0,x.jsx)(i,{of:l}),(0,x.jsx)(i,{of:f}),(0,x.jsx)(n.h2,{id:`рекомендации`,children:`Рекомендации`}),(0,x.jsx)(n.p,{children:`Используйте встроенный календарь, когда выбор даты — основная задача. Модальная композиция подходит, когда выбор даты временно прерывает работу с формой или компактным сценарием.`}),(0,x.jsx)(n.p,{children:`Закреплённое поле уместно внутри формы, когда выбранное значение должно оставаться видимым.`}),(0,x.jsx)(n.p,{children:`Показывайте ограничения диапазона через отключённые даты, а не скрывайте дни: так сетка месяца остаётся предсказуемой.`}),(0,x.jsx)(n.h2,{id:`пример-закреплённого-поля`,children:`Пример закреплённого поля`}),(0,x.jsx)(n.pre,{children:(0,x.jsx)(n.code,{className:`language-tsx`,children:`const [date, setDate] = useState<Date | null>(new Date(2026, 6, 10))

<M3DatePickerField
  value={date}
  min={new Date(2026, 6, 3)}
  max={new Date(2026, 6, 24)}
  label="Дата поездки"
  name="trip_date"
  supportingText={<span>MM/DD/YYYY</span>}
  className="trip-date"
  popperClassName={['trip-date-popper', { 'trip-date-popper_open': true }]}
  placeholder="MM/DD/YYYY"
  onChange={setDate}
/>
`})}),(0,x.jsx)(n.h2,{id:`пример-модального-диалога`,children:`Пример модального диалога`}),(0,x.jsx)(n.pre,{children:(0,x.jsx)(n.code,{className:`language-tsx`,children:`const [opened, setOpened] = useState(false)
const [date, setDate] = useState<Date | null>(new Date(2026, 6, 10))

<M3DatePickerDialog
  opened={opened}
  value={date}
  label="Дата поездки"
  onToggle={setOpened}
  onChange={setDate}
/>
`})}),(0,x.jsx)(n.h2,{id:`пример-модального-ввода-даты`,children:`Пример модального ввода даты`}),(0,x.jsx)(n.pre,{children:(0,x.jsx)(n.code,{className:`language-tsx`,children:`<M3DatePickerDialog
  opened={opened}
  appearance="input"
  value={date}
  label="Дата поездки"
  onToggle={setOpened}
  onChange={setDate}
/>
`})}),(0,x.jsx)(n.h2,{id:`полезные-ссылки`,children:`Полезные ссылки`}),(0,x.jsxs)(n.ul,{children:[`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`https://m3.material.io/components/date-pickers/overview`,rel:`nofollow`,children:`Обзор M3 Date pickers`})}),`
`,(0,x.jsx)(n.li,{children:(0,x.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: шаблон модального диалога`})}),`
`]})]})]})}function b(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,x.jsx)(n,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;function S(){return(S=e((()=>{x=c(),n(),r(),o(),v()})))()}S();export{b as default};