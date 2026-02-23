import type {
  Meta,
  StoryObj,
} from '@storybook/vue3'

import M3Surface from '@/experimental/M3Surface.vue'

import SurfaceCardPageMorph from '../examples/surface/SurfaceCardPageMorph.vue'
import SurfaceNestedDialogsChain from '../examples/surface/SurfaceNestedDialogsChain.vue'
import SurfaceSideSheetAlwaysModal from '../examples/surface/SurfaceSideSheetAlwaysModal.vue'
import SurfaceSideSheetDismissToRemove from '../examples/surface/SurfaceSideSheetDismissToRemove.vue'
import SurfaceSideSheetModalToWindow from '../examples/surface/SurfaceSideSheetModalToWindow.vue'
import SurfaceSideSheetMorph from '../examples/surface/SurfaceSideSheetMorph.vue'

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
  render: () => ({
    components: {
      SurfaceSideSheetMorph,
    },

    template: `
        <SurfaceSideSheetMorph />
    `,
  }),
}

export const CardReplacingPage: Story = {
  render: () => ({
    components: {
      SurfaceCardPageMorph,
    },

    template: `
        <SurfaceCardPageMorph />
    `,
  }),
}

export const SideSheetModalDismissRemovesSurface: Story = {
  render: () => ({
    components: {
      SurfaceSideSheetDismissToRemove,
    },

    template: `
        <SurfaceSideSheetDismissToRemove />
    `,
  }),
}

export const SideSheetAlwaysModalToggle: Story = {
  render: () => ({
    components: {
      SurfaceSideSheetAlwaysModal,
    },

    template: `
        <SurfaceSideSheetAlwaysModal />
    `,
  }),
}

export const SideSheetModalToWindow: Story = {
  render: () => ({
    components: {
      SurfaceSideSheetModalToWindow,
    },

    template: `
        <SurfaceSideSheetModalToWindow />
    `,
  }),
}

export const NestedDialogsChain: Story = {
  render: () => ({
    components: {
      SurfaceNestedDialogsChain,
    },

    template: `
        <SurfaceNestedDialogsChain />
    `,
  }),
}
