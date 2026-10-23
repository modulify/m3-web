<template>
    <M3NavigationTab
        v-for="destination in destinations"
        :key="destination.label"
        :label="destination.label"
        :aria-label="destination.ariaLabel"
        :active="destination.active"
        :badged="destination.badged"
    >
        <M3Icon :name="destination.icon" />

        <template v-if="destination.badge" #badge>
            {{ destination.badge }}
        </template>
    </M3NavigationTab>
</template>

<script lang="ts" setup>
import { M3Icon } from '@/components/icon'
import { M3NavigationTab } from '@/components/navigation'

interface NavigationStoryDestination {
  label: string
  ariaLabel?: string
  icon: string
  active?: boolean
  badge?: string
  badged?: boolean
}

defineProps<{
  destinations: NavigationStoryDestination[]
}>()
</script>
