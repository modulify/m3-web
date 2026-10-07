<template>
    <div class="m3-local-theme m3-local-theme_showcase m3-local-theme-showcase">
        <div class="sb-container-fluid px-6 py-6">
            <div class="m3-local-theme-showcase__intro mb-6">
                <div class="m3-local-theme-showcase__eyebrow">
                    {{ text.guide }}
                </div>
                <h1 class="m3-local-theme-showcase__headline">
                    {{ text.title }}
                </h1>
                <p class="m3-local-theme-showcase__copy">
                    {{ text.intro }}
                </p>
            </div>

            <div v-if="currentNotification" class="m3-local-theme-showcase__comparison">
                <div class="m3-local-theme-showcase__sample">
                    <ColorStrip />

                    <M3SurfacePanel
                        :fill-height="false"
                        :rounding="12"
                        :elevation="1"
                        class="m3-local-theme-showcase__notification"
                        variant="surface-container-high"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ text.baseline }}
                        </div>
                        <h2 class="m3-local-theme-showcase__title">
                            {{ currentNotification.title }}
                        </h2>
                        <p class="m3-local-theme-showcase__copy">
                            {{ text.baselineCopy }}
                        </p>

                        <div class="m3-local-theme-showcase__actions">
                            <M3Button v-if="currentNotification.secondaryAction" appearance="tonal">
                                {{ currentNotification.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ currentNotification.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>

                <div :class="['m3-local-theme-showcase__sample', currentNotification.scopeClassName]">
                    <ColorStrip />

                    <M3SurfacePanel
                        :fill-height="false"
                        :rounding="12"
                        :elevation="1"
                        class="m3-local-theme-showcase__notification"
                        variant="surface-container-high"
                    >
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ currentNotification.eyebrow }}
                        </div>
                        <h2 class="m3-local-theme-showcase__title">
                            {{ currentNotification.title }}
                        </h2>
                        <p class="m3-local-theme-showcase__copy">
                            {{ currentNotification.copy }}
                        </p>

                        <div class="m3-local-theme-showcase__actions">
                            <span v-if="currentNotification.resetAction" class="m3-local-theme m3-local-theme_reset">
                                <M3Button appearance="text">
                                    {{ currentNotification.resetAction }}
                                </M3Button>
                            </span>

                            <M3Button v-if="currentNotification.secondaryAction" appearance="tonal">
                                {{ currentNotification.secondaryAction }}
                            </M3Button>

                            <M3Button appearance="filled">
                                {{ currentNotification.primaryAction }}
                            </M3Button>
                        </div>
                    </M3SurfacePanel>
                </div>
            </div>

            <M3SurfacePanel
                v-else
                :fill-height="false"
                :rounding="28"
                :elevation="0"
                class="m3-local-theme-showcase__cookbook"
                variant="surface-container-high"
            >
                <div class="m3-local-theme-showcase__workspace-header">
                    <div>
                        <div class="m3-local-theme-showcase__eyebrow">
                            {{ text.cookbook }}
                        </div>
                        <h2 class="m3-local-theme-showcase__title">
                            {{ text.listTitle }}
                        </h2>
                        <p class="m3-local-theme-showcase__copy">
                            {{ text.listCopy }}
                        </p>
                    </div>
                </div>

                <div ref="menuContainer" class="m3-local-theme-showcase__list-area">
                    <M3List class="m3-local-theme-showcase__list" divided>
                        <M3ListItem
                            :headline="text.billing"
                            :supporting-text="text.billingCopy"
                            lines="2"
                        />
                        <M3ListItem
                            :headline="text.release"
                            :supporting-text="text.releaseCopy"
                            lines="2"
                        >
                            <template #trailing>
                                <span class="m3-local-theme-showcase__menu-anchor">
                                    <span ref="menuTarget">
                                        <M3IconButton :aria-label="text.actions">
                                            <M3Icon name="more_vert" />
                                        </M3IconButton>
                                    </span>

                                    <M3Menu
                                        v-if="menuReady"
                                        :target="getMenuTarget"
                                        :container="menuContainer ?? undefined"
                                        :offset-main-axis="8"
                                        placement="bottom-end"
                                        strategy="absolute"
                                        class="m3-local-theme m3-local-theme_showcase m3-local-theme-showcase__menu"
                                        shown
                                    >
                                        <M3MenuItem>
                                            <template #leading>
                                                <M3Icon name="edit" />
                                            </template>
                                            {{ text.rename }}
                                        </M3MenuItem>

                                        <M3MenuItem>
                                            <template #leading>
                                                <M3Icon name="archive" />
                                            </template>
                                            {{ text.archive }}
                                        </M3MenuItem>

                                        <M3MenuItem class="m3-local-theme m3-local-theme_danger">
                                            <template #leading>
                                                <M3Icon name="delete" />
                                            </template>
                                            {{ text.deleteList }}
                                        </M3MenuItem>
                                    </M3Menu>
                                </span>
                            </template>
                        </M3ListItem>
                        <M3ListItem
                            :headline="text.access"
                            :supporting-text="text.accessCopy"
                            lines="2"
                        />
                    </M3List>
                </div>
            </M3SurfacePanel>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'

import type { StorybookLocale } from '../../i18n'

import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
} from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3List, M3ListItem } from '@/components/list'
import { M3Menu, M3MenuItem } from '@/components/menu'
import { M3SurfacePanel } from '@/components/surface'

import { localize } from '../../i18n'

type LocalThemeVariant = 'danger' | 'warm-alert' | 'success' | 'brand-muted' | 'list-menu'

type Notification = {
  eyebrow: string
  title: string
  copy: string
  scopeClassName: string
  primaryAction: string
  secondaryAction?: string
  resetAction?: string
}

const props = defineProps<{
  locale: StorybookLocale
  variant: LocalThemeVariant
}>()

const text = localize(props.locale, {
  'en-US': { access: 'Access review', accessCopy: 'Two external collaborators still have access.', actions: 'Actions', archive: 'Archive', baseline: 'Azure-blue baseline', baselineCopy: 'This notification inherits the guide baseline theme. It is intentionally azure blue, not the standard Material purple default.', billing: 'Billing hold', billingCopy: 'Payment retry is waiting for a finance owner.', cookbook: 'Cookbook', deleteList: 'Delete list', guide: 'Guide', intro: 'This guide intentionally uses an azure-blue baseline theme instead of the standard Material default, so local token changes are easier to compare.', listCopy: 'The list inherits the azure-blue guide theme. The release checklist item owns an icon action with a popper menu, and only the delete menu item enters the local danger scope.', listTitle: 'List with a destructive menu action', palette: ['Surface', 'Container high', 'Primary', 'On primary'], release: 'Release checklist', releaseCopy: 'Three items need review before publication.', rename: 'Rename list', title: 'Theming with local token scopes', tokenSample: 'Token sample' },
  'ru-RU': { access: 'Проверка доступа', accessCopy: 'У двух внешних участников всё ещё есть доступ.', actions: 'Действия', archive: 'Архивировать', baseline: 'Базовая лазурно-синяя тема', baselineCopy: 'Уведомление наследует базовую тему руководства — намеренно лазурно-синюю, а не стандартную фиолетовую Material.', billing: 'Приостановка оплаты', billingCopy: 'Повторный платёж ожидает ответственного от финансов.', cookbook: 'Рецепт', deleteList: 'Удалить список', guide: 'Руководство', intro: 'Руководство намеренно использует лазурно-синюю базовую тему, чтобы локальные изменения токенов было легче сравнивать.', listCopy: 'Список наследует базовую тему. Только действие удаления в меню переходит в локальную опасную область.', listTitle: 'Список с опасным действием в меню', palette: ['Поверхность', 'Высокий контейнер', 'Основной', 'На основном'], release: 'Чек-лист выпуска', releaseCopy: 'Перед публикацией нужно проверить три пункта.', rename: 'Переименовать список', title: 'Темизация локальными областями токенов', tokenSample: 'Образец токенов' },
})

defineOptions({
  name: 'LocalThemeShowcase',
})

const ColorStrip: Component = defineComponent({
  name: 'ColorStrip',

  setup: () => () => h('div', {
    'aria-label': text.tokenSample,
    class: 'm3-local-theme-showcase__palette',
  }, [
    h('span', { class: 'm3-local-theme-showcase__palette-item' }, [
      h('span', { class: 'm3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_surface' }),
      h('span', text.palette[0]),
    ]),
    h('span', { class: 'm3-local-theme-showcase__palette-item' }, [
      h('span', { class: 'm3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_container' }),
      h('span', text.palette[1]),
    ]),
    h('span', { class: 'm3-local-theme-showcase__palette-item' }, [
      h('span', { class: 'm3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_primary' }),
      h('span', text.palette[2]),
    ]),
    h('span', { class: 'm3-local-theme-showcase__palette-item' }, [
      h('span', { class: 'm3-local-theme-showcase__palette-chip m3-local-theme-showcase__palette-chip_on-primary' }),
      h('span', text.palette[3]),
    ]),
  ]),
})

const notifications: Record<Exclude<LocalThemeVariant, 'list-menu'>, Notification> = {
  danger: {
    eyebrow: 'Danger scope',
    title: 'Release deletion requested',
    copy: 'The destructive notification keeps the same component API while primary actions, surfaces, and state layers shift into a local danger palette.',
    scopeClassName: 'm3-local-theme m3-local-theme_danger',
    primaryAction: 'Delete release',
    secondaryAction: 'Review logs',
    resetAction: 'Cancel',
  },

  'warm-alert': {
    eyebrow: 'Warm alert scope',
    title: 'Invoice retry scheduled',
    copy: 'The warning notification uses warmer container tones for urgency without making every control destructive.',
    scopeClassName: 'm3-local-theme m3-local-theme_warm-alert',
    primaryAction: 'Resolve hold',
    secondaryAction: 'View invoices',
  },

  success: {
    eyebrow: 'Success scope',
    title: 'Release published',
    copy: 'The success scope moves the module into a green accent while preserving the same hierarchy and component behavior.',
    scopeClassName: 'm3-local-theme m3-local-theme_success',
    primaryAction: 'Share update',
    secondaryAction: 'Review rollout',
  },

  'brand-muted': {
    eyebrow: 'Brand-muted scope',
    title: 'Guidelines updated',
    copy: 'The muted brand scope keeps a product accent but lowers the visual pressure for editorial or secondary guidance.',
    scopeClassName: 'm3-local-theme m3-local-theme_brand-muted',
    primaryAction: 'Open guidelines',
    secondaryAction: 'Download assets',
  },
}

const notificationsRu: typeof notifications = {
  danger: {
    eyebrow: 'Опасная область',
    title: 'Запрошено удаление выпуска',
    copy: 'Деструктивное уведомление сохраняет API компонентов, а действия, поверхности и state layers переходят в локальную опасную палитру.',
    scopeClassName: 'm3-local-theme m3-local-theme_danger',
    primaryAction: 'Удалить выпуск',
    secondaryAction: 'Просмотреть журналы',
    resetAction: 'Отмена',
  },
  'warm-alert': {
    eyebrow: 'Тёплая область предупреждения',
    title: 'Запланирован повторный платёж',
    copy: 'Предупреждение использует более тёплые контейнерные тона для срочности, не делая все элементы опасными.',
    scopeClassName: 'm3-local-theme m3-local-theme_warm-alert',
    primaryAction: 'Снять блокировку',
    secondaryAction: 'Открыть счета',
  },
  success: {
    eyebrow: 'Успешная область',
    title: 'Выпуск опубликован',
    copy: 'Успешная область переводит модуль в зелёный акцент, сохраняя иерархию и поведение компонентов.',
    scopeClassName: 'm3-local-theme m3-local-theme_success',
    primaryAction: 'Поделиться обновлением',
    secondaryAction: 'Проверить запуск',
  },
  'brand-muted': {
    eyebrow: 'Приглушённая брендовая область',
    title: 'Руководство обновлено',
    copy: 'Приглушённая брендовая область сохраняет продуктовый акцент, но снижает визуальное давление для редакционных рекомендаций.',
    scopeClassName: 'm3-local-theme m3-local-theme_brand-muted',
    primaryAction: 'Открыть руководство',
    secondaryAction: 'Скачать материалы',
  },
}

const menuTarget = ref<HTMLElement | null>(null)
const menuContainer = ref<HTMLElement | null>(null)
const menuReady = ref(false)
const getMenuTarget = () => menuTarget.value
const currentNotification = computed(() => {
  if (props.variant === 'list-menu') return null

  return localize(props.locale, {
    'en-US': notifications,
    'ru-RU': notificationsRu,
  })[props.variant]
})

onMounted(() => {
  menuReady.value = true
})
</script>

<style>
.m3-local-theme-showcase {
    min-block-size: 100vh;
    box-sizing: border-box;
    background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--m3-sys-primary) 12%, transparent), transparent 34%),
        linear-gradient(180deg, var(--m3-sys-surface) 0%, var(--m3-sys-surface-container-low) 100%);
    color: var(--m3-sys-on-surface);
}

.m3-local-theme-showcase__intro {
    max-inline-size: 760px;
}

.m3-local-theme-showcase__intro > * + * {
    margin-block-start: 12px;
}

.m3-local-theme-showcase__intro .m3-local-theme-showcase__eyebrow {
    margin-block-end: 12px;
}

.m3-local-theme-showcase__intro .m3-local-theme-showcase__eyebrow + * {
    margin-block-start: 0;
}

.m3-local-theme-showcase__headline,
.m3-local-theme-showcase__title {
    margin: 0;
    color: var(--m3-sys-on-surface);
}

.m3-local-theme-showcase__headline {
    font-size: 32px;
    line-height: 40px;
    font-weight: 400;
}

.m3-local-theme-showcase__title {
    font-size: 22px;
    line-height: 28px;
    font-weight: 400;
}

.m3-local-theme-showcase__eyebrow {
    inline-size: fit-content;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: 500;
    background: var(--m3-sys-primary-container);
    color: var(--m3-sys-on-primary-container);
}

.m3-local-theme-showcase__copy {
    margin: 0;
    max-inline-size: 62ch;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
    color: var(--m3-sys-on-surface-variant);
}

.m3-local-theme-showcase__comparison {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

.m3-local-theme-showcase__sample {
    min-inline-size: 0;
}

.m3-local-theme-showcase__sample > * + * {
    margin-block-start: 12px;
}

.m3-local-theme-showcase__palette {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.m3-local-theme-showcase__palette-item {
    min-inline-size: 104px;
    border-radius: 16px;
    padding: 10px 12px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: color-mix(in srgb, var(--m3-sys-surface-container-low) 82%, var(--m3-sys-surface));
    color: var(--m3-sys-on-surface-variant);
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    box-shadow: inset 0 0 0 1px var(--m3-sys-outline-variant);
}

.m3-local-theme-showcase__palette-chip {
    inline-size: 12px;
    block-size: 12px;
    border-radius: 999px;
    flex: 0 0 auto;
    box-shadow: inset 0 0 0 1px var(--m3-sys-outline);
}

.m3-local-theme-showcase__palette-chip_surface {
    background: var(--m3-sys-surface);
}

.m3-local-theme-showcase__palette-chip_container {
    background: var(--m3-sys-surface-container-high);
}

.m3-local-theme-showcase__palette-chip_primary {
    background: var(--m3-sys-primary);
}

.m3-local-theme-showcase__palette-chip_on-primary {
    background: var(--m3-sys-on-primary);
    box-shadow:
        0 0 0 3px var(--m3-sys-primary),
        inset 0 0 0 1px var(--m3-sys-outline);
}

.m3-local-theme-showcase__notification,
.m3-local-theme-showcase__cookbook {
    padding: 24px;
}

.m3-local-theme-showcase__notification > * + *,
.m3-local-theme-showcase__cookbook > * + * {
    margin-block-start: 16px;
}

.m3-local-theme-showcase__sample.m3-local-theme .m3-local-theme-showcase__notification {
    outline: 1px solid color-mix(in srgb, var(--m3-sys-primary) 36%, transparent);
    outline-offset: -1px;
}

.m3-local-theme-showcase__actions {
    padding-block-start: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    row-gap: 8px;
    gap: 12px;
}

.m3-local-theme-showcase__workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 20px;
}

.m3-local-theme-showcase__workspace-header > :first-child {
    min-inline-size: 0;
}

.m3-local-theme-showcase__workspace-header > :first-child > * + * {
    margin-block-start: 8px;
}

.m3-local-theme-showcase__menu-anchor {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.m3-local-theme-showcase__menu-anchor .m3-menu {
    min-inline-size: 208px;
}

.m3-local-theme-showcase__menu .m3-menu-item__icon,
.m3-local-theme-showcase__menu .m3-menu-item__icon .m3-icon {
    color: var(--m3-sys-on-surface);
}

.m3-local-theme-showcase__list-area {
    position: relative;
    overflow: visible;
    inline-size: fit-content;
    max-inline-size: 100%;
}

.m3-local-theme-showcase__list {
    overflow: visible;
    border: 1px solid var(--m3-sys-outline-variant);
    border-radius: 20px;
    background: var(--m3-sys-surface-container);
}

.m3-local-theme {
    --m3-sys-primary: var(--m3-local-primary);
    --m3-sys-primary-container: var(--m3-local-primary-container);
    --m3-sys-on-primary: var(--m3-local-on-primary);
    --m3-sys-on-primary-container: var(--m3-local-on-primary-container);
    --m3-sys-secondary-container: var(--m3-local-secondary-container);
    --m3-sys-on-secondary-container: var(--m3-local-on-secondary-container);
    --m3-sys-surface: var(--m3-local-surface);
    --m3-sys-surface-container-low: var(--m3-local-surface-low);
    --m3-sys-surface-container: var(--m3-local-surface-container);
    --m3-sys-surface-container-high: var(--m3-local-surface-high);
    --m3-sys-surface-container-highest: var(--m3-local-surface-highest);
    --m3-sys-on-surface: var(--m3-local-on-surface);
    --m3-sys-on-surface-variant: var(--m3-local-on-surface-variant);
    --m3-sys-outline: var(--m3-local-outline);
    --m3-sys-outline-variant: var(--m3-local-outline-variant);
    --m3-state-layers-on-surface-opacity-008: color-mix(in srgb, var(--m3-local-on-surface) 8%, transparent);
    --m3-state-layers-on-surface-opacity-012: color-mix(in srgb, var(--m3-local-on-surface) 12%, transparent);
    --m3-state-layers-on-surface-opacity-020: color-mix(in srgb, var(--m3-local-on-surface) 20%, transparent);
    --m3-state-layers-on-secondary-container-opacity-008: color-mix(in srgb, var(--m3-local-on-secondary-container) 8%, transparent);
    --m3-state-layers-on-secondary-container-opacity-012: color-mix(in srgb, var(--m3-local-on-secondary-container) 12%, transparent);
    --m3-state-layers-on-secondary-container-opacity-020: color-mix(in srgb, var(--m3-local-on-secondary-container) 20%, transparent);
    color: var(--m3-sys-on-surface);
}

html.m3-theme-light .m3-local-theme_showcase,
html.m3-theme-light .m3-local-theme_reset {
    --m3-local-primary: #2d5fb8;
    --m3-local-primary-container: #dbe5ff;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #001b47;
    --m3-local-secondary-container: #dce3f3;
    --m3-local-on-secondary-container: #24324a;
    --m3-local-surface: #f8f9ff;
    --m3-local-surface-low: #f3f6ff;
    --m3-local-surface-container: #edf1fb;
    --m3-local-surface-high: #e3e9f6;
    --m3-local-surface-highest: #d7deed;
    --m3-local-on-surface: #181c24;
    --m3-local-on-surface-variant: #4c566b;
    --m3-local-outline: #7b8498;
    --m3-local-outline-variant: #c5ccda;
}

html.m3-theme-dark .m3-local-theme_showcase,
html.m3-theme-dark .m3-local-theme_reset {
    --m3-local-primary: #b5c7ff;
    --m3-local-primary-container: #24498f;
    --m3-local-on-primary: #002d6d;
    --m3-local-on-primary-container: #dbe5ff;
    --m3-local-secondary-container: #3f4658;
    --m3-local-on-secondary-container: #dce3f3;
    --m3-local-surface: #151922;
    --m3-local-surface-low: #10141d;
    --m3-local-surface-container: #1d2330;
    --m3-local-surface-high: #262c3a;
    --m3-local-surface-highest: #313848;
    --m3-local-on-surface: #e4e7f0;
    --m3-local-on-surface-variant: #c4cad8;
    --m3-local-outline: #8e97aa;
    --m3-local-outline-variant: #464d60;
}

html.m3-theme-light .m3-local-theme_danger {
    --m3-local-primary: #b42346;
    --m3-local-primary-container: #ffd9e2;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #400011;
    --m3-local-secondary-container: #f7dce4;
    --m3-local-on-secondary-container: #5b1024;
    --m3-local-surface: #fdf0f4;
    --m3-local-surface-low: #fff8fa;
    --m3-local-surface-container: #fce9ef;
    --m3-local-surface-high: #f8dfe7;
    --m3-local-surface-highest: #efc9d4;
    --m3-local-on-surface: #34111a;
    --m3-local-on-surface-variant: #71414e;
    --m3-local-outline: #a37883;
    --m3-local-outline-variant: #dfb8c2;
}

html.m3-theme-dark .m3-local-theme_danger {
    --m3-local-primary: #ff9db8;
    --m3-local-primary-container: #7e263f;
    --m3-local-on-primary: #491323;
    --m3-local-on-primary-container: #ffdbe3;
    --m3-local-secondary-container: #653745;
    --m3-local-on-secondary-container: #f7dbe3;
    --m3-local-surface: #312129;
    --m3-local-surface-low: #2a1b22;
    --m3-local-surface-container: #34242b;
    --m3-local-surface-high: #38252d;
    --m3-local-surface-highest: #46303a;
    --m3-local-on-surface: #f2dfe4;
    --m3-local-on-surface-variant: #d6c2c8;
    --m3-local-outline: #ae8c97;
    --m3-local-outline-variant: #62424d;
}

html.m3-theme-light .m3-local-theme_warm-alert {
    --m3-local-primary: #8a4f00;
    --m3-local-primary-container: #ffddb8;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #2c1600;
    --m3-local-secondary-container: #f3dfcf;
    --m3-local-on-secondary-container: #37281b;
    --m3-local-surface: #fef1e5;
    --m3-local-surface-low: #fff8f1;
    --m3-local-surface-container: #fbead9;
    --m3-local-surface-high: #f8e1cc;
    --m3-local-surface-highest: #efd0b2;
    --m3-local-on-surface: #2f1b0d;
    --m3-local-on-surface-variant: #6c5647;
    --m3-local-outline: #9a7e69;
    --m3-local-outline-variant: #dbc1ab;
}

html.m3-theme-dark .m3-local-theme_warm-alert {
    --m3-local-primary: #f1be79;
    --m3-local-primary-container: #6d4d1e;
    --m3-local-on-primary: #3f2806;
    --m3-local-on-primary-container: #ffe1c2;
    --m3-local-secondary-container: #5e4835;
    --m3-local-on-secondary-container: #f3e0d1;
    --m3-local-surface: #31261d;
    --m3-local-surface-low: #2a2018;
    --m3-local-surface-container: #34291f;
    --m3-local-surface-high: #382b22;
    --m3-local-surface-highest: #46362a;
    --m3-local-on-surface: #efe0d2;
    --m3-local-on-surface-variant: #d3c3b5;
    --m3-local-outline: #ac9177;
    --m3-local-outline-variant: #5f4937;
}

html.m3-theme-light .m3-local-theme_success {
    --m3-local-primary: #146c2e;
    --m3-local-primary-container: #c2efc8;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #00210c;
    --m3-local-secondary-container: #d6ead5;
    --m3-local-on-secondary-container: #183723;
    --m3-local-surface: #eef8ee;
    --m3-local-surface-low: #f7fdf6;
    --m3-local-surface-container: #e6f3e6;
    --m3-local-surface-high: #dcefdc;
    --m3-local-surface-highest: #c6dfc7;
    --m3-local-on-surface: #132017;
    --m3-local-on-surface-variant: #3f5343;
    --m3-local-outline: #6f8873;
    --m3-local-outline-variant: #bed4c0;
}

html.m3-theme-dark .m3-local-theme_success {
    --m3-local-primary: #9ad7ac;
    --m3-local-primary-container: #245b37;
    --m3-local-on-primary: #112f1c;
    --m3-local-on-primary-container: #d3f0d8;
    --m3-local-secondary-container: #334d3d;
    --m3-local-on-secondary-container: #dce9de;
    --m3-local-surface: #202924;
    --m3-local-surface-low: #1a231e;
    --m3-local-surface-container: #232d27;
    --m3-local-surface-high: #27312c;
    --m3-local-surface-highest: #313d37;
    --m3-local-on-surface: #dce7de;
    --m3-local-on-surface-variant: #c0cbc2;
    --m3-local-outline: #90a592;
    --m3-local-outline-variant: #45594a;
}

html.m3-theme-light .m3-local-theme_brand-muted {
    --m3-local-primary: #5b6683;
    --m3-local-primary-container: #e2e7f2;
    --m3-local-on-primary: #ffffff;
    --m3-local-on-primary-container: #182235;
    --m3-local-secondary-container: #e5e8ef;
    --m3-local-on-secondary-container: #2d3443;
    --m3-local-surface: #f6f7fb;
    --m3-local-surface-low: #fbfbff;
    --m3-local-surface-container: #f0f2f7;
    --m3-local-surface-high: #e8ebf1;
    --m3-local-surface-highest: #dde1e9;
    --m3-local-on-surface: #1d2027;
    --m3-local-on-surface-variant: #586170;
    --m3-local-outline: #858d9c;
    --m3-local-outline-variant: #cdd2dc;
}

html.m3-theme-dark .m3-local-theme_brand-muted {
    --m3-local-primary: #c3cad8;
    --m3-local-primary-container: #454d60;
    --m3-local-on-primary: #2d3443;
    --m3-local-on-primary-container: #e2e7f2;
    --m3-local-secondary-container: #444a57;
    --m3-local-on-secondary-container: #e5e8ef;
    --m3-local-surface: #20232b;
    --m3-local-surface-low: #1a1d25;
    --m3-local-surface-container: #252933;
    --m3-local-surface-high: #2d323d;
    --m3-local-surface-highest: #383e4b;
    --m3-local-on-surface: #e3e6ee;
    --m3-local-on-surface-variant: #c6cbd6;
    --m3-local-outline: #949ba8;
    --m3-local-outline-variant: #4c5361;
}

@media (max-width: 720px) {
    .m3-local-theme-showcase__workspace-header {
        flex-direction: column;
    }
}
</style>
