import { render } from '@testing-library/vue'

import { M3Icon } from '@/components/icon'

describe('m3-vue/icon', () => {
  test('uses appearance prop', () => {
    const { container } = render(M3Icon, {
      props: {
        name: 'edit',
        appearance: 'filled',
      },
    })

    const icon = container.querySelector('.m3-icon')

    expect(icon?.textContent).toBe('edit')
    expect(icon?.classList.contains('m3-icon_filled')).toBe(true)
  })
})
