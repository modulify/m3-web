import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3AppBar } from '@/components/app-bar'
import { M3Search } from '@/components/search'

const appearances = ['search', 'small', 'medium', 'medium-flexible', 'large', 'large-flexible'] as const

describe('m3-vue/app-bar', () => {
  test.each(appearances)('renders %s with one appropriate title', appearance => {
    const view = render(M3AppBar, {
      props: { appearance, headline: 'Library', subtitle: 'Recent items' },
      slots: {
        leading: () => h('button', 'Menu'),
        trailing: () => h('button', 'Favorite'),
      },
    })

    const bar = view.container.querySelector('.m3-app-bar')!
    expect(bar.classList.contains(`m3-app-bar_${appearance}`)).toBe(true)
    expect(screen.getByRole('button', { name: 'Menu' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Favorite' })).not.toBeNull()
    expect(screen.queryByRole('heading', { name: 'Library' }) !== null).toBe(appearance !== 'search')
    expect(view.container.querySelector('.m3-app-bar__subtitle') !== null).toBe(
      appearance === 'small' || appearance.includes('flexible')
    )
  })

  test('tracks a supplied scroll root and re-expands flexible content at the top', async () => {
    const scroller = document.createElement('div')
    const view = render(M3AppBar, {
      props: { appearance: 'medium-flexible', headline: 'Library', scroll: 'collapse', scrollTarget: scroller },
    })
    const bar = view.container.querySelector('.m3-app-bar')!

    scroller.scrollTop = 40
    await fireEvent.scroll(scroller)
    await nextTick()
    expect(bar.classList.contains('m3-app-bar_under')).toBe(true)
    expect(bar.classList.contains('m3-app-bar_collapsed')).toBe(true)

    scroller.scrollTop = 0
    await fireEvent.scroll(scroller)
    await nextTick()
    expect(bar.classList.contains('m3-app-bar_collapsed')).toBe(false)
    expect(bar.classList.contains('m3-app-bar_under')).toBe(false)
  })

  test('shows a flexible image until the bar collapses', async () => {
    const scroller = document.createElement('div')
    const view = render(M3AppBar, {
      props: { appearance: 'large-flexible', headline: 'Library', scroll: 'collapse', scrollTarget: scroller },
      slots: { image: () => h('img', { src: '/library.svg', alt: '' }) },
    })

    expect(view.container.querySelector('.m3-app-bar__image img')).not.toBeNull()
    scroller.scrollTop = 40
    await fireEvent.scroll(scroller)
    await nextTick()
    expect(view.container.querySelector('.m3-app-bar__image')).toBeNull()
  })

  test('keeps one search view owner when composed with M3Search', async () => {
    const Example = defineComponent({
      setup () {
        const open = ref(false)
        const query = ref('')
        return () => h(M3AppBar, { appearance: 'search' }, {
          search: () => h(M3Search, {
            query: query.value,
            open: open.value,
            label: 'Search library',
            status: '',
            layout: 'full-screen',
            'onUpdate:query': (value: string) => query.value = value,
            'onUpdate:open': (value: boolean) => open.value = value,
          }),
        })
      },
    })

    render(Example)
    await fireEvent.click(screen.getByRole('button', { name: 'Search library' }))
    await nextTick()
    expect(screen.getAllByRole('dialog', { name: 'Search library' })).toHaveLength(1)
  })
})
