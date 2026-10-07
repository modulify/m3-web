import { act, render, screen } from '@testing-library/react'

import { M3Adaptive } from '@/components/adaptive'
import { useM3Adaptive } from '@/hooks'

const resize = (width: number) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
}

describe('m3-react/adaptive', () => {
  const initialWidth = window.innerWidth

  afterEach(() => act(() => resize(initialWidth)))

  test('renders exact breakpoint content and falls back to regular children', () => {
    act(() => resize(700))

    const view = render(
      <M3Adaptive medium="Medium prop" regular="Regular prop">
        Regular child
        <M3Adaptive.Medium>Medium slot</M3Adaptive.Medium>
        <M3Adaptive.Large>Large slot</M3Adaptive.Large>
      </M3Adaptive>
    )

    expect(screen.getByText('Medium slot')).not.toBeNull()

    act(() => resize(900))
    expect(screen.getByText('Regular child')).not.toBeNull()

    act(() => resize(1300))
    expect(screen.getByText('Large slot')).not.toBeNull()

    view.unmount()
  })

  test('renders only the selected function and supports the selector hook', () => {
    act(() => resize(1700))
    const regular = vi.fn(() => <>Regular<br />content</>)
    const extraLarge = vi.fn(() => <>Extra<br />large</>)

    const Example = () => {
      const adaptive = useM3Adaptive()

      return <>
        <M3Adaptive regular={regular} extraLarge={extraLarge} />
        <span>{adaptive('Base', { 'extra-large': 'Wide' })}</span>
      </>
    }

    const view = render(<Example />)

    expect(screen.getByText('Wide')).not.toBeNull()
    expect(view.container.textContent).toContain('Extra')
    expect(view.container.querySelector('br')).not.toBeNull()
    expect(extraLarge).toHaveBeenCalledOnce()
    expect(regular).not.toHaveBeenCalled()
  })
})
