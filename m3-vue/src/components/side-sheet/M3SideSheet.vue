<template>
    <Teleport to="body">
        <Transition v-if="!docked" name="m3-transition-fade">
            <div
                v-show="shown"
                class="m3-scrim"
                @click="emit('update:shown', false)"
            />
        </Transition>

        <Transition name="m3-transition-slide-right">
            <div
                v-show="shown"
                :id="id"
                :class="{
                    'm3-side-sheet': true,
                    'm3-side-sheet_docked': docked,
                }"
                role="dialog"
                v-bind="{
                    ...$attrs,
                    ...('aria-label' in $attrs || 'aria-labelledby' in $attrs ? {} : {
                        'aria-labelledby': id + '-title',
                    }),
                }"
            >
                <header
                    :class="{
                        'm3-side-sheet__header': true,
                        'm3-side-sheet__header_has-leading-affordance': 'affordance' in $slots,
                    }"
                >
                    <div v-if="'affordance' in $slots" class="m3-side-sheet__affordance">
                        <slot name="affordance" />
                    </div>

                    <div :id="id + '-title'" class="m3-side-sheet__title">
                        <slot name="title" />
                    </div>

                    <div class="m3-side-sheet__affordance">
                        <M3IconButton @click="emit('update:shown', false)">
                            <slot name="close-icon" />
                        </M3IconButton>
                    </div>
                </header>

                <div class="m3-side-sheet__content">
                    <M3ScrollRail />
                    <slot />
                </div>

                <footer
                    v-if="'footer' in $slots"
                    class="m3-side-sheet__footer"
                >
                    <slot name="footer" />
                </footer>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { M3IconButton } from '@/components/icon-button'
import { M3ScrollRail } from '@/components/scroll-rail'

import makeId from '@/utils/id'

defineProps({
  id: {
    type: String,
    default: () => makeId('m3-side-sheet'),
  },

  shown: {
    type: Boolean,
    default: false,
  },

  docked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:shown'])
</script>