import type { Meta, StoryObj } from '@storybook/vue3'

import { ref } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3TextField } from '@/components/text-field'

import { localize } from '../i18n'

const labels = {
  'en-US': { about: 'About', email: 'Email', password: 'Password field', summary: 'Add a short summary', text: 'Text field' },
  'ru-RU': { about: 'О себе', email: 'Электронная почта', password: 'Пароль', summary: 'Добавьте краткое описание', text: 'Текстовое поле' },
}

const meta = {
  title: 'Components/M3TextField',

  component: M3TextField,

  argTypes: {
    type: {
      control: 'select',
      options: [
        'email',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'url',
      ],
    },
  },

  args: {
    type: 'text',
  },

  render: (args: Record<string, unknown>, { globals }) => ({
    components: { M3TextField },

    setup () {
      return {
        args: {
          ...args,
          label: localize(globals.locale, labels).text,
        },
        value: ref(''),
      }
    },

    template: `
        <M3TextField
            v-model:value="value"
            v-bind="args"
        />
    `,
  }),

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3TextField>

export default meta

type Story = StoryObj<typeof meta>

export const TextField: Story = {
  args: {
    type: 'text',
    label: 'Text field',
  },
}

export const PasswordField: Story = {
  args: {
    type: 'password',
    label: 'Password field',
  },
}

PasswordField.render = (args: Record<string, unknown>, { globals }) => ({
  components: { M3TextField },
  setup: () => ({ args: { ...args, label: localize(globals.locale, labels).password }, value: ref('') }),
  template: '<M3TextField v-model:value="value" v-bind="args" />',
})

export const OutlinedWithLeadingIcon: Story = {
  args: {
    type: 'email',
    label: 'Email',
    outlined: true,
    placeholder: 'name@example.com',
  },

  render: (args: Record<string, unknown>, { globals }) => ({
    components: {
      M3Icon,
      M3TextField,
    },

    setup () {
      return {
        args: { ...args, label: localize(globals.locale, labels).email },
        value: ref(''),
      }
    },

    template: `
        <M3TextField
            v-model:value="value"
            v-bind="args"
        >
            <template #leading-icon>
                <M3Icon name="mail" />
            </template>
        </M3TextField>
    `,
  }),
}

export const MultilineOutlined: Story = {
  args: {
    label: 'About',
    outlined: true,
    multiline: true,
    placeholder: 'Add a short summary',
  },
}

MultilineOutlined.render = (args: Record<string, unknown>, { globals }) => {
  const text = localize(globals.locale, labels)
  return {
    components: { M3TextField },
    setup: () => ({ args: { ...args, label: text.about, placeholder: text.summary }, value: ref('') }),
    template: '<M3TextField v-model:value="value" v-bind="args" />',
  }
}
