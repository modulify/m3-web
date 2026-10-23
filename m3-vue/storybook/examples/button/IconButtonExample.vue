<template>
    <span class="d-inline-flex align-items-center gap-4">
        <M3Button :aria-label="favoriteLabel" appearance="filled" width="medium">
            <M3Icon name="favorite" />
        </M3Button>

        <M3Button
            :selected="selected"
            :aria-label="toggleLabel"
            appearance="filled"
            width="medium"
            toggleable
            @click="selected = !selected"
        >
            <M3Icon name="favorite" />
        </M3Button>
    </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

defineProps<{
  favoriteLabel: string;
  toggleLabel: string;
}>()

const selected = ref(false)
</script>
