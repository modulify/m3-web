import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { useState } from 'react'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

import { DEFAULT_STORYBOOK_LOCALE, localize } from '../../i18n'

export interface ChipShowcaseProps {
  locale?: StorybookLocale;
  mode?: 'matrix' | 'filters' | 'inputs';
}

const messages = {
  'en-US': {
    assignedToMe: 'Assigned to me',
    billing: 'Billing',
    designReview: 'Design review',
    draftSummary: 'Draft summary',
    needsReview: 'Needs review',
    onboarding: 'Onboarding',
    projectAlpha: 'Project Alpha',
    remindLater: 'Remind later',
    updates: 'Updates',
    urgent: 'Urgent',
  },
  'ru-RU': {
    assignedToMe: 'Назначено мне',
    billing: 'Оплата',
    designReview: 'Ревью дизайна',
    draftSummary: 'Сводка черновика',
    needsReview: 'Нужно ревью',
    onboarding: 'Онбординг',
    projectAlpha: 'Проект Альфа',
    remindLater: 'Напомнить позже',
    updates: 'Обновления',
    urgent: 'Срочно',
  },
}

type FilterId = 'assignedToMe' | 'needsReview' | 'urgent'
type TokenId = 'billing' | 'designReview' | 'onboarding'

const wrapStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
}

const ChipShowcase: FC<ChipShowcaseProps> = ({
  locale = DEFAULT_STORYBOOK_LOCALE,
  mode = 'matrix',
}) => {
  const text = localize(locale, messages)
  const [filters, setFilters] = useState<FilterId[]>(['assignedToMe', 'urgent'])
  const [tokens, setTokens] = useState<TokenId[]>(['onboarding', 'billing', 'designReview'])

  if (mode === 'filters') {
    const options: FilterId[] = ['assignedToMe', 'urgent', 'needsReview']

    return (
      <div lang={locale} style={wrapStyle}>
        {options.map(option => (
          <M3Chip
            key={option}
            variant="filter"
            selected={filters.includes(option)}
            onToggle={selected => {
              setFilters(current => {
                return selected
                  ? [...current, option]
                  : current.filter(value => value !== option)
              })
            }}
          >
            {text[option]}
          </M3Chip>
        ))}
      </div>
    )
  }

  if (mode === 'inputs') {
    return (
      <div lang={locale} style={wrapStyle}>
        {tokens.map(token => (
          <M3Chip
            key={token}
            variant="input"
            dismissible={true}
            onDismiss={() => setTokens(current => current.filter(value => value !== token))}
          >
            {text[token]}
          </M3Chip>
        ))}
      </div>
    )
  }

  return (
    <div lang={locale} style={wrapStyle}>
      <M3Chip variant="assist">
        <M3Icon name="schedule" />
        {text.remindLater}
      </M3Chip>

      <M3Chip variant="filter" selected={true}>
        {text.updates}
      </M3Chip>

      <M3Chip variant="input" dismissible={true}>
        {text.projectAlpha}
      </M3Chip>

      <M3Chip variant="suggestion">
        <M3Icon name="lightbulb" />
        {text.draftSummary}
      </M3Chip>
    </div>
  )
}

export default ChipShowcase
