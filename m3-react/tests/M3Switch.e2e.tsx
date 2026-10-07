import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { waitFor } from '@testing-library/react'

import { M3Switch } from '@/components/switch'

const SwitchWithIcon = () => {
  const [checked, setChecked] = useState(false)

  return (
    <M3Switch checked={checked} onToggle={setChecked}>
      <span data-testid="switch-icon" style={{ display: 'block', width: 12, height: 12 }} />
    </M3Switch>
  )
}

const SwitchWithoutIcon = () => {
  const [checked, setChecked] = useState(false)

  return <M3Switch checked={checked} onToggle={setChecked} />
}

test('animates the switch handle surface when toggled', async () => {
  const view = render(<SwitchWithoutIcon />)

  try {
    const checkmark = view.container.querySelector<HTMLElement>('.m3-switch__checkmark')!
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    fireEvent.click(view.getByRole('switch'))

    await waitFor(() => expect(view.getByRole('switch').getAttribute('aria-checked')).toBe('true'))

    const scales: number[] = []
    for (let frame = 0; frame < 5; frame++) {
      await new Promise<void>(resolve => setTimeout(resolve, 30))
      scales.push(new DOMMatrix(getComputedStyle(checkmark, '::before').transform).a)
    }

    expect(scales.some(scale => scale > 1 && scale < 1.5)).toBe(true)
  } finally {
    view.unmount()
  }
})

test('changes switch handle surface without scaling its icon', async () => {
  const view = render(<SwitchWithIcon />)

  try {
    const input = view.getByRole('switch')
    const icon = view.getByTestId('switch-icon')
    const checkmark = icon.parentElement as HTMLElement
    const iconWidth = icon.getBoundingClientRect().width
    const checkmarkWidth = checkmark.offsetWidth

    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    fireEvent.click(input)

    await waitFor(() => expect(input.getAttribute('aria-checked')).toBe('true'))
    expect(icon.getBoundingClientRect().width).toBe(iconWidth)
    expect(checkmark.offsetWidth).toBe(checkmarkWidth)

    await waitFor(() => expect(getComputedStyle(checkmark, '::before').transform).toBe('matrix(1.5, 0, 0, 1.5, 0, 0)'))
    expect(icon.getBoundingClientRect().width).toBe(iconWidth)
  } finally {
    view.unmount()
  }
})
