<template>
    <div class="m3-chip-showcase">
        <template v-if="mode === 'filters'">
            <M3Chip
                v-for="option in filterOptions"
                :key="option"
                variant="filter"
                :selected="filters.includes(option)"
                @update:selected="onToggleFilter(option, $event)"
            >
                {{ option }}
            </M3Chip>
        </template>

        <template v-else-if="mode === 'inputs'">
            <M3Chip
                v-for="token in tokens"
                :key="token"
                variant="input"
                dismissible
                @dismiss="removeToken(token)"
            >
                {{ token }}
            </M3Chip>
        </template>

        <template v-else>
            <M3Chip variant="assist">
                <M3Icon name="schedule" />
                Remind later
            </M3Chip>

            <M3Chip variant="filter" :selected="true">
                Updates
            </M3Chip>

            <M3Chip variant="input" dismissible>
                Project Alpha
            </M3Chip>

            <M3Chip variant="suggestion">
                <M3Icon name="lightbulb" />
                Draft summary
            </M3Chip>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { M3Chip } from '@/components/chip'
import { M3Icon } from '@/components/icon'

defineProps({
  mode: {
    type: String as () => 'matrix' | 'filters' | 'inputs',
    default: 'matrix',
  },
})

const filterOptions = ['Assigned to me', 'Urgent', 'Needs review']

const filters = ref<string[]>(['Assigned to me', 'Urgent'])
const tokens = ref<string[]>(['Onboarding', 'Billing', 'Design review'])

const onToggleFilter = (option: string, selected: boolean) => {
  if (selected) {
    filters.value = [...filters.value, option]
    return
  }

  filters.value = filters.value.filter(value => value !== option)
}

const removeToken = (token: string) => {
  tokens.value = tokens.value.filter(value => value !== token)
}
</script>

<style scoped>
.m3-chip-showcase {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
</style>
