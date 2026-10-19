import type { M3LinkInstance } from '@/components/link'

import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, ref } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'

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

  test('uses RouterLink when a router is installed and exposes element controls', async () => {
    const routeComponent = defineComponent({ render: () => h('div') })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: routeComponent },
        { path: '/next', component: routeComponent },
      ],
    })
    await router.push('/')
    await router.isReady()
    const link = ref<M3LinkInstance | null>(null)
    const Harness = defineComponent({
      setup: () => () => h(M3Link, { ref: link, to: '/next' }, { default: () => 'Next page' }),
    })
    render(Harness, { global: { plugins: [router] } })

    const anchor = screen.getByRole('link', { name: 'Next page' })
    expect(link.value?.el).toBe(anchor)
    link.value?.focus()
    expect(document.activeElement).toBe(anchor)
    link.value?.blur()
    expect(document.activeElement).not.toBe(anchor)
    await fireEvent.click(anchor)
    await waitFor(() => expect(router.currentRoute.value.path).toBe('/next'))
  })

  test('falls back to a button when a route is given without a router', () => {
    const view = render(M3Link, { props: { to: '/next', type: 'submit' }, slots: { default: 'Submit' } })
    const button = view.container.querySelector('button') as HTMLButtonElement
    expect(button.type).toBe('submit')
    expect(view.container.querySelector('a')).toBeNull()
  })
})
