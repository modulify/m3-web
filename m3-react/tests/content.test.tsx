import type { FC, ReactNode } from 'react'

import { render } from '@testing-library/react'

import { defineSlot, distinct } from '@/utils/content'

const Header = defineSlot('TestSlots.Header')
const Footer = defineSlot('TestSlots.Footer')
const Section = defineSlot('TestSlots.Section')
const Wrapper: FC<{ children?: ReactNode }> = props => <>{props.children}</>
const Custom = (props: { active: boolean; children?: ReactNode }) => (
  <span data-active={props.active}>{props.children}</span>
)
const CustomSlot = defineSlot('TestSlots.Custom', Custom)

describe('m3-react/content', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('creates a typed fragment component by default and preserves a provided component type', () => {
    expectTypeOf(Header).toEqualTypeOf<FC<{ children: ReactNode }>>()
    expectTypeOf(CustomSlot).toEqualTypeOf<typeof Custom>()

    const { container } = render(<Header>Header</Header>)

    expect(container.textContent).toBe('Header')
  })

  test('parses slots, collections and content through fragments', () => {
    const parsed = distinct(
      <>
        {false}
        {null}
        {undefined}
        {''}
        <Header>Header</Header>
        <>
          <Section>First section</Section>
          <>
            <Footer>Footer</Footer>
          </>
        </>
        Body
        <Section>Second section</Section>
      </>,
      {
        slots: {
          header: Header,
          footer: Footer,
        },
        collections: {
          sections: Section,
        },
      }
    )

    expect(parsed.slots.header?.type).toBe(Header)
    expect(parsed.slots.footer?.type).toBe(Footer)
    expect(parsed.collections.sections).toHaveLength(2)
    expect(parsed.collections.sections[0].props.children).toBe('First section')
    expect(parsed.collections.sections[1].props.children).toBe('Second section')
    expect(parsed.content).toEqual(['Body'])
    expect(parsed.hasSlot('header')).toBe(true)
    expect(parsed.hasCollection('sections')).toBe(true)
  })

  test('does not inspect DOM or custom component descendants', () => {
    const parsed = distinct(
      <>
        <div>
          <Header>DOM nested header</Header>
        </div>
        <Wrapper>
          <Footer>Wrapped footer</Footer>
        </Wrapper>
      </>,
      {
        slots: {
          header: Header,
          footer: Footer,
        },
      }
    )

    expect(parsed.slots.header).toBeNull()
    expect(parsed.slots.footer).toBeNull()
    expect(parsed.content).toHaveLength(2)
  })

  test('keeps last duplicate slot and warns in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const parsed = distinct(
      <>
        <Header>First header</Header>
        <Header>Second header</Header>
      </>,
      {
        slots: {
          header: Header,
        },
      }
    )

    expect(parsed.slots.header?.props.children).toBe('Second header')
    expect(warn).toHaveBeenCalledWith('Duplicate slot "header" was provided. The last slot will be used.')
  })

  test('keeps legacy tuple API with fragment flattening', () => {
    const [slots, content, hasSlot] = distinct(
      <>
        <Header>Header</Header>
        <>
          Body
        </>
      </>,
      {
        header: Header,
      }
    )

    expect(slots.header?.props.children).toBe('Header')
    expect(content).toEqual(['Body'])
    expect(hasSlot('header')).toBe(true)
  })

  test('matches slots by stable marker when component identity changes', () => {
    const PreviousHeader = defineSlot('HmrSlots.Header')
    const NextHeader = defineSlot('HmrSlots.Header')
    const PreviousSection = defineSlot('HmrSlots.Section')
    const NextSection = defineSlot('HmrSlots.Section')

    const parsed = distinct(
      <>
        <PreviousHeader>Header from previous module instance</PreviousHeader>
        <PreviousSection>Section from previous module instance</PreviousSection>
      </>,
      {
        slots: {
          header: NextHeader,
        },
        collections: {
          sections: NextSection,
        },
      }
    )

    expect(parsed.slots.header?.props.children).toBe('Header from previous module instance')
    expect(parsed.collections.sections[0].props.children).toBe('Section from previous module instance')
    expect(parsed.content).toHaveLength(0)
  })
})
