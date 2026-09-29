import type { FC } from 'react'
import type { StorybookLocale } from '../../i18n'

import { M3Card } from '@/components/card'

import { localize } from '../../i18n'

const LiveMusic2: FC<{
  interactive?: boolean
  locale: StorybookLocale
}> = ({ interactive = false, locale }) => {
  const text = localize(locale, {
    'en-US': {
      description: 'Watch exclusive live performances at The Hideout every Saturday at 7 p.m.',
      title: 'Live music coming soon to The Hideout',
    },
    'ru-RU': {
      description: 'Смотрите эксклюзивные живые выступления в The Hideout каждую субботу в 19:00.',
      title: 'Скоро живая музыка в The Hideout',
    },
  })

  return (
    <M3Card interactive={interactive}>
      <M3Card.Heading>
        <h3 className="mb-0">{text.title}</h3>
      </M3Card.Heading>

      <img
        src="../../assets/piano-640x427.jpg"
        alt=""
        className="m3-card__image"
      />

      {text.description}
    </M3Card>
  )
}

export default LiveMusic2
