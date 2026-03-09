import type { FC } from 'react'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

import { useState } from 'react'

export interface ChipShowcaseProps {
  mode?: 'matrix' | 'filters' | 'inputs';
}

const wrapStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
}

const ChipShowcase: FC<ChipShowcaseProps> = ({
  mode = 'matrix',
}) => {
  const [filters, setFilters] = useState<string[]>(['Assigned to me', 'Urgent'])
  const [tokens, setTokens] = useState<string[]>(['Onboarding', 'Billing', 'Design review'])

  if (mode === 'filters') {
    const options = ['Assigned to me', 'Urgent', 'Needs review']

    return (
      <div style={wrapStyle}>
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
            {option}
          </M3Chip>
        ))}
      </div>
    )
  }

  if (mode === 'inputs') {
    return (
      <div style={wrapStyle}>
        {tokens.map(token => (
          <M3Chip
            key={token}
            variant="input"
            dismissible={true}
            onDismiss={() => setTokens(current => current.filter(value => value !== token))}
          >
            {token}
          </M3Chip>
        ))}
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <M3Chip variant="assist">
        <M3Icon name="schedule" />
        Remind later
      </M3Chip>

      <M3Chip variant="filter" selected={true}>
        Updates
      </M3Chip>

      <M3Chip variant="input" dismissible={true}>
        Project Alpha
      </M3Chip>

      <M3Chip variant="suggestion">
        <M3Icon name="lightbulb" />
        Draft summary
      </M3Chip>
    </div>
  )
}

export default ChipShowcase
