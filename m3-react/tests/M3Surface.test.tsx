import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Surface } from '@/components/surface'

describe('m3-react/surface', () => {
  test('applies deterministic default contract', () => {
    render(
      <M3Surface>
        Surface body
      </M3Surface>
    )

    const surface = screen.getByRole('region')

    expect(surface.classList.contains('m3-surface')).toBe(true)
    expect(surface.style.width).toBe('100%')
    expect(surface.style.height).toBe('100%')
    expect(surface.style.margin).toBe('')
    expect(surface.style.padding).toBe('')
    expect(surface.style.borderTopLeftRadius).toBe('0px')
    expect(surface.style.borderTopRightRadius).toBe('0px')
    expect(surface.style.borderBottomRightRadius).toBe('0px')
    expect(surface.style.borderBottomLeftRadius).toBe('0px')
    expect(surface.style.boxSizing).toBe('')
  })

  test('supports global and per-corner rounding overrides', () => {
    render(
      <M3Surface
        rounding={16}
        roundingTopLeft={4}
        roundingBottomRight="24px"
      />
    )

    const surface = screen.getByRole('region')

    expect(surface.style.borderTopLeftRadius).toBe('4px')
    expect(surface.style.borderTopRightRadius).toBe('16px')
    expect(surface.style.borderBottomRightRadius).toBe('24px')
    expect(surface.style.borderBottomLeftRadius).toBe('16px')
  })

  test('emits close request and dismiss on scrim click in modal mode', () => {
    const onToggle = vi.fn()
    const onDismiss = vi.fn()

    render(
      <M3Surface
        mode="modal"
        shown={true}
        onToggle={onToggle}
        onDismiss={onDismiss}
      >
        Modal body
      </M3Surface>
    )

    const scrim = document.body.querySelector('.m3-surface__scrim') as HTMLElement

    fireEvent.click(scrim)

    expect(onToggle).toHaveBeenCalledWith(false)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  test('anchors modal surface to center with fixed positioning', () => {
    render(
      <M3Surface
        mode="modal"
        shown={true}
        anchor="center"
        width={320}
        height={240}
        fillWidth={false}
        fillHeight={false}
      />
    )

    const surface = screen.getByRole('dialog')

    expect(surface.style.position).toBe('fixed')
    expect(surface.style.top).toBe('50%')
    expect(surface.style.left).toBe('50%')
    expect(surface.style.transform).toContain('translate(-50%, -50%)')
    expect(surface.style.width).toBe('320px')
    expect(surface.style.height).toBe('240px')
  })

  test('maps auto role from elevation and allows explicit variant override', () => {
    const { rerender } = render(
      <M3Surface elevation={3} />
    )

    let surface = screen.getByRole('region')

    expect(surface.classList.contains('m3-surface_role-surface-container-high')).toBe(true)

    rerender(
      <M3Surface elevation={3} variant="surface-bright" />
    )

    surface = screen.getByRole('region')

    expect(surface.classList.contains('m3-surface_role-surface-bright')).toBe(true)
    expect(surface.classList.contains('m3-surface_role-surface-container-high')).toBe(false)
  })
})
