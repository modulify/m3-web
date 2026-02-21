import type {
  FC,
  HTMLAttributes,
  ReactNode,
} from 'react'

import { M3IconButton } from '@/components/icon-button'
import { M3ScrollRail } from '@/components/scroll-rail'

import {
  useId,
} from '@/hooks'

import { createPortal } from 'react-dom'

import { useMemo } from 'react'

import { distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3SideSheetProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  shown?: boolean;
  docked?: boolean;
  onToggle?: (shown: boolean) => void;
}

const Affordance: FC<{ children: ReactNode }> = props => <>{props.children}</>
const Title: FC<{ children: ReactNode }> = props => <>{props.children}</>
const CloseIcon: FC<{ children: ReactNode }> = props => <>{props.children}</>
const Footer: FC<{ children: ReactNode }> = props => <>{props.children}</>

const M3SideSheet: FC<M3SideSheetProps> = ({
  id,
  shown = false,
  docked = false,
  className = '',
  children = [],
  onToggle = (_: boolean) => {},
  ...attrs
}) => {
  const _id = useId(id, 'm3-side-sheet')

  const [slots, content] = useMemo(() => distinct(children, {
    affordance: Affordance,
    title: Title,
    closeIcon: CloseIcon,
    footer: Footer,
  }), [children])

  const aria = 'aria-label' in attrs || 'aria-labelledby' in attrs
    ? {}
    : { 'aria-labelledby': _id + '-title' }

  return createPortal(
    <>
      {docked ? null : (
        <div
          className="m3-scrim"
          style={shown ? undefined : { display: 'none' }}
          onClick={() => onToggle(false)}
        />
      )}

      <div
        id={_id}
        role="dialog"
        className={toClassName([className, {
          'm3-side-sheet': true,
          'm3-side-sheet_docked': docked,
        }])}
        style={shown ? undefined : { display: 'none' }}
        {...{
          ...aria,
          ...attrs,
        }}
      >
        <header
          className={toClassName({
            'm3-side-sheet__header': true,
            'm3-side-sheet__header_has-leading-affordance': !!slots.affordance,
          })}
        >
          {slots.affordance ? (
            <div className="m3-side-sheet__affordance">
              {slots.affordance}
            </div>
          ) : null}

          <div
            id={_id + '-title'}
            className="m3-side-sheet__title"
          >
            {slots.title}
          </div>

          <div className="m3-side-sheet__affordance">
            <M3IconButton onClick={() => onToggle(false)}>
              {slots.closeIcon}
            </M3IconButton>
          </div>
        </header>

        <div className="m3-side-sheet__content">
          <M3ScrollRail />
          {content}
        </div>

        {slots.footer ? (
          <footer className="m3-side-sheet__footer">
            {slots.footer}
          </footer>
        ) : null}
      </div>
    </>,
    document.body
  )
}

export default Object.assign(M3SideSheet, {
  Affordance,
  Title,
  CloseIcon,
  Footer,
})
