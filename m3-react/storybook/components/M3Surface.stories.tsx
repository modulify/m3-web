import '../examples/surface/styles.scss'

import type { Meta, StoryObj } from '@storybook/react'

import { M3Surface } from '@/components/surface'

import SurfaceCardPageMorph from '../examples/surface/SurfaceCardPageMorph'
import SurfaceInspectorSheet from '../examples/surface/SurfaceInspectorSheet'
import SurfaceNestedDialogsChain from '../examples/surface/SurfaceNestedDialogsChain'
import SurfaceSideSheetAlwaysModal from '../examples/surface/SurfaceSideSheetAlwaysModal'
import SurfaceSideSheetDismissToRemove from '../examples/surface/SurfaceSideSheetDismissToRemove'
import SurfaceSideSheetModalToWindow from '../examples/surface/SurfaceSideSheetModalToWindow'
import SurfaceSideSheetMorph from '../examples/surface/SurfaceSideSheetMorph'
import SurfaceWorkspaceDialog from '../examples/surface/SurfaceWorkspaceDialog'

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
  render: (_args, { globals }) => <SurfaceSideSheetMorph locale={globals.locale} />,
}

export const CardReplacingPage: Story = {
  render: (_args, { globals }) => <SurfaceCardPageMorph locale={globals.locale} />,
}

export const SideSheetModalDismissRemovesSurface: Story = {
  render: (_args, { globals }) => <SurfaceSideSheetDismissToRemove locale={globals.locale} />,
}

export const SideSheetAlwaysModalToggle: Story = {
  render: (_args, { globals }) => <SurfaceSideSheetAlwaysModal locale={globals.locale} />,
}

export const SideSheetModalToWindow: Story = {
  render: (_args, { globals }) => <SurfaceSideSheetModalToWindow locale={globals.locale} />,
}

export const NestedDialogsChain: Story = {
  render: (_args, { globals }) => <SurfaceNestedDialogsChain locale={globals.locale} />,
}

export const WorkspaceModalDialog: Story = {
  render: (_args, { globals }) => <SurfaceWorkspaceDialog locale={globals.locale} />,
}

export const InspectorSideSheet: Story = {
  render: (_args, { globals }) => <SurfaceInspectorSheet locale={globals.locale} />,
}
