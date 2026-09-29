import type { Component } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'

import M3Surface from '@/components/surface/M3Surface.vue'

import { resolveStorybookLocale } from '../i18n'
import SurfaceCardPageMorph from '../examples/surface/SurfaceCardPageMorph.vue'
import SurfaceInspectorSheet from '../examples/surface/SurfaceInspectorSheet.vue'
import SurfaceNestedDialogsChain from '../examples/surface/SurfaceNestedDialogsChain.vue'
import SurfaceSideSheetAlwaysModal from '../examples/surface/SurfaceSideSheetAlwaysModal.vue'
import SurfaceSideSheetDismissToRemove from '../examples/surface/SurfaceSideSheetDismissToRemove.vue'
import SurfaceSideSheetModalToWindow from '../examples/surface/SurfaceSideSheetModalToWindow.vue'
import SurfaceSideSheetMorph from '../examples/surface/SurfaceSideSheetMorph.vue'
import SurfaceWorkspaceDialog from '../examples/surface/SurfaceWorkspaceDialog.vue'

const localizedSurfaceStory = (component: Component, locale: unknown) => ({
  components: { LocalizedSurface: component },
  setup: () => ({ locale: resolveStorybookLocale(locale) }),
  template: '<LocalizedSurface :locale="locale" />',
})

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
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceSideSheetMorph, globals.locale),
}

export const CardReplacingPage: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceCardPageMorph, globals.locale),
}

export const SideSheetModalDismissRemovesSurface: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceSideSheetDismissToRemove, globals.locale),
}

export const SideSheetAlwaysModalToggle: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceSideSheetAlwaysModal, globals.locale),
}

export const SideSheetModalToWindow: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceSideSheetModalToWindow, globals.locale),
}

export const NestedDialogsChain: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceNestedDialogsChain, globals.locale),
}

export const WorkspaceModalDialog: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceWorkspaceDialog, globals.locale),
}

export const InspectorSideSheet: Story = {
  render: (_args, { globals }) => localizedSurfaceStory(SurfaceInspectorSheet, globals.locale),
}
