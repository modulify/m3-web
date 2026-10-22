import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3ButtonGroup, M3ButtonGroupItem } from '@/components/button-group'
import { M3Icon } from '@/components/icon'

const actionItem = (value: string, label: string, props: Record<string, unknown> = {}) => h(
  M3ButtonGroupItem,
  { value, ...props },
  () => label
)
const preventSelection = (event: MouseEvent) => event.preventDefault()

const group = (props: Record<string, unknown>, items: Array<{ value: string; label: string; disabled?: boolean }>) => defineComponent({
  render: () => h(M3ButtonGroup, props, () => items.map(item => actionItem(item.value, item.label, { disabled: item.disabled }))),
})

describe('m3-vue/button-group', () => {
  test('keeps one tab stop and moves it with arrow focus', async () => {
    render(group({ variant: 'connected', defaultValue: 'two' }, [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
      { value: 'three', label: 'Three' },
    ]))

    const one = screen.getByRole('button', { name: 'One' })
    const two = screen.getByRole('button', { name: 'Two' })
    const three = screen.getByRole('button', { name: 'Three' })
    expect([one.tabIndex, two.tabIndex, three.tabIndex]).toEqual([-1, 0, -1])
    ;(two as HTMLButtonElement).focus()
    await fireEvent.keyDown(two, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(three)
    expect([one.tabIndex, two.tabIndex, three.tabIndex]).toEqual([-1, -1, 0])
  })

  test('connected single selection updates pressed state and can require a choice', async () => {
    const onChange = vi.fn()
    render(group({ variant: 'connected', defaultValue: 'day', required: true, onChange, 'aria-label': 'View' }, [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]))

    const day = screen.getByRole('button', { name: 'Day' })
    const week = screen.getByRole('button', { name: 'Week' })
    expect(day.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('group', { name: 'View' })).toBeTruthy()

    await fireEvent.click(week)
    expect(onChange).toHaveBeenCalledWith('week')
    expect(week.getAttribute('aria-pressed')).toBe('true')

    await fireEvent.click(week)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test('multiple selection can clear when not required and respects disabled buttons', async () => {
    const onChange = vi.fn()
    render(group({ variant: 'connected', selection: 'multiple', defaultValue: ['bold'], onChange }, [
      { value: 'bold', label: 'Bold' },
      { value: 'italic', label: 'Italic' },
      { value: 'underline', label: 'Underline', disabled: true },
    ]))

    await fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
    expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic'])
    await fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onChange).toHaveBeenLastCalledWith(['italic'])
    await fireEvent.click(screen.getByRole('button', { name: 'Underline' }))
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  test('standard action group leaves pressed state unset and supports arrow focus', async () => {
    const onClick = vi.fn()
    const component = defineComponent({
      render: () => h(M3ButtonGroup, { variant: 'standard', size: 'md', rounding: 'square' }, () => [
        actionItem('copy', 'Copy', { onClick }),
        actionItem('paste', 'Paste', { disabled: true }),
        actionItem('share', 'Share'),
      ]),
    })
    render(component)

    const copy = screen.getByRole('button', { name: 'Copy' })
    const share = screen.getByRole('button', { name: 'Share' })
    expect(copy.hasAttribute('aria-pressed')).toBe(false)
    expect(screen.getByRole('group').classList.contains('m3-button-group_md')).toBe(true)

    ;(copy as HTMLButtonElement).focus()
    await fireEvent.keyDown(copy, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(share)
    await fireEvent.click(copy)
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('connected action group has no toggle state', async () => {
    const onClick = vi.fn()
    const onChange = vi.fn()
    const component = defineComponent({
      render: () => h(M3ButtonGroup, { variant: 'connected', selection: 'none', onChange }, () => [
        actionItem('copy', 'Copy', { onClick }),
        actionItem('share', 'Share'),
      ]),
    })
    render(component)

    expect(screen.getByRole('group').classList.contains('m3-button-group_connected')).toBe(true)
    expect(screen.getByRole('button', { name: 'Copy' }).hasAttribute('aria-pressed')).toBe(false)
    expect(screen.getByRole('button', { name: 'Share' }).hasAttribute('aria-pressed')).toBe(false)

    await fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onChange).not.toHaveBeenCalled()
  })

  test('inherits group size and lets standard items opt into a different size', async () => {
    const size = ref<'md' | 'lg'>('md')
    const component = defineComponent({
      render: () => h(M3ButtonGroup, { size: size.value }, () => [
        actionItem('save', 'Save'),
        h(M3ButtonGroupItem, { value: 'more', kind: 'icon', 'aria-label': 'More' }, () => h(M3Icon, { name: 'more_vert' })),
        actionItem('small', 'Small', { size: 'sm' }),
      ]),
    })
    render(component)

    expect(screen.getByRole('button', { name: 'Save' }).classList.contains('m3-button_md')).toBe(true)
    expect(screen.getByRole('button', { name: 'More' }).classList.contains('m3-button_md')).toBe(true)
    expect(screen.getByRole('button', { name: 'Small' }).classList.contains('m3-button_md')).toBe(false)
    expect(screen.getByRole('button', { name: 'Small' }).parentElement?.classList.contains('m3-button-group__wrapper_sm')).toBe(true)

    size.value = 'lg'
    await nextTick()
    expect(screen.getByRole('button', { name: 'Save' }).classList.contains('m3-button_lg')).toBe(true)
    expect(screen.getByRole('button', { name: 'More' }).classList.contains('m3-button_lg')).toBe(true)
    expect(screen.getByRole('button', { name: 'Small' }).classList.contains('m3-button_lg')).toBe(false)
  })

  test('controlled value emits changes without mutating its own selection', async () => {
    const onChange = vi.fn()
    render(group({ variant: 'connected', value: 'one', onChange }, [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ]))

    await fireEvent.click(screen.getByRole('button', { name: 'Two' }))
    expect(onChange).toHaveBeenCalledWith('two')
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('true')
  })

  test('right arrow moves backward in RTL and skips disabled items', async () => {
    render(group({ variant: 'connected', dir: 'rtl' }, [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two', disabled: true },
      { value: 'three', label: 'Three' },
    ]))

    const one = screen.getByRole('button', { name: 'One' })
    const three = screen.getByRole('button', { name: 'Three' })
    ;(one as HTMLButtonElement).focus()
    await fireEvent.keyDown(one, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(three)
    await fireEvent.keyDown(three, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(one)
    await fireEvent.keyDown(one, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(three)
    await fireEvent.keyDown(three, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(one)
    await fireEvent.keyDown(one, { key: 'Enter' })
    expect(document.activeElement).toBe(one)
  })

  test('required multiple selection retains its last selected item', async () => {
    const onChange = vi.fn()
    render(group({ variant: 'connected', selection: 'multiple', required: true, defaultValue: ['one'], onChange }, [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ]))

    await fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('true')
  })

  test('optional single selection can clear and an empty multiple selection can start', async () => {
    const onSingleChange = vi.fn()
    const { unmount } = render(group({ variant: 'connected', defaultValue: 'one', onChange: onSingleChange }, [
      { value: 'one', label: 'One' },
    ]))

    await fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onSingleChange).toHaveBeenCalledWith(null)
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('false')
    unmount()

    const onMultipleChange = vi.fn()
    render(group({ variant: 'connected', selection: 'multiple', onChange: onMultipleChange }, [
      { value: 'one', label: 'One' },
    ]))
    await fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onMultipleChange).toHaveBeenCalledWith(['one'])
  })

  test('an item click handler can cancel a selection change', async () => {
    const onChange = vi.fn()
    const component = defineComponent({
      render: () => h(M3ButtonGroup, { variant: 'connected', onChange }, () => actionItem('one', 'One', { onClick: preventSelection })),
    })
    render(component)

    await fireEvent.click(screen.getByRole('button', { name: 'One' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'One' }).getAttribute('aria-pressed')).toBe('false')
  })

  test('icons and text use separate button content wrappers', () => {
    const component = defineComponent({
      render: () => h(M3ButtonGroup, {}, () => h(M3ButtonGroupItem, { value: 'save' }, () => [
        h('svg', { 'aria-hidden': 'true' }),
        'Save',
      ])),
    })
    render(component)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.querySelector('.m3-button__icon svg')).toBeTruthy()
    expect(button.querySelector('.m3-button__text')?.textContent).toBe('Save')
    expect(button.querySelector(':scope > .m3-button__state')).toBeTruthy()
  })

  test('detects an icon-only item and fills its icon only while selected', async () => {
    const component = defineComponent({
      render: () => h(M3ButtonGroup, { selection: 'single' }, () => h(M3ButtonGroupItem, { value: 'more', 'aria-label': 'More' }, () => h(M3Icon, { name: 'more_vert' }))),
    })
    render(component)

    const button = screen.getByRole('button', { name: 'More' })
    expect(button.classList.contains('m3-button-group__item_icon-only')).toBe(true)
    expect(button.querySelector('.m3-icon_outlined')).toBeTruthy()
    await fireEvent.click(button)
    expect(button.querySelector('.m3-icon_filled')).toBeTruthy()
  })
})
