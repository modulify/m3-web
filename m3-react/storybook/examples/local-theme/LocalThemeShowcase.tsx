import type { FC } from 'react'

import { useCallback, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3List, M3ListItem } from '@/components/list'
import { M3Menu, M3MenuItem } from '@/components/menu'
import { M3SurfacePanel } from '@/components/surface'

type LocalThemeVariant = 'danger' | 'warm-alert' | 'success' | 'brand-muted' | 'list-menu'

type NotificationProps = {
  eyebrow: string
  title: string
  copy: string
  scopeClassName?: string
  primaryAction: string
  secondaryAction?: string
  resetAction?: string
}

const ColorStrip: FC = () => (
  <div className="m3-local-theme-showcase__palette" aria-label="Token sample">
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_surface" />
      <span>Surface</span>
    </span>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_container" />
      <span>Container high</span>
    </span>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_primary" />
      <span>Primary</span>
    </span>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_on-primary" />
      <span>On primary</span>
    </span>
  </div>
)

const Notification: FC<NotificationProps> = ({
  eyebrow,
  title,
  copy,
  scopeClassName = '',
  primaryAction,
  secondaryAction,
  resetAction,
}) => (
  <div className={`m3-local-theme-showcase__sample ${scopeClassName}`.trim()}>
    <ColorStrip />

    <M3SurfacePanel
      className="m3-local-theme-showcase__notification"
      fillHeight={false}
      rounding={12}
      variant="surface-container-high"
      elevation={1}
    >
      <div className="m3-local-theme-showcase__eyebrow">{eyebrow}</div>
      <h3 className="m3-local-theme-showcase__title">{title}</h3>
      <p className="m3-local-theme-showcase__copy">{copy}</p>

      <div className="m3-local-theme-showcase__actions">
        {resetAction ? (
          <span className="m3-local-theme m3-local-theme_reset">
            <M3Button appearance="text">
              {resetAction}
            </M3Button>
          </span>
        ) : null}

        {secondaryAction ? (
          <M3Button appearance="tonal">
            {secondaryAction}
          </M3Button>
        ) : null}

        <M3Button appearance="filled">
          {primaryAction}
        </M3Button>
      </div>
    </M3SurfacePanel>
  </div>
)

const NotificationPair: FC<{ themed: NotificationProps }> = ({ themed }) => (
  <div className="m3-local-theme-showcase__comparison">
    <Notification
      eyebrow="Azure-blue baseline"
      title={themed.title}
      copy="This notification inherits the guide baseline theme. It is intentionally azure blue, not the standard Material purple default."
      primaryAction={themed.primaryAction}
      secondaryAction={themed.secondaryAction}
    />

    <Notification {...themed} />
  </div>
)

const DangerScene: FC = () => (
  <NotificationPair
    themed={{
      eyebrow: 'Danger scope',
      title: 'Release deletion requested',
      copy: 'The destructive notification keeps the same component API while primary actions, surfaces, and state layers shift into a local danger palette.',
      scopeClassName: 'm3-local-theme m3-local-theme_danger',
      primaryAction: 'Delete release',
      secondaryAction: 'Review logs',
      resetAction: 'Cancel',
    }}
  />
)

const WarmAlertScene: FC = () => (
  <NotificationPair
    themed={{
      eyebrow: 'Warm alert scope',
      title: 'Invoice retry scheduled',
      copy: 'The warning notification uses warmer container tones for urgency without making every control destructive.',
      scopeClassName: 'm3-local-theme m3-local-theme_warm-alert',
      primaryAction: 'Resolve hold',
      secondaryAction: 'View invoices',
    }}
  />
)

const SuccessScene: FC = () => (
  <NotificationPair
    themed={{
      eyebrow: 'Success scope',
      title: 'Release published',
      copy: 'The success scope moves the module into a green accent while preserving the same hierarchy and component behavior.',
      scopeClassName: 'm3-local-theme m3-local-theme_success',
      primaryAction: 'Share update',
      secondaryAction: 'Review rollout',
    }}
  />
)

const BrandMutedScene: FC = () => (
  <NotificationPair
    themed={{
      eyebrow: 'Brand-muted scope',
      title: 'Guidelines updated',
      copy: 'The muted brand scope keeps a product accent but lowers the visual pressure for editorial or secondary guidance.',
      scopeClassName: 'm3-local-theme m3-local-theme_brand-muted',
      primaryAction: 'Open guidelines',
      secondaryAction: 'Download assets',
    }}
  />
)

const ListMenuScene: FC = () => {
  const [menuTarget, setMenuTarget] = useState<HTMLSpanElement | null>(null)
  const bindMenuTarget = useCallback((el: HTMLSpanElement | null) => {
    setMenuTarget(el)
  }, [])

  return (
    <M3SurfacePanel
      className="m3-local-theme-showcase__cookbook"
      fillHeight={false}
      rounding={28}
      variant="surface-container-high"
      elevation={0}
    >
      <div className="m3-local-theme-showcase__workspace-header">
        <div>
          <div className="m3-local-theme-showcase__eyebrow">Cookbook</div>
          <h3 className="m3-local-theme-showcase__title">List with a destructive menu action</h3>
          <p className="m3-local-theme-showcase__copy">
            The list inherits the azure-blue guide theme. The release checklist item owns an icon action with a popper menu, and only the delete menu item enters the local danger scope.
          </p>
        </div>
      </div>

      <M3List divided={true} className="m3-local-theme-showcase__list">
        <M3ListItem
          lines="2"
          headline="Billing hold"
          supportingText="Payment retry is waiting for a finance owner."
        />
        <M3ListItem
          lines="2"
          headline="Release checklist"
          supportingText="Three items need review before publication."
        >
          <M3ListItem.Trailing>
            <span ref={bindMenuTarget} className="m3-local-theme-showcase__menu-anchor">
              <M3IconButton aria-label="Actions">
                <M3Icon name="more_vert" />
              </M3IconButton>

              <M3Menu
                shown={true}
                target={menuTarget}
                className="m3-local-theme m3-local-theme_showcase m3-local-theme-showcase__menu"
                placement="bottom-end"
                container="parent"
                strategy="absolute"
                offsetMainAxis={8}
              >
                <M3MenuItem>
                  <M3MenuItem.Leading>
                    <M3Icon name="edit" />
                  </M3MenuItem.Leading>
                  Rename list
                </M3MenuItem>

                <M3MenuItem>
                  <M3MenuItem.Leading>
                    <M3Icon name="archive" />
                  </M3MenuItem.Leading>
                  Archive
                </M3MenuItem>

                <M3MenuItem className="m3-local-theme m3-local-theme_danger">
                  <M3MenuItem.Leading>
                    <M3Icon name="delete" />
                  </M3MenuItem.Leading>
                  Delete list
                </M3MenuItem>
              </M3Menu>
            </span>
          </M3ListItem.Trailing>
        </M3ListItem>
        <M3ListItem
          lines="2"
          headline="Access review"
          supportingText="Two external collaborators still have access."
        />
      </M3List>
    </M3SurfacePanel>
  )
}

type LocalThemeShowcaseProps = {
  variant: LocalThemeVariant
}

const LocalThemeShowcase: FC<LocalThemeShowcaseProps> = ({ variant }) => (
  <div className="m3-local-theme m3-local-theme_showcase m3-local-theme-showcase">
    <div className="sb-container-fluid px-6 py-6">
      <div className="m3-local-theme-showcase__intro mb-6">
        <div className="m3-local-theme-showcase__eyebrow">Guide</div>
        <h1 className="m3-local-theme-showcase__headline">Theming with local token scopes</h1>
        <p className="m3-local-theme-showcase__copy">
          This guide intentionally uses an azure-blue baseline theme instead of the standard Material default, so local token changes are easier to compare.
        </p>
      </div>

      {variant === 'danger' ? <DangerScene /> : null}
      {variant === 'warm-alert' ? <WarmAlertScene /> : null}
      {variant === 'success' ? <SuccessScene /> : null}
      {variant === 'brand-muted' ? <BrandMutedScene /> : null}
      {variant === 'list-menu' ? <ListMenuScene /> : null}
    </div>
  </div>
)

export default LocalThemeShowcase
