import * as a11yAddon from '@storybook/addon-a11y/preview'
import {
  composeStories,
  setProjectAnnotations,
} from '@storybook/vue3'

import preview from '../storybook/preview'

if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    observe (): void {}

    unobserve (): void {}

    disconnect (): void {}
  }

  ;(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver
}

const projectAnnotations = setProjectAnnotations([
  a11yAddon,
  preview,
])

const storyModules = import.meta.glob('../storybook/components/*.stories.ts', {
  eager: true,
})

type RunnableStory = {
  run: () => Promise<unknown>
}

const stories = Object.entries(storyModules).flatMap(([modulePath, moduleExports]) => {
  const composedStories = composeStories(moduleExports as Record<string, unknown>, projectAnnotations)

  return Object.entries(composedStories).map(([storyName, story]) => ({
    id: `${modulePath}:${storyName}`,
    story: story as RunnableStory,
  }))
})

describe('m3-vue/storybook a11y smoke', () => {
  test('collects stories for smoke checks', () => {
    expect(stories.length).toBeGreaterThan(0)
  })

  test.each(stories)('$id', async ({ story }) => {
    await story.run()
  })
})
