import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'
import type { Meta, StoryObj } from '@storybook/vue3'

import { computed, ref } from 'vue'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'
import { useBreakpoint } from '@/composables/breakpoint'

import { localize } from '../i18n'
import NavigationStoryContent from '../examples/navigation/NavigationStoryContent.vue'

const messages = {
  'en-US': { close: 'Close menu', compose: 'Compose', drafts: 'Drafts', family: 'Family', favorites: 'Favorites', inbox: 'Inbox', mail: 'Mail', open: 'Open menu', outbox: 'Outbox', personalFolders: 'Personal folders', trash: 'Trash', wedding: 'Wedding', work: 'Work' },
  'ru-RU': { close: 'Закрыть меню', compose: 'Написать', drafts: 'Черновики', family: 'Семья', favorites: 'Избранное', inbox: 'Входящие', mail: 'Почта', open: 'Открыть меню', outbox: 'Исходящие', personalFolders: 'Личные папки', trash: 'Корзина', wedding: 'Свадьба', work: 'Работа' },
}

type Destination = { label: string; icon: string; active?: boolean; badge?: string; badged?: boolean }

const getDestinations = (text: typeof messages['en-US']): { primary: Destination[]; folders: Destination[] } => ({
  primary: [
    { label: text.inbox, icon: 'inbox', active: true, badge: '24' },
    { label: text.drafts, icon: 'drafts' },
    { label: text.outbox, icon: 'send', badged: true },
    { label: text.favorites, icon: 'favorite' },
    { label: text.trash, icon: 'delete' },
  ],
  folders: [
    { label: text.family, icon: 'folder' },
    { label: text.wedding, icon: 'folder' },
    { label: text.work, icon: 'folder' },
  ],
})

const destinationsTemplate = `
  <M3NavigationTab
      v-for="destination in destinations.primary"
      :key="destination.label"
      :label="destination.label"
      :active="destination.active"
      :badged="destination.badged"
  >
      <M3Icon :name="destination.icon" />
      <template v-if="destination.badge" #badge>{{ destination.badge }}</template>
  </M3NavigationTab>

  <template #sections>
      <M3NavigationSection>
          <template #header>{{ text.personalFolders }}</template>
          <M3NavigationTab
              v-for="destination in destinations.folders"
              :key="destination.label"
              :label="destination.label"
          >
              <M3Icon :name="destination.icon" />
          </M3NavigationTab>
      </M3NavigationSection>
  </template>
`

const meta = {
  title: 'Components/M3Navigation',

  component: M3Navigation,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['auto', 'bar', 'rail', 'rail-expanded', 'drawer'],
    },

    alignment: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
    },

    barLayout: {
      control: 'select',
      options: ['auto', 'vertical'],
    },

    railExpandedMode: {
      control: 'select',
      options: ['auto', 'standard', 'modal'],
    },
  },

  args: {
    appearance: 'auto',
    alignment: 'top',
    barLayout: 'auto',
  },

  // eslint-disable-next-line max-lines-per-function
  render: (args: unknown, { globals }) => ({
    name: 'M3NavigationStory',

    components: {
      M3FabButton,
      M3Icon,
      M3IconButton,
      M3Navigation,
      M3NavigationSection,
      M3NavigationTab,
      NavigationStoryContent,
    },

    setup () {
      const expanded = ref(false)
      const collapsed = ref(false)
      const breakpoint = useBreakpoint()
      const text = localize(globals.locale, messages)
      const storyArgs = args as { appearance: Appearance }
      const expandedByAppearance = computed(() => storyArgs.appearance === 'rail-expanded'
        || (storyArgs.appearance === 'auto' && breakpoint.value.ge('large')))
      const appearance = computed(() => expandedByAppearance.value && collapsed.value ? 'rail' : storyArgs.appearance)
      const railExpanded = computed(() => expandedByAppearance.value && !collapsed.value
        || expanded.value && (appearance.value === 'rail' || (appearance.value === 'auto' && breakpoint.value.ge('expanded'))))

      const toggleRail = () => {
        if (expandedByAppearance.value) {
          collapsed.value = !collapsed.value
          expanded.value = false
        } else {
          expanded.value = !expanded.value
        }
      }

      return {
        args,
        appearance,
        destinations: getDestinations(text),
        expanded,
        locale: globals.locale,
        railExpanded,
        text,
        toggleRail,
      }
    },

    template: `
      <div>
        <M3Navigation
            v-bind="args"
            v-model:expanded="expanded"
            :appearance="appearance"
        >
            <template #top>
                <M3IconButton
                    :aria-label="railExpanded ? text.close : text.open"
                    @click="toggleRail"
                >
                    <M3Icon :name="railExpanded ? 'menu_open' : 'menu'" />
                </M3IconButton>

                <M3FabButton variant="tertiary">
                    <M3Icon name="edit" />
                    {{ text.compose }}
                </M3FabButton>
            </template>

            <template #header>
                {{ text.mail }}
            </template>

            ${destinationsTemplate}
        </M3Navigation>
        <NavigationStoryContent :locale="locale" />
      </div>
    `,
  }),

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof M3Navigation>

export default meta

type Story = StoryObj<typeof meta>

export const NavigationDrawer: Story = {
  args: {
    appearance: 'drawer',
  },
}

export const NavigationRail: Story = {
  args: {
    appearance: 'rail',
  },
}

export const NavigationRailExpanded: Story = {
  args: { appearance: 'rail-expanded' },
  render: (_args, { globals }) => ({
    components: { M3FabButton, M3Icon, M3IconButton, M3Navigation, M3NavigationSection, M3NavigationTab, NavigationStoryContent },
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
        <template #top>
          <M3IconButton
              :aria-label="appearance === 'rail-expanded' ? text.close : text.open"
              @click="appearance = appearance === 'rail-expanded' ? 'rail' : 'rail-expanded'"
          >
            <M3Icon :name="appearance === 'rail-expanded' ? 'menu_open' : 'menu'" />
          </M3IconButton>
          <M3FabButton variant="tertiary"><M3Icon name="edit" />{{ text.compose }}</M3FabButton>
        </template>
        ${destinationsTemplate}
      </M3Navigation>
      <NavigationStoryContent :locale="locale" />
      </div>
    `,
  }),
}

export const ModalNavigationRail: Story = {
  args: { appearance: 'rail', railExpandedMode: 'modal' },
  render: (_args, { globals }) => ({
    components: { M3Icon, M3IconButton, M3Navigation, M3NavigationSection, M3NavigationTab, NavigationStoryContent },
    setup () {
      const text = localize(globals.locale, messages)
      return { destinations: getDestinations(text), expanded: ref(true), locale: globals.locale, text }
    },
    template: `
      <div>
      <M3Navigation appearance="rail" rail-expanded-mode="modal" v-model:expanded="expanded">
        <template #top>
          <M3IconButton :aria-label="expanded ? text.close : text.open" @click="expanded = !expanded">
            <M3Icon :name="expanded ? 'menu_open' : 'menu'" />
          </M3IconButton>
        </template>
        ${destinationsTemplate}
      </M3Navigation>
      <NavigationStoryContent :locale="locale" />
      </div>
    `,
  }),
}

export const ImmersiveNavigationRail: Story = {
  args: { appearance: 'rail', hideWhenCollapsed: true, railExpandedMode: 'modal' },
  render: (_args, { globals }) => ({
    components: { M3Icon, M3IconButton, M3Navigation, M3NavigationSection, M3NavigationTab, NavigationStoryContent },
    setup () {
      const text = localize(globals.locale, messages)
      return { destinations: getDestinations(text), expanded: ref(false), locale: globals.locale, text }
    },
    template: `
      <div>
      <M3IconButton
          :aria-label="text.open"
          style="position: fixed; inset-inline-start: 28px; inset-block-start: 44px"
          @click="expanded = true"
      >
        <M3Icon name="menu" />
      </M3IconButton>
      <M3Navigation appearance="rail" rail-expanded-mode="modal" hide-when-collapsed v-model:expanded="expanded">
        <template #top>
          <M3IconButton :aria-label="text.close" @click="expanded = false">
            <M3Icon name="menu_open" />
          </M3IconButton>
        </template>
        ${destinationsTemplate}
      </M3Navigation>
      <NavigationStoryContent :locale="locale" top-action />
      </div>
    `,
  }),
}

export const NavigationBar: Story = {
  args: {
    appearance: 'bar',
  },
}

export const VerticalNavigationBar: Story = {
  args: {
    appearance: 'bar',
    barLayout: 'vertical',
  },
}

export const AdaptiveNavigation: Story = {
  args: {
    appearance: 'auto',
  },
}

export const ModalNavigationDrawer: Story = {
  render: (args: unknown, { globals }) => ({
    name: 'M3ModalNavigationDrawerStory',

    components: {
      M3Icon,
      M3IconButton,
      M3Navigation,
      M3NavigationSection,
      M3NavigationTab,
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
            <template #top>
                <M3IconButton
                    :aria-label="expanded ? text.close : text.open"
                    @click="expanded = !expanded"
                >
                    <M3Icon :name="expanded ? 'menu_open' : 'menu'" />
                </M3IconButton>
            </template>

            <template #header>
                {{ text.mail }}
            </template>

            ${destinationsTemplate}
        </M3Navigation>
        <NavigationStoryContent :locale="locale" />
        </div>
    `,
  }),

  args: {
    appearance: 'drawer',
  },
}
