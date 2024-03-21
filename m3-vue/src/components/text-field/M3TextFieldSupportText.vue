<template>
    <div
        :class="{
            'm3-text-field-support-text': true,
            'm3-text-field-support-text_danger': danger,
            'm3-text-field-support-text_muted': muted,
        }"
    >
        <slot>{{ text }}</slot>
    </div>
</template>

<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: '',
  },

  danger: {
    type: Boolean,
    default: false,
  },

  muted: {
    type: Boolean,
    default: false,
  },
})
</script>
