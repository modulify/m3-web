import type { ComponentPropsWithoutRef } from 'react'

import React from 'react'

import { Unstyled } from '@storybook/addon-docs/blocks'

type PanelProps = ComponentPropsWithoutRef<'div'>

const Panel = ({ children, className, ...props }: PanelProps) => React.createElement(
  Unstyled,
  null,
  React.createElement('div', {
    ...props,
    className: ['m3-panel', 'm3-panel_elevated-1', className].filter(Boolean).join(' '),
  }, children)
)

export default Panel
