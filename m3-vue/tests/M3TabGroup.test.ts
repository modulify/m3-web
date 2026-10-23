import type { PropType } from 'vue'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { Fragment, h, ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { waitFor } from '@testing-library/vue'

import { M3Tab, M3TabGroup } from '@/components/tabs'

const Tabs = defineComponent({
  props: { value: { type: String, default: undefined } },
  emits: ['change'],
  setup (props, { emit }) {
    return () => h(M3TabGroup, {
      'aria-label': 'Sections',
      value: props.value,
      onChange: (value: string) => emit('change', value),
    }, {
      default: () => [
        h(M3Tab, { value: 'inbox', label: 'Inbox', badge: '24' }, { default: () => 'Inbox content' }),
        h(M3Tab, { value: 'drafts', label: 'Drafts' }, { default: () => 'Draft content' }),
        h(M3Tab, { value: 'trash', label: 'Trash', disabled: true }, { default: () => 'Trash content' }),
      ],
    })
  },
})

const DynamicTabs = defineComponent({
  components: { M3Tab, M3TabGroup },
  props: {
    showMiddle: { type: Boolean, default: false },
    items: { type: Array as PropType<{ value: string; label: string }[]>, default: () => [] },
  },

  template: `
    <M3TabGroup aria-label="Sections">
      <M3Tab value="first" label="First">First content</M3Tab>
      <M3Tab v-if="showMiddle" value="middle" label="Middle">Middle content</M3Tab>
      <M3Tab v-for="item in items" :key="item.value" :value="item.value" :label="item.label">
        {{ item.label }} content
      </M3Tab>
      <M3Tab value="last" label="Last">Last content</M3Tab>
    </M3TabGroup>
  `,
})

const tabLabels = () => screen.getAllByRole('tab').map(tab => tab.textContent?.trim())

describe('m3-vue/tabs', () => {
  test('renders an empty group while asynchronous tabs are loading', () => {
    render(M3TabGroup, { attrs: { 'aria-label': 'Loading sections' } })
    expect(screen.getByRole('tablist', { name: 'Loading sections' })).not.toBeNull()
    expect(screen.queryByRole('tab')).toBeNull()
    expect(screen.queryByRole('tabpanel')).toBeNull()
  })

  test('links selected tab and panel, and switches on click', async () => {
    const { emitted } = render(Tabs)
    const inbox = screen.getByRole('tab', { name: 'Inbox' })
    const drafts = screen.getByRole('tab', { name: 'Drafts' })
    expect(inbox.getAttribute('aria-selected')).toBe('true')
    expect(inbox.getAttribute('aria-controls')).toBe(screen.getByRole('tabpanel').id)
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(inbox.id)
    expect((document.getElementById(drafts.getAttribute('aria-controls')!) as HTMLElement).hidden).toBe(true)

    await fireEvent.click(inbox)
    expect(emitted().change).toBeUndefined()

    await fireEvent.click(drafts)
    expect(drafts.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').textContent).toBe('Draft content')
    expect(screen.queryByText('Inbox content')).toBeNull()
    expect(emitted().change).toEqual([['drafts']])
  })

  test('moves focus without selection and skips disabled tabs', async () => {
    render(Tabs)
    const inbox = screen.getByRole('tab', { name: 'Inbox' })
    const drafts = screen.getByRole('tab', { name: 'Drafts' })
    inbox.focus()
    await fireEvent.keyDown(inbox, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(drafts)
    expect(inbox.getAttribute('aria-selected')).toBe('true')
    await fireEvent.keyDown(drafts, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(inbox)
  })

  test('treats value changes as selection signals and supports v-for fragments', async () => {
    const selected = ref('drafts')
    const Parent = defineComponent({
      setup () {
        return () => h(M3TabGroup, { value: selected.value }, {
          default: () => [h(Fragment, null, [
            h(M3Tab, { value: 'inbox', label: 'Inbox' }, { default: () => 'Inbox content' }),
            h(M3Tab, { value: 'drafts', label: 'Drafts' }, { default: () => 'Draft content' }),
          ])],
        })
      },
    })
    render(Parent)
    await fireEvent.click(screen.getByRole('tab', { name: 'Inbox' }))
    expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')
    selected.value = 'inbox'
    await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content'))
    selected.value = 'drafts'
    await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Draft content'))
  })

  test('keeps template order when a v-if tab disappears and reappears', async () => {
    const view = render(DynamicTabs, { props: { showMiddle: true } })
    expect(tabLabels()).toEqual(['First', 'Middle', 'Last'])

    await view.rerender({ showMiddle: false })
    expect(tabLabels()).toEqual(['First', 'Last'])

    await view.rerender({ showMiddle: true })
    expect(tabLabels()).toEqual(['First', 'Middle', 'Last'])
    await fireEvent.click(screen.getByRole('tab', { name: 'Middle' }))
    expect(screen.getByRole('tabpanel').textContent).toBe('Middle content')
  })

  test('follows v-for source order through reordering, insertion, and removal', async () => {
    const one = { value: 'one', label: 'One' }
    const two = { value: 'two', label: 'Two' }
    const three = { value: 'three', label: 'Three' }
    const view = render(DynamicTabs, { props: { items: [one, two] } })
    expect(tabLabels()).toEqual(['First', 'One', 'Two', 'Last'])

    await fireEvent.click(screen.getByRole('tab', { name: 'Two' }))
    await view.rerender({ items: [two, one] })
    expect(tabLabels()).toEqual(['First', 'Two', 'One', 'Last'])
    expect(screen.getByRole('tabpanel').textContent?.trim()).toBe('Two content')

    await view.rerender({ items: [three, two, one] })
    expect(tabLabels()).toEqual(['First', 'Three', 'Two', 'One', 'Last'])

    await view.rerender({ items: [two] })
    expect(tabLabels()).toEqual(['First', 'Two', 'Last'])
    expect(screen.getByRole('tabpanel').textContent?.trim()).toBe('Two content')
  })

  test('renders icon and badge slots with a custom accessible name', () => {
    const App = defineComponent({
      setup () {
        return () => h(M3TabGroup, { id: 'mail-tabs', value: 'drafts', variant: 'secondary', layout: 'scrollable', 'aria-label': 'Folders' }, {
          default: () => [
            h(M3Tab, { value: 'inbox', label: 'Inbox', badge: '24', 'aria-label': 'Inbox, 24 unread messages' }, {
              icon: () => h('span', 'icon'),
              default: () => 'Inbox content',
            }),
            h(M3Tab, { value: 'drafts', label: 'Drafts' }, {
              badge: () => h('span', '2'),
              default: () => 'Draft content',
            }),
          ],
        })
      },
    })
    render(App)

    const inbox = screen.getByRole('tab', { name: 'Inbox, 24 unread messages' })
    expect(inbox.querySelector('.m3-tab-group__icon .m3-badge')?.textContent).toBe('24')
    expect(screen.getByRole('tab', { name: 'Drafts' }).querySelector('.m3-tab-group__label-row .m3-badge')?.textContent).toBe('2')
    expect(screen.getByRole('tabpanel').id).toBe('mail-tabs-panel-drafts')
    expect(screen.getByRole('tablist', { name: 'Folders' })).not.toBeNull()
    expect(screen.getByRole('tablist').parentElement?.parentElement?.classList.contains('m3-tab-group_secondary')).toBe(true)
  })

  test('renders an icon-only tab with a compact target and an accessible name', () => {
    const App = defineComponent({
      setup () {
        return () => h(M3TabGroup, { 'aria-label': 'Mail folders' }, {
          default: () => [
            h(M3Tab, { value: 'inbox', 'aria-label': 'Inbox' }, {
              icon: () => h('span', 'icon'),
              default: () => 'Inbox content',
            }),
            h(M3Tab, { value: 'drafts', 'aria-label': 'Drafts' }, {
              icon: () => h('span', 'icon'),
              default: () => 'Draft content',
            }),
          ],
        })
      },
    })
    render(App)

    const inbox = screen.getByRole('tab', { name: 'Inbox' })
    expect(inbox.classList.contains('m3-tab-group__tab_icon-only')).toBe(true)
    expect(inbox.querySelector('.m3-tab-group__label-row')).toBeNull()
    expect(inbox.querySelector('.m3-tab-group__icon')).not.toBeNull()
  })

  test('handles Home, End, RTL arrows, and cancelled keyboard events', async () => {
    const App = defineComponent({
      setup () {
        return () => h(M3TabGroup, {
          dir: 'rtl',
          onKeydown: (event: KeyboardEvent) => { if (event.key === 'Home') event.preventDefault() },
        }, {
          default: () => ['A', 'B', 'C'].map(value => h(M3Tab, { value, label: value }, { default: () => `${value} panel` })),
        })
      },
    })
    render(App)
    const a = screen.getByRole('tab', { name: 'A' })
    const b = screen.getByRole('tab', { name: 'B' })
    const c = screen.getByRole('tab', { name: 'C' })
    a.focus()
    await fireEvent.keyDown(a, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(b)
    await fireEvent.keyDown(b, { key: 'End' })
    expect(document.activeElement).toBe(c)
    await fireEvent.keyDown(c, { key: 'Home' })
    expect(document.activeElement).toBe(c)
    await fireEvent.keyDown(c, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(b)
    await fireEvent.keyDown(b, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(c)
  })

  test('falls back when a controlled tab becomes disabled', async () => {
    const disabled = ref(false)
    const App = defineComponent({
      setup () {
        return () => h(M3TabGroup, { value: 'b' }, {
          default: () => [
            h(M3Tab, { value: 'a', label: 'A' }, { default: () => 'A panel' }),
            h(M3Tab, { value: 'b', label: 'B', disabled: disabled.value }, { default: () => 'B panel' }),
          ],
        })
      },
    })
    render(App)
    expect(screen.getByRole('tabpanel').textContent).toBe('B panel')
    disabled.value = true
    await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('A panel'))
  })

  test('synchronizes query navigation with clicks, value changes, and browser history', async () => {
    const original = window.location.href
    window.history.replaceState(null, '', '/mail?folder=work&tab=drafts#message')
    try {
      const selected = ref('inbox')
      const App = defineComponent({
        setup () {
          return () => h(M3TabGroup, { value: selected.value, navigation: 'query', 'aria-label': 'Sections' }, {
            default: () => [
              h(M3Tab, { value: 'inbox', label: 'Inbox' }, { default: () => 'Inbox content' }),
              h(M3Tab, { value: 'drafts', label: 'Drafts' }, { default: () => 'Draft content' }),
            ],
          })
        },
      })
      render(App)
      await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Draft content'))

      await fireEvent.click(screen.getByRole('tab', { name: 'Inbox' }))
      expect(window.location.search).toBe('?folder=work&tab=inbox')
      expect(window.location.hash).toBe('#message')

      window.history.replaceState(null, '', '/mail?folder=work&tab=drafts#message')
      window.dispatchEvent(new PopStateEvent('popstate'))
      await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Draft content'))

      selected.value = 'drafts'
      await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Draft content'))
      selected.value = 'inbox'
      await waitFor(() => expect(window.location.search).toBe('?folder=work&tab=inbox'))
      expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')
    } finally {
      window.history.replaceState(null, '', original)
    }
  })

  test('reads a custom query key and hash navigation', async () => {
    const original = window.location.href
    window.history.replaceState(null, '', '/mail?folder=drafts#inbox')
    try {
      const { unmount } = render(M3TabGroup, { props: { navigation: 'query', queryKey: 'folder' }, slots: {
        default: () => [
          h(M3Tab, { value: 'inbox', label: 'Inbox' }, { default: () => 'Inbox content' }),
          h(M3Tab, { value: 'drafts', label: 'Drafts' }, { default: () => 'Draft content' }),
        ],
      } })
      await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Draft content'))
      unmount()

      render(M3TabGroup, { props: { navigation: 'hash' }, slots: {
        default: () => [
          h(M3Tab, { value: 'inbox', label: 'Inbox' }, { default: () => 'Inbox content' }),
          h(M3Tab, { value: 'drafts', label: 'Drafts' }, { default: () => 'Draft content' }),
        ],
      } })
      expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')
      await fireEvent.click(screen.getByRole('tab', { name: 'Drafts' }))
      expect(window.location.hash).toBe('#drafts')
      expect(window.location.search).toBe('?folder=drafts')
    } finally {
      window.history.replaceState(null, '', original)
    }
  })
})
