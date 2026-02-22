import type {
  CSSProperties,
  FC,
} from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { M3LinkProps } from '@/components/link'

import { M3Link } from '@/components/link'

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

const PrimaryAction: FC<Omit<M3LinkProps, 'children'>> = (props) => {
  return (
    <M3Link
      {...props}
      style={styles.solidButton}
    >
      Save changes
    </M3Link>
  )
}

const SecondaryAction: FC<Omit<M3LinkProps, 'children'>> = (props) => {
  return (
    <M3Link
      {...props}
      style={styles.ghostButton}
    >
      Cancel
    </M3Link>
  )
}

const DocumentationLink: FC<Omit<M3LinkProps, 'children'>> = (props) => {
  return (
    <M3Link
      {...props}
      style={styles.textLink}
    >
      Read API reference
    </M3Link>
  )
}

const ResourceCardLink: FC<Omit<M3LinkProps, 'children'>> = (props) => {
  return (
    <M3Link
      {...props}
      style={styles.tileLink}
    >
      <span style={styles.tileTitle}>Deploy checklist</span>
      <span style={styles.tileMeta}>8 items • 5 minutes</span>
    </M3Link>
  )
}

const M3LinkAsBaseStory = () => {
  return (
    <div style={styles.stack}>
      <div style={styles.section}>
        <p style={styles.title}>Custom button controls on top of `M3Link`</p>
        <p style={styles.description}>
          Same primitive, different presentation and semantics:
          one remains a button, another becomes an anchor.
        </p>
        <div style={styles.row}>
          <PrimaryAction />
          <SecondaryAction />
          <PrimaryAction href="//example.com" target="_blank" rel="noopener noreferrer" />
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.title}>Custom link controls on top of `M3Link`</p>
        <p style={styles.description}>
          Inline text-link and card-link are also built from the same base element.
        </p>
        <div style={styles.row}>
          <DocumentationLink href="//example.com" target="_blank" rel="noopener noreferrer" />
          <ResourceCardLink href="//example.com" target="_blank" rel="noopener noreferrer" />
        </div>
      </div>
    </div>
  )
}

const PrimitiveShapeStory = (args: M3LinkProps) => {
  const sharedStyle = args.href.length > 0 ? styles.ghostButton : styles.solidButton

  return (
    <M3Link {...args} style={sharedStyle}>
      {args.href.length > 0 ? 'I am rendered as <a>' : 'I am rendered as <button>'}
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
  render: (args) => <PrimitiveShapeStory {...args} />,
}

export const AsBaseForCustomControls: Story = {
  render: () => <M3LinkAsBaseStory />,
}
