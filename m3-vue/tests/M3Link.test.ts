import { render } from '@testing-library/vue'

import { M3Link } from '@/components/link'

describe('m3-vue/link', () => {
  test('renders as anchor for href and as button by default', () => {
    const withHref = render(M3Link, {
      props: {
        href: '//example.com',
      },
      slots: { default: 'Open' },
    })

    const anchor = withHref.container.querySelector('a') as HTMLAnchorElement

    expect(anchor.getAttribute('href')).toBe('//example.com')

    const withoutHref = render(M3Link, {
      slots: { default: 'Action' },
    })

    const button = withoutHref.container.querySelector('button') as HTMLButtonElement

    expect(button.getAttribute('type')).toBe('button')
  })
})
