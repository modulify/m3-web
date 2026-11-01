import '@modulify/m3-foundation/assets/stylesheets/storybook/carousel.scss'

import type { M3CarouselProps } from '@/components/carousel'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

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

type StoryProps = M3CarouselProps & {
  locale: unknown;
  disabledIndex?: number;
}

const CarouselStory = ({ locale, disabledIndex = -1, ...args }: StoryProps) => {
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<string>()
  const text = localize(locale, messages)

  const width = args.variant === 'full-screen' ? 360 : undefined

  return <div className="m3-carousel-demo" style={{ maxInlineSize: width }}>
    <M3Carousel aria-label={text.label} positionLabel={text.position} {...args}>
      {text.items.map((title, index) => {
        const src = `storybook-assets/carousel/${images[index]}.webp`

        return <M3CarouselItem
          key={title}
          aspect={aspects[index]}
          disabled={index === disabledIndex}
          aria-label={`${title}, ${text.detail}`}
          media={<img className="m3-carousel-demo__visual" src={src} alt="" />}
          interactive
          onClick={() => setSelected(title)}
        >
          <div className="m3-carousel-demo__tile">
            <h3 className="m3-carousel-demo__title">{title}</h3>
            <span className="m3-carousel-demo__label m3-carousel-demo__label-full">{text.detail}</span>
            <span className="m3-carousel-demo__label m3-carousel-demo__label-short">{text.brief}</span>
          </div>
        </M3CarouselItem>
      })}
    </M3Carousel>

    {selected && <div role="status" className="p-4">{text.selected(selected)}</div>}

    {args.variant !== 'full-screen' && <div className="p-4">
      <M3Button appearance="text" onClick={() => setShowAll(previous => !previous)}>
        {showAll ? text.hide : text.show}
      </M3Button>
      {showAll && <div className="m3-carousel-demo__list">
        {text.items.map(title => <div key={title}>{title}</div>)}
      </div>}
    </div>}
  </div>
}

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
    onChange: { control: false },
  },
  render: (args, { globals }) => <CarouselStory locale={globals.locale} {...args} />,
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
  render: (args, { globals }) => <CarouselStory locale={globals.locale} disabledIndex={1} {...args} />,
}
