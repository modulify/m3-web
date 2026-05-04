import type {
  FC,
  ReactNode,
} from 'react'

import {
  defineSlot,
  distinct,
} from '@/utils/content'

const Header: FC<{ children?: ReactNode }> = defineSlot('TestSlots.Header', props => <>{props.children}</>)
const Footer: FC<{ children?: ReactNode }> = defineSlot('TestSlots.Footer', props => <>{props.children}</>)
const Section: FC<{ children?: ReactNode }> = defineSlot('TestSlots.Section', props => <>{props.children}</>)
const Wrapper: FC<{ children?: ReactNode }> = props => <>{props.children}</>

describe('m3-react/content', () => {
  afterEach(() => {
    vi.restoreAllMocks()
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
    const PreviousHeader = defineSlot('HmrSlots.Header', ((props: { children?: ReactNode }) => (
      <>{props.children}</>
    )))
    const NextHeader = defineSlot('HmrSlots.Header', ((props: { children?: ReactNode }) => (
      <>{props.children}</>
    )))
    const PreviousSection = defineSlot('HmrSlots.Section', ((props: { children?: ReactNode }) => (
      <>{props.children}</>
    )))
    const NextSection = defineSlot('HmrSlots.Section', ((props: { children?: ReactNode }) => (
      <>{props.children}</>
    )))

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
