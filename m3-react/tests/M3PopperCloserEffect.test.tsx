import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { useRef } from 'react'

import { useElementEffect } from '@/hooks'
import { useM3PopperCloserEffect } from '@/components/popper'

type ProbeProps = {
  active?: boolean;
  all?: boolean;
}

type TouchPointLike = Pick<Touch, 'screenX' | 'screenY'>

const touchEvent = (type: string, changedTouches: TouchPointLike[]) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'changedTouches', {
    value: changedTouches,
  })

  return event
}

const Probe = ({
  active = true,
  all = false,
}: ProbeProps) => {
  const ref = useRef<HTMLButtonElement>(null as unknown as HTMLButtonElement)

  const effect = useM3PopperCloserEffect({
    active,
    all,
  })

  useElementEffect(ref, effect)

  return (
    <button ref={ref} type="button" data-testid="closer-probe">
      Probe
    </button>
  )
}

describe('m3-react/popper closer effect', () => {
  test('wires closer listeners when active and forwards all flag', () => {
    const { rerender } = render(<Probe active={true} all={true} />)

    const button = screen.getByTestId('closer-probe') as HTMLButtonElement & {
      m3PopperCloseAll?: boolean;
    }

    let clickEvent: Event | null = null
    button.addEventListener('click', event => {
      clickEvent = event
    })

    fireEvent.click(button)

    expect((clickEvent as { m3PopperClose?: boolean } | null)?.m3PopperClose).toBe(true)
    expect((clickEvent as { m3PopperCloseAll?: boolean } | null)?.m3PopperCloseAll).toBe(true)
    expect(button.m3PopperCloseAll).toBe(true)

    rerender(<Probe active={false} all={false} />)

    clickEvent = null
    fireEvent.click(button)

    expect((clickEvent as { m3PopperClose?: boolean } | null)?.m3PopperClose).toBeUndefined()
    expect(button.m3PopperCloseAll).toBe(false)
  })

  test('handles touch closer flow for short and long moves', () => {
    render(<Probe active={true} all={false} />)

    const button = screen.getByTestId('closer-probe') as HTMLButtonElement

    button.dispatchEvent(touchEvent('touchstart', [{
      screenX: 10,
      screenY: 10,
    }]))

    const shortMove = touchEvent('touchend', [{
      screenX: 18,
      screenY: 15,
    }])
    button.dispatchEvent(shortMove)

    expect((shortMove as { m3PopperClose?: boolean }).m3PopperClose).toBe(true)
    expect((shortMove as { m3PopperCloseAll?: boolean }).m3PopperCloseAll).toBe(false)

    button.dispatchEvent(touchEvent('touchstart', [{
      screenX: 10,
      screenY: 10,
    }]))

    const longMove = touchEvent('touchend', [{
      screenX: 80,
      screenY: 10,
    }])
    button.dispatchEvent(longMove)

    expect((longMove as { m3PopperClose?: boolean }).m3PopperClose).toBe(false)
    button.dispatchEvent(touchEvent('touchcancel', []))
  })
})
