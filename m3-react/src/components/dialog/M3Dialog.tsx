import type {
  FC,
  HTMLAttributes,
} from 'react'

import { createPortal } from 'react-dom'
import { useMemo } from 'react'
import { useTransition } from 'react-transition-state'
import {
  useRecord,
  useWatch,
} from '@/hooks'
import { distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3DialogProps extends HTMLAttributes<HTMLElement> {
  opened?: boolean;
  fullscreen?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const Icon: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-dialog__icon', className])} {...attrs}>
    {children}
  </div>
)

const Header: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <header className={toClassName(['m3-dialog__header', className])} {...attrs}>
    {children}
  </header>
)

const Footer: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <footer className={toClassName(['m3-dialog__footer', className])} {...attrs}>
    {children}
  </footer>
)

const M3Dialog: FC<M3DialogProps> = ({
  opened = false,
  fullscreen = false,
  className = '',
  children = [],
  onToggle = (_: boolean) => {},
  ...attrs
}) => {
  const [slots, content] = useMemo(() => distinct(children, {
    icon: Icon,
    header: Header,
    footer: Footer,
  }), [children])

  const handlers = useRecord({
    onToggle,
  })

  useWatch(onToggle, onToggle => handlers.onToggle = onToggle)

  const [transition, toggle] = useTransition({
    timeout: 500,
    preEnter: true,
    preExit: true,
    mountOnEnter: true,
    unmountOnExit: true,
  })

  toggle(opened)

  return createPortal(
    <div
      className={toClassName(['m3-dialog-container', {
        'm3-transition-fade-enter': transition.status === 'preEnter' || transition.status === 'entering',
        'm3-transition-fade-enter-active': transition.status === 'entering',
        'm3-transition-fade-leave-active': transition.status === 'preExit' || transition.status === 'exiting',
        'm3-transition-fade-leave-to': transition.status === 'exiting',
      }])}
      style={transition.status === 'unmounted' ? { display: 'none' } : {}}
    >
      {fullscreen ? null : (
        <div
          className="m3-scrim"
          onClick={() => handlers.onToggle(false)}
        />
      )}

      {transition.isMounted && (
        <section
          className={toClassName([className, {
            'm3-dialog': true,
            'm3-dialog_fullscreen': fullscreen,
            'm3-dialog-appear-enter': transition.status === 'preEnter' || transition.status === 'entering',
            'm3-dialog-appear-enter-active': transition.status === 'entering',
            'm3-dialog-appear-leave-active': transition.status === 'preExit' || transition.status === 'exiting',
            'm3-dialog-appear-leave-to': transition.status === 'exiting',
          }])}
          {...attrs}
        >
          {slots.icon}
          {slots.header}
          {content.length ? (
            <div className="m3-dialog__content">
              {content}
            </div>
          ) : null}
          {slots.footer}
        </section>
      )}
    </div>,
    document.body
  )
}

export default Object.assign(M3Dialog, {
  Icon,
  Header,
  Footer,
})
