import type {
  Meta,
  StoryObj,
} from '@storybook/react'

import { M3Surface } from '@/components/surface'

import SurfaceCardPageMorph from '../examples/surface/SurfaceCardPageMorph'
import SurfaceNestedDialogsChain from '../examples/surface/SurfaceNestedDialogsChain'
import SurfaceSideSheetAlwaysModal from '../examples/surface/SurfaceSideSheetAlwaysModal'
import SurfaceSideSheetDismissToRemove from '../examples/surface/SurfaceSideSheetDismissToRemove'
import SurfaceSideSheetModalToWindow from '../examples/surface/SurfaceSideSheetModalToWindow'
import SurfaceSideSheetMorph from '../examples/surface/SurfaceSideSheetMorph'

import '../examples/surface/styles.scss'

const meta = {
  title: 'Components/M3Surface',
  component: M3Surface,

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof M3Surface>

export default meta

type Story = StoryObj<typeof meta>

export const SideSheetDockedToModal: Story = {
  render: () => <SurfaceSideSheetMorph />,
}

export const CardReplacingPage: Story = {
  render: () => <SurfaceCardPageMorph />,
}

export const SideSheetModalDismissRemovesSurface: Story = {
  render: () => <SurfaceSideSheetDismissToRemove />,
}

export const SideSheetAlwaysModalToggle: Story = {
  render: () => <SurfaceSideSheetAlwaysModal />,
}

export const SideSheetModalToWindow: Story = {
  render: () => <SurfaceSideSheetModalToWindow />,
}

export const NestedDialogsChain: Story = {
  render: () => <SurfaceNestedDialogsChain />,
}
