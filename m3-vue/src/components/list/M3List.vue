<template>
    <ul
        :class="{
            'm3-list': true,
            'm3-list_divided': divided,
        }"
    >
        <slot />
    </ul>
</template>

<script lang="ts" setup>
defineProps({
  divided: {
    type: Boolean,
    default: false,
  },
})
</script>
