import type { CSSProperties, FC } from 'react'
import type { M3LinkProps } from '@/components/link'
import type { Meta } from '@storybook/react'
import type { StorybookLocale } from '../i18n'
import type { StoryObj } from '@storybook/react'

import { M3Link } from '@/components/link'

import { localize, resolveStorybookLocale } from '../i18n'

const messages = {
  'en-US': {
    anchor: 'I am rendered as <a>',
    button: 'I am rendered as <button>',
    cancel: 'Cancel',
    controlsDescription: 'Same primitive, different presentation and semantics: one remains a button, another becomes an anchor.',
    controlsTitle: 'Custom button controls on top of `M3Link`',
    deployChecklist: 'Deploy checklist',
    deployMeta: '8 items • 5 minutes',
    linksDescription: 'Inline text-link and card-link are also built from the same base element.',
    linksTitle: 'Custom link controls on top of `M3Link`',
    readApi: 'Read API reference',
    saveChanges: 'Save changes',
  },
  'ru-RU': {
    anchor: 'Отрисовано как <a>',
    button: 'Отрисовано как <button>',
    cancel: 'Отмена',
    controlsDescription: 'Один примитив с разным оформлением и семантикой: один элемент остаётся кнопкой, другой становится ссылкой.',
    controlsTitle: 'Пользовательские кнопки поверх `M3Link`',
    deployChecklist: 'Чек-лист выкладки',
    deployMeta: '8 пунктов • 5 минут',
    linksDescription: 'Текстовая ссылка и карточка-ссылка также построены на одном базовом элементе.',
    linksTitle: 'Пользовательские ссылки поверх `M3Link`',
    readApi: 'Открыть справочник API',
    saveChanges: 'Сохранить изменения',
  },
}

const styles = {
  stack: {
    display: 'grid',
    gap: '16px',
    minWidth: '360px',
  } as CSSProperties,
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px',
  } as CSSProperties,
  section: {
    display: 'grid',
    gap: '8px',
  } as CSSProperties,
  title: {
    margin: 0,
    fontWeight: 600,
    fontSize: '14px',
  } as CSSProperties,
  description: {
    margin: 0,
    color: '#5f6368',
    fontSize: '13px',
    lineHeight: 1.4,
  } as CSSProperties,
  solidButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '38px',
    border: 0,
    borderRadius: '10px',
    padding: '0 14px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#ffffff',
    background: '#0f6adf',
    textDecoration: 'none',
    cursor: 'pointer',
  } as CSSProperties,
  ghostButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '38px',
    borderRadius: '10px',
    border: '1px solid #c4d1e0',
    padding: '0 14px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#243447',
    background: '#ffffff',
    textDecoration: 'none',
    cursor: 'pointer',
  } as CSSProperties,
  textLink: {
    color: '#0f6adf',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    fontWeight: 500,
  } as CSSProperties,
  tileLink: {
    display: 'grid',
    gap: '4px',
    borderRadius: '12px',
    border: '1px solid #dbe5ef',
    padding: '12px',
    textDecoration: 'none',
    color: '#1f2d3a',
    background: '#f8fbff',
    minWidth: '220px',
  } as CSSProperties,
  tileTitle: {
    fontWeight: 600,
    fontSize: '14px',
  } as CSSProperties,
  tileMeta: {
    fontSize: '12px',
    color: '#5f6368',
  } as CSSProperties,
} as const

type LocalizedLinkProps = Omit<M3LinkProps, 'children'> & { locale: StorybookLocale }

const PrimaryAction: FC<LocalizedLinkProps> = ({ locale, ...props }) => {
  return (
    <M3Link
      style={styles.solidButton}
      {...props}
    >
      {localize(locale, messages).saveChanges}
    </M3Link>
  )
}

const SecondaryAction: FC<LocalizedLinkProps> = ({ locale, ...props }) => {
  return (
    <M3Link
      style={styles.ghostButton}
      {...props}
    >
      {localize(locale, messages).cancel}
    </M3Link>
  )
}

const DocumentationLink: FC<LocalizedLinkProps> = ({ locale, ...props }) => {
  return (
    <M3Link
      style={styles.textLink}
      {...props}
    >
      {localize(locale, messages).readApi}
    </M3Link>
  )
}

const ResourceCardLink: FC<LocalizedLinkProps> = ({ locale, ...props }) => {
  return (
    <M3Link
      style={styles.tileLink}
      {...props}
    >
      <span style={styles.tileTitle}>{localize(locale, messages).deployChecklist}</span>
      <span style={styles.tileMeta}>{localize(locale, messages).deployMeta}</span>
    </M3Link>
  )
}

const M3LinkAsBaseStory = ({ locale }: { locale: StorybookLocale }) => {
  const text = localize(locale, messages)

  return (
    <div style={styles.stack}>
      <div style={styles.section}>
        <p style={styles.title}>{text.controlsTitle}</p>
        <p style={styles.description}>
          {text.controlsDescription}
        </p>
        <div style={styles.row}>
          <PrimaryAction locale={locale} />
          <SecondaryAction locale={locale} />
          <PrimaryAction locale={locale} href="//example.com" target="_blank" rel="noopener noreferrer" />
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.title}>{text.linksTitle}</p>
        <p style={styles.description}>
          {text.linksDescription}
        </p>
        <div style={styles.row}>
          <DocumentationLink locale={locale} href="//example.com" target="_blank" rel="noopener noreferrer" />
          <ResourceCardLink locale={locale} href="//example.com" target="_blank" rel="noopener noreferrer" />
        </div>
      </div>
    </div>
  )
}

const PrimitiveShapeStory = ({
  locale,
  ...args
}: M3LinkProps & { locale: StorybookLocale }) => {
  const isAnchor = (args.href?.length ?? 0) > 0
  const sharedStyle = isAnchor ? styles.ghostButton : styles.solidButton

  return (
    <M3Link style={sharedStyle} {...args}>
      {isAnchor ? localize(locale, messages).anchor : localize(locale, messages).button}
    </M3Link>
  )
}

const meta = {
  title: 'Components/M3Link',

  component: M3Link,

  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },

    href: {
      control: 'text',
    },
  },

  args: {
    type: 'button',
    href: '',
  },

  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof M3Link>

export default meta

type Story = StoryObj<typeof meta>

export const PrimitiveShape: Story = {
  render: (args, { globals }) => (
    <PrimitiveShapeStory locale={resolveStorybookLocale(globals.locale)} {...args} />
  ),
}

export const AsBaseForCustomControls: Story = {
  render: (_args, { globals }) => (
    <M3LinkAsBaseStory locale={resolveStorybookLocale(globals.locale)} />
  ),
}
