import type { FC } from 'react'

import { M3Button } from '@/components/button'
import { M3SurfacePanel } from '@/components/surface'

type LocalThemeVariant = 'danger' | 'warm-alert' | 'success' | 'brand-muted' | 'nested'

type ThemeCardProps = {
  eyebrow: string
  title: string
  copy: string
  scopeClassName?: string
  primaryAction: string
  secondaryAction?: string
  tertiaryAction?: string
  tertiaryScopeClassName?: string
}

type ThemeCardRowProps = {
  cards: ThemeCardProps[]
  className?: string
}

const ThemeCard: FC<ThemeCardProps> = ({
  eyebrow,
  title,
  copy,
  scopeClassName,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  tertiaryScopeClassName,
}) => {
  return (
    <M3SurfacePanel
      className={`m3-local-theme-showcase__card h-100 ${scopeClassName ?? ''}`.trim()}
      fillHeight={false}
      rounding={28}
      variant="surface-container-high"
      elevation={1}
    >
      <div className="m3-local-theme-showcase__eyebrow">{eyebrow}</div>
      <h3 className="m3-local-theme-showcase__title">{title}</h3>
      <p className="m3-local-theme-showcase__copy">{copy}</p>

      <div className="m3-local-theme-showcase__swatches">
        <div className="m3-local-theme-showcase__swatch">
          <span className="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_surface" />
          <span>Surface</span>
        </div>

        <div className="m3-local-theme-showcase__swatch">
          <span className="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_container" />
          <span>Container</span>
        </div>

        <div className="m3-local-theme-showcase__swatch">
          <span className="m3-local-theme-showcase__swatch-chip m3-local-theme-showcase__swatch-chip_accent" />
          <span>Accent</span>
        </div>
      </div>

      <div className="m3-local-theme-showcase__actions">
        {tertiaryAction ? (
          tertiaryScopeClassName ? (
            <span className={tertiaryScopeClassName}>
              <M3Button appearance="text">
                {tertiaryAction}
              </M3Button>
            </span>
          ) : (
            <M3Button appearance="text">
              {tertiaryAction}
            </M3Button>
          )
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
  )
}

const ThemeCardRow: FC<ThemeCardRowProps> = ({ cards, className }) => {
  return (
    <div className={`sb-row sb-g-5 ${className ?? ''}`.trim()}>
      {cards.map((card) => (
        <div key={card.eyebrow} className="sb-col-12 sb-col-lg-6 d-flex">
          <ThemeCard {...card} />
        </div>
      ))}
    </div>
  )
}

const DangerScene: FC = () => {
  return (
    <>
      <ThemeCardRow cards={[{
        eyebrow: 'Default scope',
        title: 'Default destructive action',
        copy: 'Without a local theme, the same controls stay on the global primary palette and neutral surface tokens.',
        primaryAction: 'Delete release',
        secondaryAction: 'Review logs',
        tertiaryAction: 'Cancel',
      }, {
        eyebrow: 'Danger scope',
        title: 'Locally themed destructive action',
        copy: 'A single wrapper class re-targets the same button and surface tokens to a red destructive palette with a warmer supporting surface.',
        scopeClassName: 'm3-local-theme m3-local-theme--danger',
        primaryAction: 'Delete release',
        secondaryAction: 'Review logs',
        tertiaryAction: 'Cancel',
      }]}
      />

      <ThemeCardRow
        className="mt-5"
        cards={[{
          eyebrow: 'Danger scope + reset action',
          title: 'Locally themed destructive action',
          copy: 'Nested reset scope restores the baseline global theme inside a danger module, so a single supporting action can fall back to the default button language.',
          scopeClassName: 'm3-local-theme m3-local-theme--danger',
          primaryAction: 'Delete release',
          secondaryAction: 'Review logs',
          tertiaryAction: 'Cancel',
          tertiaryScopeClassName: 'm3-local-theme m3-local-theme--reset',
        }]}
      />
    </>
  )
}

const WarmAlertScene: FC = () => {
  return (
    <ThemeCardRow cards={[{
      eyebrow: 'Default scope',
      title: 'Billing reminder card',
      copy: 'The neutral version uses the baseline surface hierarchy from the active global theme.',
      primaryAction: 'Resolve hold',
      secondaryAction: 'View invoices',
      tertiaryAction: 'Dismiss',
    }, {
      eyebrow: 'Warm alert scope',
      title: 'Billing reminder card',
      copy: 'The local alert class shifts the panel into a warmer family and retargets tonal and filled buttons without affecting the surrounding page.',
      scopeClassName: 'm3-local-theme m3-local-theme--warm-alert',
      primaryAction: 'Resolve hold',
      secondaryAction: 'View invoices',
      tertiaryAction: 'Dismiss',
    }]}
    />
  )
}

const SuccessScene: FC = () => {
  return (
    <ThemeCardRow cards={[{
      eyebrow: 'Default scope',
      title: 'Post-release success state',
      copy: 'The neutral version keeps the message on the global theme and does not distinguish celebratory follow-up actions.',
      primaryAction: 'Share update',
      secondaryAction: 'Review rollout',
      tertiaryAction: 'Close',
    }, {
      eyebrow: 'Success scope',
      title: 'Post-release success state',
      copy: 'The success class shifts the local module toward a green palette while keeping the same component API and surface hierarchy.',
      scopeClassName: 'm3-local-theme m3-local-theme--success',
      primaryAction: 'Share update',
      secondaryAction: 'Review rollout',
      tertiaryAction: 'Close',
    }]}
    />
  )
}

const BrandMutedScene: FC = () => {
  return (
    <ThemeCardRow cards={[{
      eyebrow: 'Default scope',
      title: 'Brand guidance callout',
      copy: 'By default, the card inherits the main theme accent and reads as just another primary action area.',
      primaryAction: 'Open guidelines',
      secondaryAction: 'Download assets',
      tertiaryAction: 'Later',
    }, {
      eyebrow: 'Brand-muted scope',
      title: 'Brand guidance callout',
      copy: 'The muted brand class keeps a product-colored accent, but softens both controls and surfaces for secondary editorial emphasis.',
      scopeClassName: 'm3-local-theme m3-local-theme--brand-muted',
      primaryAction: 'Open guidelines',
      secondaryAction: 'Download assets',
      tertiaryAction: 'Later',
    }]}
    />
  )
}

const NestedScene: FC = () => {
  return (
    <M3SurfacePanel
      className="m3-local-theme-showcase__workspace"
      fillHeight={false}
      rounding={32}
      variant="surface-container-low"
      elevation={0}
    >
      <div className="m3-local-theme-showcase__workspace-header">
        <div>
          <div className="m3-local-theme-showcase__eyebrow">Nested local scopes</div>
          <h2 className="m3-local-theme-showcase__workspace-title">One page, multiple local accents</h2>
          <p className="m3-local-theme-showcase__copy">
            The surrounding workspace stays on the global theme while specific modules opt into local token overrides.
          </p>
        </div>

        <M3Button appearance="outlined">
          Publish overview
        </M3Button>
      </div>

      <ThemeCardRow cards={[{
        eyebrow: 'Warm alert scope',
        title: 'Escalated billing hold',
        copy: 'This card uses warmer surface tokens to feel urgent without collapsing into an all-red panel.',
        scopeClassName: 'm3-local-theme m3-local-theme--warm-alert',
        primaryAction: 'Resolve hold',
        secondaryAction: 'Notify finance',
      }, {
        eyebrow: 'Danger scope',
        title: 'Delete workspace access',
        copy: 'A narrower local scope can still switch buttons, supporting copy, and surface tones for destructive actions.',
        scopeClassName: 'm3-local-theme m3-local-theme--danger',
        primaryAction: 'Remove access',
        secondaryAction: 'Review members',
        tertiaryAction: 'Cancel',
      }]}
      />
    </M3SurfacePanel>
  )
}

type LocalThemeShowcaseProps = {
  variant: LocalThemeVariant
}

const LocalThemeShowcase: FC<LocalThemeShowcaseProps> = ({ variant }) => {
  return (
    <div className="m3-local-theme-showcase">
      <div className="sb-container-fluid px-6 py-6">
        <div className="m3-local-theme-showcase__intro mb-6">
          <div className="m3-local-theme-showcase__eyebrow">Pattern</div>
          <h1 className="m3-local-theme-showcase__headline">Local token scopes</h1>
          <p className="m3-local-theme-showcase__copy">
            Local theming works by attaching a wrapper class that overrides a subset of the Material sys-tokens for descendants only.
          </p>
        </div>

        {variant === 'danger' ? <DangerScene /> : null}
        {variant === 'warm-alert' ? <WarmAlertScene /> : null}
        {variant === 'success' ? <SuccessScene /> : null}
        {variant === 'brand-muted' ? <BrandMutedScene /> : null}
        {variant === 'nested' ? <NestedScene /> : null}
      </div>
    </div>
  )
}

export default LocalThemeShowcase
