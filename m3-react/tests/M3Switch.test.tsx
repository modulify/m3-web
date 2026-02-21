import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { useState } from 'react'

import { M3Switch } from '@/components/switch'

describe('m3-react/switch', () => {
  test('toggles by click and keeps state after drag synthetic click', () => {
    const Wrapper = () => {
      const [checked, setChecked] = useState(false)

      return (
        <M3Switch
          checked={checked}
          onToggle={setChecked}
        />
      )
    }

    render(<Wrapper />)

    const input = screen.getByRole('switch') as HTMLInputElement

    expect(input.checked).toBe(false)

    fireEvent.click(input)
    expect(input.checked).toBe(true)

    fireEvent.mouseDown(input, { clientX: 0 })
    fireEvent.mouseMove(window, { clientX: 16 })
    fireEvent.mouseUp(window)

    expect(input.checked).toBe(true)

    fireEvent.click(input)
    expect(input.checked).toBe(true)

    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })
})
