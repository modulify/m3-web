import '@modulify/m3-foundation/assets/stylesheets/storybook/carousel.scss'

import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Carousel, M3CarouselItem } from '@/components/carousel'

import { localize } from '../i18n'

const images = [
  'mountains', 'museum', 'garden', 'coast',
  'city', 'desert', 'forest', 'lake',
]
const aspects = [
  16 / 9, 3 / 4, 1, 9 / 16,
  4 / 3, 1, 16 / 9, 3 / 4,
]
const variants = [
  'multi-browse',
  'uncontained',
  'uncontained-multi-aspect',
  'hero',
  'hero-centered',
  'full-screen',
]

const messages = {
  'en-US': {
    label: 'Featured places',
    show: 'Show all places',
    hide: 'Hide all places',
    position: (index: number, total: number) => `${index} of ${total}`,
    detail: '1 year ago',
    brief: '1 yr',
    selected: (title: string) => `Selected: ${title}`,
    items: [
      'Mountains', 'Museum', 'Garden', 'Coast',
      'City', 'Desert', 'Forest', 'Lake',
    ],
  },
  'ru-RU': {
    label: 'Интересные места',
    show: 'Показать все места',
    hide: 'Скрыть список',
    position: (index: number, total: number) => `${index} из ${total}`,
    detail: '1 год назад',
    brief: '1 г.',
    selected: (title: string) => `Выбрано: ${title}`,
    items: [
      'Горы', 'Музей', 'Сад', 'Побережье',
      'Город', 'Пустыня', 'Лес', 'Озеро',
    ],
  },
}

const template = `
        <div
            class="m3-carousel-demo"
            :style="{ maxInlineSize: args.variant === 'full-screen' ? '360px' : undefined }"
        >
            <M3Carousel v-bind="args" :aria-label="text.label" :position-label="text.position">
                <M3CarouselItem
                    v-for="item in items"
                    :key="item.title"
                    :aspect="item.aspect"
                    :disabled="item.disabled"
                    :aria-label="item.title + ', ' + text.detail"
                    interactive
                    @click="selected = item.title"
                >
                    <template #media>
                        <img
                            class="m3-carousel-demo__visual"
                            :src="item.src"
                            alt=""
                        >
                    </template>
                    <div class="m3-carousel-demo__tile">
                        <h3 class="m3-carousel-demo__title">{{ item.title }}</h3>
                        <span class="m3-carousel-demo__label m3-carousel-demo__label-full">{{ text.detail }}</span>
                        <span class="m3-carousel-demo__label m3-carousel-demo__label-short">{{ text.brief }}</span>
                    </div>
                </M3CarouselItem>
            </M3Carousel>

            <div v-if="selected" role="status" class="p-4">{{ text.selected(selected) }}</div>

            <div v-if="args.variant !== 'full-screen'" class="p-4">
                <M3Button appearance="text" @click="showAll = !showAll">
                    {{ showAll ? text.hide : text.show }}
                </M3Button>
                <div v-if="showAll" class="m3-carousel-demo__list">
                    <div v-for="item in items" :key="item.title">{{ item.title }}</div>
                </div>
            </div>
        </div>
    `

type StoryArgs = Parameters<NonNullable<Meta<typeof M3Carousel>['render']>>[0]

const renderStory = (args: StoryArgs, locale: unknown, disabledIndex = -1) => ({
  components: { M3Button, M3Carousel, M3CarouselItem },
  setup () {
    const text = localize(locale, messages)
    const showAll = ref(false)
    const selected = ref<string>()
    const items = text.items.map((title, index) => ({
      title,
      src: `storybook-assets/carousel/${images[index]}.webp`,
      aspect: aspects[index],
      disabled: index === disabledIndex,
    }))

    return { args, text, items, showAll, selected }
  },
  template,
})

const meta = {
  title: 'Components/M3Carousel',
  component: M3Carousel,
  args: {
    variant: 'multi-browse',
    preferred: 280,
    height: 240,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    scroll: { control: 'select', options: ['auto', 'snap'] },
    index: { control: false },
  },
  render: (args, { globals }) => renderStory(args, globals.locale),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof M3Carousel>

export default meta
type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const MultiBrowse: Story = {}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Uncontained: Story = { args: { variant: 'uncontained' } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const UncontainedMultiAspect: Story = { args: { variant: 'uncontained-multi-aspect', height: 180 } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const Hero: Story = { args: { variant: 'hero', preferred: 520 } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const CenterAlignedHero: Story = { args: { variant: 'hero-centered', preferred: 520, index: 1 } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const FullScreen: Story = { args: { variant: 'full-screen', height: 480 } }

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const InteractionStates: Story = {
  render: (args, { globals }) => renderStory(args, globals.locale, 1),
}
