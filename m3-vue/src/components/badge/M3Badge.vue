<template>
    <span
        :class="{
            'm3-badge': true,
            'm3-badge_labelled': 'default' in $slots || label.length,
        }"
        role="status"
    >
        <slot>{{ label }}</slot>
    </span>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
})
</script>