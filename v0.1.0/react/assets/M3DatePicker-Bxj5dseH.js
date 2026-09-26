import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,n as i,o as a}from"./blocks-NwLwj9yT.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{a as s,c,i as l,l as u,n as d,o as f,r as p,s as m,t as h,u as g}from"./M3DatePicker.stories-D-yDQBL7.js";function _(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...t(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(a,{of:l}),`
`,(0,y.jsx)(n.h1,{id:`date-picker`,children:`Date Picker`}),`
`,(0,y.jsxs)(n.p,{children:[`Date pickers let people choose a single date from a calendar grid. `,(0,y.jsx)(n.code,{children:`M3DatePicker`}),` provides the calendar surface; docked field flows are composed with `,(0,y.jsx)(n.code,{children:`M3DatePickerField`}),`, and modal flows are composed with `,(0,y.jsx)(n.code,{children:`M3DatePickerDialog`}),`.`]}),`
`,(0,y.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,y.jsxs)(n.p,{children:[(0,y.jsx)(n.code,{children:`M3DatePicker`}),` is controlled by `,(0,y.jsx)(n.code,{children:`value`}),` and emits the selected date or date range through `,(0,y.jsx)(n.code,{children:`onChange`}),`. Use `,(0,y.jsx)(n.code,{children:`layout="docked"`}),` for Material's compact anchored surface; the default `,(0,y.jsx)(n.code,{children:`layout="modal"`}),` keeps the dialog-oriented header and geometry.`]}),`
`,(0,y.jsxs)(n.p,{children:[`Compose docked actions with `,(0,y.jsx)(n.code,{children:`M3DatePicker.Footer`}),`. The picker owns the footer container and hides it while a month or year selection list is open.`]}),`
`,(0,y.jsxs)(n.p,{children:[(0,y.jsx)(n.code,{children:`M3DatePickerField`}),` combines an `,(0,y.jsx)(n.code,{children:`M3TextField`}),`, a calendar icon button, and a docked popper. It keeps the date picker value as `,(0,y.jsx)(n.code,{children:`Date | null`}),`, accepts safe text-field props such as `,(0,y.jsx)(n.code,{children:`id`}),`, `,(0,y.jsx)(n.code,{children:`name`}),`, `,(0,y.jsx)(n.code,{children:`label`}),`, `,(0,y.jsx)(n.code,{children:`placeholder`}),`, `,(0,y.jsx)(n.code,{children:`invalid`}),`, `,(0,y.jsx)(n.code,{children:`disabled`}),`, `,(0,y.jsx)(n.code,{children:`readonly`}),`, and `,(0,y.jsx)(n.code,{children:`outlined`}),`, and normalizes typed dates to `,(0,y.jsx)(n.code,{children:`MM/DD/YYYY`}),`. Use the root `,(0,y.jsx)(n.code,{children:`className`}),`, `,(0,y.jsx)(n.code,{children:`popperClassName`}),`, and rich `,(0,y.jsx)(n.code,{children:`supportingText`}),` when a form needs local composition hooks without taking over date picker state.`]}),`
`,(0,y.jsxs)(n.p,{children:[`The docked field uses an outlined text field by default, opens the calendar in an elevated popup below the field, and keeps the popup interaction local to the form instead of interrupting the page with a modal dialog. A day click updates a local draft; Cancel discards it and OK commits it through `,(0,y.jsx)(n.code,{children:`onChange`}),`.`]}),`
`,(0,y.jsxs)(n.p,{children:[(0,y.jsx)(n.code,{children:`M3DatePickerDialog`}),` wraps the same calendar surface in a modal shell. It keeps a draft value while the dialog is open and commits it through `,(0,y.jsx)(n.code,{children:`onChange`}),` only after the user presses OK. Use `,(0,y.jsx)(n.code,{children:`appearance="input"`}),` to start from Material's modal date input layout; when `,(0,y.jsx)(n.code,{children:`switchable`}),` is enabled, users can switch between calendar and text input modes.`]}),`
`,(0,y.jsxs)(n.p,{children:[`Use `,(0,y.jsx)(n.code,{children:`firstDayOfWeek`}),` to shift the grid start, `,(0,y.jsx)(n.code,{children:`min`}),`/`,(0,y.jsx)(n.code,{children:`max`}),` to disable dates outside an allowed range, and `,(0,y.jsx)(n.code,{children:`availability`}),` for custom date/year availability rules. Modal layouts keep a stable six-week grid. Docked layouts follow the M3 surface height for the visible month and render only the required four, five, or six rows.`]}),`
`,(0,y.jsxs)(n.p,{children:[`The selected `,(0,y.jsx)(n.code,{children:`value`}),` and navigation `,(0,y.jsx)(n.code,{children:`cursor`}),` are separate states. Month arrows, month selection, year selection, and swipe navigation move only the cursor; they do not call `,(0,y.jsx)(n.code,{children:`onChange`}),` until a day is selected. Use `,(0,y.jsx)(n.code,{children:`cursor`}),` and `,(0,y.jsx)(n.code,{children:`onCursorChange`}),` when the calendar position must be controlled by parent state.`]}),`
`,(0,y.jsxs)(n.p,{children:[`Use `,(0,y.jsx)(n.code,{children:`navigation`}),` to choose the navigation surface and `,(0,y.jsx)(n.code,{children:`views`}),` to declare the reachable `,(0,y.jsx)(n.code,{children:`days`}),`, `,(0,y.jsx)(n.code,{children:`months`}),`, and `,(0,y.jsx)(n.code,{children:`years`}),` states. The default `,(0,y.jsx)(n.code,{children:`navigation="split"`}),` stays outside the swipe track; `,(0,y.jsx)(n.code,{children:`navigation="inline"`}),` places the controls inside each swipable month page; `,(0,y.jsx)(n.code,{children:`navigation="none"`}),` hides them. Horizontal swipe between available months is always enabled on the calendar grid.`]}),`
`,(0,y.jsx)(n.p,{children:`In the docked layout, month and year controls open separate vertical selection lists. The active list keeps its control enabled, disables the other control, and returns to the day grid after selection.`}),`
`,(0,y.jsx)(n.h2,{id:`accessibility-semantics`,children:`Accessibility Semantics`}),`
`,(0,y.jsxs)(n.ul,{children:[`
`,(0,y.jsxs)(n.li,{children:[`The root uses `,(0,y.jsx)(n.code,{children:`role="group"`}),` and is named by `,(0,y.jsx)(n.code,{children:`label`}),`.`]}),`
`,(0,y.jsxs)(n.li,{children:[`The days are exposed as a `,(0,y.jsx)(n.code,{children:`grid`}),` with one row per week.`]}),`
`,(0,y.jsxs)(n.li,{children:[`Grid month and year pickers use `,(0,y.jsx)(n.code,{children:`grid`}),` semantics; docked vertical selectors use explicit `,(0,y.jsx)(n.code,{children:`list`}),` and `,(0,y.jsx)(n.code,{children:`listitem`}),` roles through `,(0,y.jsx)(n.code,{children:`M3List`}),`.`]}),`
`,(0,y.jsxs)(n.li,{children:[`Each day is a native button with `,(0,y.jsx)(n.code,{children:`aria-selected`}),`.`]}),`
`,(0,y.jsxs)(n.li,{children:[`Disabled dates use native `,(0,y.jsx)(n.code,{children:`disabled`}),`.`]}),`
`,(0,y.jsxs)(n.li,{children:[`The month/year button uses `,(0,y.jsx)(n.code,{children:`aria-expanded`}),` while year selection is open.`]}),`
`,(0,y.jsxs)(n.li,{children:[`Modal flows use `,(0,y.jsx)(n.code,{children:`M3DatePickerDialog`}),`, which supplies dialog semantics through `,(0,y.jsx)(n.code,{children:`M3Dialog`}),`.`]}),`
`]}),`
`,(0,y.jsx)(n.h2,{id:`story-guide`,children:`Story Guide`}),`
`,(0,y.jsxs)(n.ul,{children:[`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--standard`,children:`Standard`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--monday-first`,children:`Monday First`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--restricted-range`,children:`Restricted Range`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--availability`,children:`Availability`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--range-selection`,children:`Range Selection`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--controlled-cursor`,children:`Controlled Cursor`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--without-navigation`,children:`Without Navigation`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--without-year-view`,children:`Without Year View`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--swipe-navigation`,children:`Swipe Navigation`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--inline-navigation`,children:`Inline Navigation`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--docked-field`,children:`Docked Field`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--modal-composition`,children:`Modal Composition`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`?path=/story/components-m3datepicker--modal-date-input`,children:`Modal Date Input`})}),`
`]}),`
`,(0,y.jsx)(n.h2,{id:`demo`,children:`Demo`}),`
`,(0,y.jsx)(i,{of:c}),`
`,(0,y.jsx)(i,{of:m}),`
`,(0,y.jsx)(i,{of:h}),`
`,(0,y.jsx)(i,{of:f}),`
`,(0,y.jsx)(i,{of:d}),`
`,(0,y.jsx)(i,{of:p}),`
`,(0,y.jsx)(i,{of:s}),`
`,(0,y.jsx)(i,{of:u}),`
`,(0,y.jsx)(n.h2,{id:`usage-guidance`,children:`Usage Guidance`}),`
`,(0,y.jsx)(n.p,{children:`Use the inline picker when the calendar is already the main task. Use modal composition when date selection interrupts a form or a compact workflow.`}),`
`,(0,y.jsx)(n.p,{children:`Use the docked field when date selection is part of a form and the selected value must remain visible in the field.`}),`
`,(0,y.jsx)(n.p,{children:`Keep range constraints visible through disabled dates instead of hiding days, so the month grid remains predictable.`}),`
`,(0,y.jsx)(n.h2,{id:`docked-field-example`,children:`Docked field example`}),`
`,(0,y.jsx)(n.pre,{children:(0,y.jsx)(n.code,{className:`language-tsx`,children:`const [date, setDate] = useState<Date | null>(new Date(2026, 6, 10))

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
`})}),`
`,(0,y.jsx)(n.h2,{id:`modal-dialog-example`,children:`Modal dialog example`}),`
`,(0,y.jsx)(n.pre,{children:(0,y.jsx)(n.code,{className:`language-tsx`,children:`const [opened, setOpened] = useState(false)
const [date, setDate] = useState<Date | null>(new Date(2026, 6, 10))

<M3DatePickerDialog
  opened={opened}
  value={date}
  label="Trip date"
  onToggle={setOpened}
  onChange={setDate}
/>
`})}),`
`,(0,y.jsx)(n.h2,{id:`modal-date-input-example`,children:`Modal date input example`}),`
`,(0,y.jsx)(n.pre,{children:(0,y.jsx)(n.code,{className:`language-tsx`,children:`<M3DatePickerDialog
  opened={opened}
  appearance="input"
  value={date}
  label="Trip date"
  onToggle={setOpened}
  onChange={setDate}
/>
`})}),`
`,(0,y.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,y.jsxs)(n.ul,{children:[`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`https://m3.material.io/components/date-pickers/overview`,rel:`nofollow`,children:`M3 Date pickers overview`})}),`
`,(0,y.jsx)(n.li,{children:(0,y.jsx)(n.a,{href:`https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`,rel:`nofollow`,children:`WAI-ARIA APG: Dialog Modal Pattern`})}),`
`]})]})}function v(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,y.jsx)(n,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;function b(){return(b=e((()=>{y=o(),n(),r(),g()})))()}b();export{v as default};