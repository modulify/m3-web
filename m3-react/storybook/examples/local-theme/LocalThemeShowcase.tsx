import type { FC } from 'react'

import type { StorybookLocale } from '../../i18n'

import { useCallback, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3List, M3ListItem } from '@/components/list'
import { M3Menu, M3MenuItem } from '@/components/menu'
import { M3SurfacePanel } from '@/components/surface'

import { localize, useStorybookLocale } from '../../i18n'

type LocalThemeVariant = 'danger' | 'warm-alert' | 'success' | 'brand-muted' | 'list-menu'

const messages = {
  'en-US': { access: 'Access review', accessCopy: 'Two external collaborators still have access.', actions: 'Actions', archive: 'Archive', baseline: 'Azure-blue baseline', baselineCopy: 'This notification inherits the guide baseline theme. It is intentionally azure blue, not the standard Material purple default.', billing: 'Billing hold', billingCopy: 'Payment retry is waiting for a finance owner.', brandAction: 'Open guidelines', brandCopy: 'The muted brand scope keeps a product accent but lowers the visual pressure for editorial or secondary guidance.', brandEyebrow: 'Brand-muted scope', brandSecondary: 'Download assets', brandTitle: 'Guidelines updated', cancel: 'Cancel', container: 'Container high', cookbook: 'Cookbook', dangerAction: 'Delete release', dangerCopy: 'The destructive notification keeps the same component API while primary actions, surfaces, and state layers shift into a local danger palette.', dangerEyebrow: 'Danger scope', dangerSecondary: 'Review logs', dangerTitle: 'Release deletion requested', deleteList: 'Delete list', guide: 'Guide', intro: 'This guide intentionally uses an azure-blue baseline theme instead of the standard Material default, so local token changes are easier to compare.', listCopy: 'The list inherits the azure-blue guide theme. The release checklist item owns an icon action with a popper menu, and only the delete menu item enters the local danger scope.', listTitle: 'List with a destructive menu action', onPrimary: 'On primary', primary: 'Primary', release: 'Release checklist', releaseCopy: 'Three items need review before publication.', rename: 'Rename list', successAction: 'Share update', successCopy: 'The success scope moves the module into a green accent while preserving the same hierarchy and component behavior.', successEyebrow: 'Success scope', successSecondary: 'Review rollout', successTitle: 'Release published', surface: 'Surface', title: 'Theming with local token scopes', tokenSample: 'Token sample', warmAction: 'Resolve hold', warmCopy: 'The warning notification uses warmer container tones for urgency without making every control destructive.', warmEyebrow: 'Warm alert scope', warmSecondary: 'View invoices', warmTitle: 'Invoice retry scheduled' },
  'ru-RU': { access: 'Проверка доступа', accessCopy: 'У двух внешних участников всё ещё есть доступ.', actions: 'Действия', archive: 'Архивировать', baseline: 'Базовая лазурно-синяя тема', baselineCopy: 'Уведомление наследует базовую тему руководства — намеренно лазурно-синюю, а не стандартную фиолетовую Material.', billing: 'Приостановка оплаты', billingCopy: 'Повторный платёж ожидает ответственного от финансов.', brandAction: 'Открыть руководство', brandCopy: 'Приглушённая брендовая область сохраняет продуктовый акцент, но снижает визуальное давление для редакционных рекомендаций.', brandEyebrow: 'Приглушённая брендовая область', brandSecondary: 'Скачать материалы', brandTitle: 'Руководство обновлено', cancel: 'Отмена', container: 'Высокий контейнер', cookbook: 'Рецепт', dangerAction: 'Удалить выпуск', dangerCopy: 'Деструктивное уведомление сохраняет API компонентов, а действия, поверхности и state layers переходят в локальную опасную палитру.', dangerEyebrow: 'Опасная область', dangerSecondary: 'Просмотреть журналы', dangerTitle: 'Запрошено удаление выпуска', deleteList: 'Удалить список', guide: 'Руководство', intro: 'Руководство намеренно использует лазурно-синюю базовую тему, чтобы локальные изменения токенов было легче сравнивать.', listCopy: 'Список наследует базовую тему. Только действие удаления в меню переходит в локальную опасную область.', listTitle: 'Список с опасным действием в меню', onPrimary: 'На основном', primary: 'Основной', release: 'Чек-лист выпуска', releaseCopy: 'Перед публикацией нужно проверить три пункта.', rename: 'Переименовать список', successAction: 'Поделиться обновлением', successCopy: 'Успешная область переводит модуль в зелёный акцент, сохраняя иерархию и поведение компонентов.', successEyebrow: 'Успешная область', successSecondary: 'Проверить запуск', successTitle: 'Выпуск опубликован', surface: 'Поверхность', title: 'Темизация локальными областями токенов', tokenSample: 'Образец токенов', warmAction: 'Снять блокировку', warmCopy: 'Предупреждение использует более тёплые контейнерные тона для срочности, не делая все элементы опасными.', warmEyebrow: 'Тёплая область предупреждения', warmSecondary: 'Открыть счета', warmTitle: 'Запланирован повторный платёж' },
}

const useText = () => localize(useStorybookLocale(), messages)

type NotificationProps = {
  eyebrow: string
  title: string
  copy: string
  scopeClassName?: string
  primaryAction: string
  secondaryAction?: string
  resetAction?: string
}

const ColorStrip: FC = () => {
  const text = useText()

  return <div className="m3-local-theme-showcase__palette" aria-label={text.tokenSample}>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_surface" />
      <span>{text.surface}</span>
    </span>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_container" />
      <span>{text.container}</span>
    </span>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_primary" />
      <span>{text.primary}</span>
    </span>
    <span className="m3-local-theme-showcase__palette-item">
      <span className="m3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_on-primary" />
      <span>{text.onPrimary}</span>
    </span>
  </div>
}

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

const NotificationPair: FC<{ themed: NotificationProps }> = ({ themed }) => {
  const text = useText()

  return (
    <div className="m3-local-theme-showcase__comparison">
      <Notification
        eyebrow={text.baseline}
        title={themed.title}
        copy={text.baselineCopy}
        primaryAction={themed.primaryAction}
        secondaryAction={themed.secondaryAction}
      />

      <Notification {...themed} />
    </div>
  )
}

const DangerScene: FC = () => {
  const text = useText()
  return (
    <NotificationPair
      themed={{
        eyebrow: text.dangerEyebrow, title: text.dangerTitle, copy: text.dangerCopy,
        scopeClassName: 'm3-local-theme m3-local-theme_danger',
        primaryAction: text.dangerAction, secondaryAction: text.dangerSecondary, resetAction: text.cancel,
      }}
    />
  )
}

const WarmAlertScene: FC = () => {
  const text = useText()
  return (
    <NotificationPair
      themed={{
        eyebrow: text.warmEyebrow, title: text.warmTitle, copy: text.warmCopy,
        scopeClassName: 'm3-local-theme m3-local-theme_warm-alert',
        primaryAction: text.warmAction, secondaryAction: text.warmSecondary,
      }}
    />
  )
}

const SuccessScene: FC = () => {
  const text = useText()
  return (
    <NotificationPair
      themed={{
        eyebrow: text.successEyebrow, title: text.successTitle, copy: text.successCopy,
        scopeClassName: 'm3-local-theme m3-local-theme_success',
        primaryAction: text.successAction, secondaryAction: text.successSecondary,
      }}
    />
  )
}

const BrandMutedScene: FC = () => {
  const text = useText()
  return (
    <NotificationPair
      themed={{
        eyebrow: text.brandEyebrow, title: text.brandTitle, copy: text.brandCopy,
        scopeClassName: 'm3-local-theme m3-local-theme_brand-muted',
        primaryAction: text.brandAction, secondaryAction: text.brandSecondary,
      }}
    />
  )
}

const ListMenuScene: FC = () => {
  const text = useText()
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
          <div className="m3-local-theme-showcase__eyebrow">{text.cookbook}</div>
          <h3 className="m3-local-theme-showcase__title">{text.listTitle}</h3>
          <p className="m3-local-theme-showcase__copy">
            {text.listCopy}
          </p>
        </div>
      </div>

      <M3List divided={true} className="m3-local-theme-showcase__list">
        <M3ListItem
          lines="2"
          headline={text.billing}
          supportingText={text.billingCopy}
        />
        <M3ListItem
          lines="2"
          headline={text.release}
          supportingText={text.releaseCopy}
        >
          <M3ListItem.Trailing>
            <span ref={bindMenuTarget} className="m3-local-theme-showcase__menu-anchor">
              <M3IconButton aria-label={text.actions}>
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
                  {text.rename}
                </M3MenuItem>

                <M3MenuItem>
                  <M3MenuItem.Leading>
                    <M3Icon name="archive" />
                  </M3MenuItem.Leading>
                  {text.archive}
                </M3MenuItem>

                <M3MenuItem className="m3-local-theme m3-local-theme_danger">
                  <M3MenuItem.Leading>
                    <M3Icon name="delete" />
                  </M3MenuItem.Leading>
                  {text.deleteList}
                </M3MenuItem>
              </M3Menu>
            </span>
          </M3ListItem.Trailing>
        </M3ListItem>
        <M3ListItem
          lines="2"
          headline={text.access}
          supportingText={text.accessCopy}
        />
      </M3List>
    </M3SurfacePanel>
  )
}

type LocalThemeShowcaseProps = {
  locale: StorybookLocale
  variant: LocalThemeVariant
}

const LocalThemeShowcase: FC<LocalThemeShowcaseProps> = ({ locale, variant }) => {
  const text = localize(locale, messages)

  return (
    <div className="m3-local-theme m3-local-theme_showcase m3-local-theme-showcase">
      <div className="sb-container-fluid px-6 py-6">
        <div className="m3-local-theme-showcase__intro mb-6">
          <div className="m3-local-theme-showcase__eyebrow">{text.guide}</div>
          <h1 className="m3-local-theme-showcase__headline">{text.title}</h1>
          <p className="m3-local-theme-showcase__copy">
            {text.intro}
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
}

export default LocalThemeShowcase
