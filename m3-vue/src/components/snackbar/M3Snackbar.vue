<template>
    <div
        :class="{
            'm3-snackbar': true,
            'm3-snackbar_layout-stacked': layout === 'stacked',
            'm3-snackbar_leaving': leaving,
        }"
        @keydown.esc.stop="dismiss"
    >
        <span
            :id="messageId"
            :role="announce ? 'status' : undefined"
            :aria-live="announce ? 'polite' : 'off'"
            :aria-atomic="announce ? 'true' : undefined"
            class="m3-snackbar__message"
        >{{ message }}</span>
        <span v-if="slots.action || closable" class="m3-snackbar__actions">
            <slot name="action" v-bind="actionContext" />
            <M3IconButton
                v-if="closable"
                :aria-label="closeLabel"
                :aria-describedby="messageId"
                class="m3-snackbar__close"
                @click="dismiss"
            >
                <M3Icon name="close" aria-hidden="true" />
            </M3IconButton>
        </span>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { SnackbarActionContext } from './types'
import type { SnackbarLayout } from '@modulify/m3-foundation/types/components/snackbar'
import type { VNode } from 'vue'

import { computed } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { useId } from '@/composables/id'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },

  layout: {
    type: String as PropType<SnackbarLayout>,
    default: 'inline',
  },

  closable: {
    type: Boolean,
    default: false,
  },

  closeLabel: {
    type: String,
    default: 'Close notification',
  },

  leaving: {
    type: Boolean,
    default: false,
  },

  announce: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  action: [];
  dismiss: [];
}>()

const slots = defineSlots<{
  action?: (props: SnackbarActionContext) => VNode[];
}>()

const messageId = useId('m3-snackbar-message')
const performAction = () => emit('action')
const dismiss = () => emit('dismiss')
const actionContext = computed<SnackbarActionContext>(() => ({
  message: props.message,
  messageId: messageId.value,
  performAction,
  dismiss,
  buttonProps: {
    appearance: 'text',
    class: 'm3-snackbar__action',
    'aria-describedby': messageId.value,
    onClick: performAction,
  },
}))
</script>
