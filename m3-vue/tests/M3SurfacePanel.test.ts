import {
  render,
  screen,
} from '@testing-library/vue'

import { M3SurfacePanel } from '@/components/surface'

describe('m3-vue/surface-panel', () => {
  test('renders deterministic static panel contract without implicit landmark role', () => {
    render(M3SurfacePanel, {
      slots: {
        default: 'Surface body',
      },
    })

    const surface = screen.getByText('Surface body').closest('.m3-surface') as HTMLElement

    expect(surface).not.toBeNull()
    expect(surface.getAttribute('role')).toBeNull()
    expect(surface.style.width).toBe('100%')
    expect(surface.style.height).toBe('100%')
    expect(surface.style.borderTopLeftRadius).toBe('0px')
    expect(surface.style.borderBottomLeftRadius).toBe('0px')
  })

  test('supports global and per-corner rounding overrides', () => {
    render(M3SurfacePanel, {
      props: {
        rounding: 16,
        roundingTopLeft: 4,
        roundingBottomRight: '24px',
      },
    })

    const surface = document.querySelector('.m3-surface') as HTMLElement

    expect(surface.style.borderTopLeftRadius).toBe('4px')
    expect(surface.style.borderTopRightRadius).toBe('16px')
    expect(surface.style.borderBottomRightRadius).toBe('24px')
    expect(surface.style.borderBottomLeftRadius).toBe('16px')
  })

  test('maps auto variant from elevation and allows explicit variant override', async () => {
    const view = render(M3SurfacePanel, {
      props: {
        elevation: 3,
      },
    })

    let surface = document.querySelector('.m3-surface') as HTMLElement

    expect(surface.classList.contains('m3-surface_container-high')).toBe(true)

    await view.rerender({
      elevation: 3,
      variant: 'surface-bright',
    })

    surface = document.querySelector('.m3-surface') as HTMLElement

    expect(surface.classList.contains('m3-surface_bright')).toBe(true)
    expect(surface.classList.contains('m3-surface_container-high')).toBe(false)
  })
})
