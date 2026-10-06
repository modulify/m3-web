import type { HTMLAttributes, ReactNode } from 'react'
import type { SnackbarActionContext, SnackbarActionRenderer } from './types'
import type { SnackbarLayout } from '@modulify/m3-foundation/types/components/snackbar'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useId } from '@/hooks'

type ActionContent = ReactNode | SnackbarActionRenderer

const Action = defineSlot('M3Snackbar.Action', ({ children }: { children: ActionContent }) => (
  <>{typeof children === 'function' ? null : children}</>
))

export interface M3SnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAction' | 'children'> {
  message: string;
  layout?: SnackbarLayout;
  closable?: boolean;
  closeLabel?: string;
  leaving?: boolean;
  announce?: boolean;
  children?: ReactNode;
  onAction?: () => void;
  onDismiss?: () => void;
}

export default defineComponent(function M3Snackbar({
  message,
  layout = 'inline',
  closable = false,
  closeLabel = 'Close notification',
  leaving = false,
  announce = true,
  children,
  onAction,
  onDismiss,
  className = '',
  onKeyDown,
  ...attrs
}: M3SnackbarProps) {
  const messageId = useId(undefined, 'm3-snackbar-message')
  const [slots] = distinct(children, { action: Action })
  const actionContext: SnackbarActionContext = {
    message,
    messageId,
    performAction: () => onAction?.(),
    dismiss: () => onDismiss?.(),
    buttonProps: {
      appearance: 'text',
      className: 'm3-snackbar__action',
      'aria-describedby': messageId,
      onClick: () => onAction?.(),
    },
  }
  const actionContent = slots.action?.props.children as ActionContent | undefined
  const action = typeof actionContent === 'function' ? actionContent(actionContext) : actionContent

  const onSnackbarKeyDown: NonNullable<M3SnackbarProps['onKeyDown']> = event => {
    if (event.key === 'Escape' && onDismiss) {
      event.stopPropagation()
      onDismiss()
    }

    onKeyDown?.(event)
  }

  return (
    <div
      className={toClassName([className, {
        'm3-snackbar': true,
        'm3-snackbar_layout-stacked': layout === 'stacked',
        'm3-snackbar_leaving': leaving,
      }])}
      {...attrs}
      onKeyDown={onSnackbarKeyDown}
    >
      <span
        id={messageId}
        className="m3-snackbar__message"
        role={announce ? 'status' : undefined}
        aria-live={announce ? 'polite' : 'off'}
        aria-atomic={announce ? 'true' : undefined}
      >
        {message}
      </span>
      {(slots.action || closable) && (
        <span className="m3-snackbar__actions">
          {slots.action && action}
          {closable && (
            <M3IconButton
              className="m3-snackbar__close"
              aria-label={closeLabel}
              aria-describedby={messageId}
              onClick={onDismiss}
            >
              <M3Icon name="close" aria-hidden="true" />
            </M3IconButton>
          )}
        </span>
      )}
    </div>
  )
}, { slots: { Action } })
