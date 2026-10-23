import type { Meta, StoryObj } from '@storybook/vue3'

import { computed, ref, watch } from 'vue'

import { M3Button } from '@/components/button'
import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3Navigation, M3NavigationSection } from '@/components/navigation'

import { m3Adaptive } from '@/composables/adaptive'
import { useBreakpoint } from '@/composables/breakpoint'

import { localize } from '../i18n'

import NavigationStoryContent from '../examples/navigation/NavigationStoryContent.vue'
import NavigationStoryMenu from '../examples/navigation/NavigationStoryMenu.vue'

import { messages } from './M3Navigation.i18n'

type StoryText = typeof messages['en-US']
type DestinationLabels = Pick<StoryText, 'inbox' | 'drafts' | 'outbox' | 'favorites' | 'trash'>
type NavigationStoryState = 'default' | 'expanded' | 'collapsed'
type Destination = {
  label: string
  ariaLabel?: string
  icon: string
  active?: boolean
  badge?: string
  badged?: boolean
}

const accessibleLabel = (label: string, full: string) => label === full ? undefined : `${label} — ${full}`

const getDestinations = (text: StoryText, labels: DestinationLabels = text): { primary: Destination[]; folders: Destination[] } => ({
  primary: [
    { label: labels.inbox, ariaLabel: accessibleLabel(labels.inbox, text.inbox), icon: 'inbox', active: true, badge: '24' },
    { label: labels.drafts, ariaLabel: accessibleLabel(labels.drafts, text.drafts), icon: 'drafts' },
    { label: labels.outbox, ariaLabel: accessibleLabel(labels.outbox, text.outbox), icon: 'send', badged: true },
    { label: labels.favorites, ariaLabel: accessibleLabel(labels.favorites, text.favorites), icon: 'favorite' },
    { label: labels.trash, ariaLabel: accessibleLabel(labels.trash, text.trash), icon: 'delete' },
  ],
  folders: [
    { label: text.family, icon: 'folder' },
    { label: text.wedding, icon: 'folder' },
    { label: text.work, icon: 'folder' },
  ],
})

const meta = {
  title: 'Components/M3Navigation',

  component: M3Navigation,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['auto', 'bar', 'bar-vertical', 'rail', 'rail-expanded', 'drawer'],
    },

    alignment: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
    },

    expansion: {
      control: 'select',
      options: ['auto', 'standard', 'modal'],
    },
  },

  args: {
    appearance: 'auto',
    alignment: 'top',
  },

  // eslint-disable-next-line max-lines-per-function
  render: (args, { globals }) => ({
    name: 'M3NavigationStory',

    components: {
      M3Button,
      M3FabButton,
      M3Icon,
      M3Navigation,
      M3NavigationSection,
      NavigationStoryContent,
      NavigationStoryMenu,
    },

    setup () {
      const text = localize(globals.locale, messages)
      const breakpoint = useBreakpoint()

      const state = ref<NavigationStoryState>('default')
      const labels = computed(() => {
        if (args.appearance === 'bar') return m3Adaptive({ ...text, ...text.bar }, { compact: text })
        if (args.appearance === 'auto') return m3Adaptive(text, { medium: { ...text, ...text.bar } })
        return text
      })

      const shouldExpand = computed(() => (
        args.appearance === 'rail-expanded' ||
        args.appearance === 'auto' && breakpoint.value.ge('large')
      ))

      const appearance = computed(() => !shouldExpand.value || state.value !== 'collapsed' ? args.appearance : 'rail')
      const expanded = computed({
        get: () => !shouldExpand.value && state.value === 'expanded',
        set: value => { state.value = value ? 'expanded' : 'default' },
      })

      watch([shouldExpand, () => args.appearance], () => { state.value = 'default' }, { flush: 'sync' })

      const toggle = () => {
        if (shouldExpand.value) {
          state.value = state.value === 'collapsed' ? 'default' : 'collapsed'
        } else {
          state.value = state.value === 'expanded' ? 'default' : 'expanded'
        }
      }

      return {
        args,
        appearance,
        destinations: computed(() => getDestinations(text, labels.value)),
        expanded,
        locale: globals.locale,
        text,
        toggle,
      }
    },

    template: `
        <div>
            <M3Navigation
                v-bind="args"
                v-model:expanded="expanded"
                :appearance="appearance"
            >
                <template #top="{ view }">
                    <M3Button
                        :aria-label="view.appearance === 'rail-expanded' ? text.close : text.open"
                        appearance="standard"
                        width="medium"
                        @click="toggle"
                    >
                        <M3Icon :name="view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'" />
                    </M3Button>

                    <M3FabButton variant="tertiary">
                        <M3Icon name="edit" /> {{ text.compose }}
                    </M3FabButton>
                </template>

                <template #header>
                    {{ text.mail }}
                </template>

                <NavigationStoryMenu :destinations="destinations.primary" />

                <template #sections>
                    <M3NavigationSection>
                        <template #header>
                            {{ text.personalFolders }}
                        </template>

                        <NavigationStoryMenu :destinations="destinations.folders" />
                    </M3NavigationSection>
                </template>
            </M3Navigation>

            <NavigationStoryContent :locale="locale" />
        </div>
    `,
  }),

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof M3Navigation>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export default meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationDrawer: Story = {
  args: {
    appearance: 'drawer',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationRail: Story = {
  args: {
    appearance: 'rail',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationRailExpanded: Story = {
  args: { appearance: 'rail-expanded' },

  // eslint-disable-next-line max-lines-per-function
  render: (_args, { globals }) => ({
    components: {
      M3Button,
      M3FabButton,
      M3Icon,
      M3Navigation,
      M3NavigationSection,
      NavigationStoryMenu,
      NavigationStoryContent,
    },

    setup () {
      const text = localize(globals.locale, messages)

      return {
        appearance: ref<'rail' | 'rail-expanded'>('rail-expanded'),
        destinations: getDestinations(text),
        locale: globals.locale,
        text,
      }
    },

    template: `
        <div>
            <M3Navigation :appearance="appearance">
                <template #top="{ view }">
                    <M3Button
                        :aria-label="view.appearance === 'rail-expanded' ? text.close : text.open"
                        appearance="standard"
                        width="medium"
                        @click="appearance = appearance === 'rail-expanded' ? 'rail' : 'rail-expanded'"
                    >
                        <M3Icon :name="view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'" />
                    </M3Button>

                    <M3FabButton variant="tertiary">
                        <M3Icon name="edit" /> {{ text.compose }}
                    </M3FabButton>
                </template>

                <NavigationStoryMenu :destinations="destinations.primary" />

                <template #sections>
                    <M3NavigationSection>
                        <template #header>
                            {{ text.personalFolders }}
                        </template>

                        <NavigationStoryMenu :destinations="destinations.folders" />
                    </M3NavigationSection>
                </template>
            </M3Navigation>

            <NavigationStoryContent :locale="locale" />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ModalNavigationRail: Story = {
  args: { appearance: 'rail', expansion: 'modal' },

  // eslint-disable-next-line max-lines-per-function
  render: (_args, { globals }) => ({
    components: {
      M3Button,
      M3Icon,
      M3Navigation,
      M3NavigationSection,
      NavigationStoryMenu,
      NavigationStoryContent,
    },

    setup () {
      const text = localize(globals.locale, messages)

      return {
        destinations: getDestinations(text),
        expanded: ref(true),
        locale: globals.locale,
        text,
      }
    },

    template: `
        <div>
            <M3Navigation appearance="rail" expansion="modal" v-model:expanded="expanded">
                <template #top="{ view }">
                    <M3Button
                        :aria-label="view.appearance === 'rail-expanded' ? text.close : text.open"
                        appearance="standard"
                        width="medium"
                        @click="expanded = !expanded"
                    >
                        <M3Icon :name="view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'" />
                    </M3Button>
                </template>

                <NavigationStoryMenu :destinations="destinations.primary" />

                <template #sections>
                    <M3NavigationSection>
                        <template #header>
                            {{ text.personalFolders }}
                        </template>

                        <NavigationStoryMenu :destinations="destinations.folders" />
                    </M3NavigationSection>
                </template>
            </M3Navigation>

            <NavigationStoryContent :locale="locale" />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ImmersiveNavigationRail: Story = {
  args: { appearance: 'rail', collapse: 'hidden', expansion: 'modal' },

  // eslint-disable-next-line max-lines-per-function
  render: (_args, { globals }) => ({
    components: {
      M3Button,
      M3Icon,
      M3Navigation,
      M3NavigationSection,
      NavigationStoryMenu,
      NavigationStoryContent,
    },

    setup () {
      const text = localize(globals.locale, messages)

      return {
        destinations: getDestinations(text),
        expanded: ref(false),
        locale: globals.locale,
        text,
      }
    },

    template: `
        <div>
            <M3Button
                :aria-label="text.open"
                appearance="standard"
                width="medium"
                style="position: fixed; inset-inline-start: 28px; inset-block-start: 44px"
                @click="expanded = true"
            >
                <M3Icon name="menu" />
            </M3Button>

            <M3Navigation appearance="rail" expansion="modal" collapse="hidden" v-model:expanded="expanded">
                <template #top="{ view }">
                    <M3Button
                        :aria-label="view.appearance === 'rail-expanded' ? text.close : text.open"
                        appearance="standard"
                        width="medium"
                        @click="expanded = false"
                    >
                        <M3Icon :name="view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'" />
                    </M3Button>
                </template>

                <NavigationStoryMenu :destinations="destinations.primary" />

                <template #sections>
                    <M3NavigationSection>
                        <template #header>
                            {{ text.personalFolders }}
                        </template>

                        <NavigationStoryMenu :destinations="destinations.folders" />
                    </M3NavigationSection>
                </template>
            </M3Navigation>

            <NavigationStoryContent :locale="locale" top-action />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const NavigationBar: Story = {
  args: {
    appearance: 'bar',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const VerticalNavigationBar: Story = {
  args: {
    appearance: 'bar-vertical',
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const AdaptiveNavigation: Story = {
  args: {
    appearance: 'auto',
  },
  argTypes: {
    appearance: { control: false },
  },
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const AdaptiveWithoutBar: Story = {
  args: {
    appearance: 'auto',
    appearances: ['rail', 'rail-expanded'],
    expansion: 'modal',
  },

  // eslint-disable-next-line max-lines-per-function
  render: (_args, { globals }) => ({
    components: {
      M3Button,
      M3Icon,
      M3Navigation,
      M3NavigationSection,
      NavigationStoryMenu,
      NavigationStoryContent,
    },

    setup () {
      const text = localize(globals.locale, messages)
      const breakpoint = useBreakpoint()
      const wide = computed(() => breakpoint.value.ge('large'))

      const state = ref<NavigationStoryState>('default')
      const expanded = computed({
        get: () => !wide.value && state.value === 'expanded',
        set: value => { state.value = value ? 'expanded' : 'default' },
      })

      watch(wide, () => { state.value = 'default' }, { flush: 'sync' })

      const appearance = computed(() => wide.value && state.value === 'collapsed' ? 'rail' : 'auto')
      const collapse = computed(() => wide.value ? 'rail' : 'hidden')
      const showTrigger = computed(() => !wide.value)
      const toggle = () => {
        if (wide.value) state.value = state.value === 'collapsed' ? 'default' : 'collapsed'
        else state.value = 'default'
      }

      return {
        appearance,
        collapse,
        destinations: getDestinations(text),
        expanded,
        locale: globals.locale,
        showTrigger,
        state,
        text,
        toggle,
      }
    },

    template: `
        <div>
            <M3Button
                v-if="showTrigger"
                :aria-label="text.open"
                appearance="standard"
                width="medium"
                style="position: fixed; inset-inline-start: 28px; inset-block-start: 44px"
                @click="state = 'expanded'"
            >
                <M3Icon name="menu" />
            </M3Button>

            <M3Navigation
                v-model:expanded="expanded"
                :appearance="appearance"
                :appearances="['rail', 'rail-expanded']"
                :collapse="collapse"
                expansion="modal"
            >
                <template #top="{ view }">
                    <M3Button
                        :aria-label="view.appearance === 'rail-expanded' ? text.close : text.open"
                        appearance="standard"
                        width="medium"
                        @click="toggle"
                    >
                        <M3Icon :name="view.appearance === 'rail-expanded' ? 'menu_open' : 'menu'" />
                    </M3Button>
                </template>

                <NavigationStoryMenu :destinations="destinations.primary" />

                <template #sections>
                    <M3NavigationSection>
                        <template #header>
                            {{ text.personalFolders }}
                        </template>

                        <NavigationStoryMenu :destinations="destinations.folders" />
                    </M3NavigationSection>
                </template>
            </M3Navigation>

            <NavigationStoryContent :locale="locale" :top-action="showTrigger" />
        </div>
    `,
  }),
}

// noinspection JSUnusedGlobalSymbols Loaded by storybook
export const ModalNavigationDrawer: Story = {
  // eslint-disable-next-line max-lines-per-function
  render: (args, { globals }) => ({
    name: 'M3ModalNavigationDrawerStory',

    components: {
      M3Button,
      M3Icon,
      M3Navigation,
      M3NavigationSection,
      NavigationStoryMenu,
      NavigationStoryContent,
    },

    setup () {
      const text = localize(globals.locale, messages)

      return {
        args,
        destinations: getDestinations(text),
        expanded: ref(true),
        locale: globals.locale,
        text,
      }
    },

    template: `
        <div>
            <M3Navigation
                v-bind="args"
                v-model:expanded="expanded"
                :appearance="expanded ? 'drawer' : 'rail'"
            >
                <template #top="{ view }">
                    <M3Button
                        :aria-label="view.appearance === 'drawer' ? text.close : text.open"
                        appearance="standard"
                        width="medium"
                        @click="expanded = !expanded"
                    >
                        <M3Icon :name="view.appearance === 'drawer' ? 'menu_open' : 'menu'" />
                    </M3Button>
                </template>

                <template #header>
                    {{ text.mail }}
                </template>

                <NavigationStoryMenu :destinations="destinations.primary" />

                <template #sections>
                    <M3NavigationSection>
                        <template #header>
                            {{ text.personalFolders }}
                        </template>

                        <NavigationStoryMenu :destinations="destinations.folders" />
                    </M3NavigationSection>
                </template>
            </M3Navigation>

            <NavigationStoryContent :locale="locale" />
        </div>
    `,
  }),

  args: {
    appearance: 'drawer',
  },
}
