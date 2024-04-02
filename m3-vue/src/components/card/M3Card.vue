<template>
    <section
        :id="id"
        :class="{
            ['m3-card']: true,
            ['m3-card_' + appearance]: true,
            ['m3-card_interactive']: interactive,
            ['m3-card_landscape']: landscape,
        }"
        v-bind="{
            role: 'region',
            ...(interactive ? { tabindex: 0 } : {}),
            ...(!('aria-label' in $attrs) && !('content' in $slots) && ('heading' in $slots || heading.length) ? {
                'aria-labelledby': id + '-heading',
            } : {}),
            ...$attrs,
        }"
        @click="event => interactive ? ripple?.activate(event) : null"
    >
        <div
            v-if="interactive"
            ref="state"
            class="m3-card__state"
        >
            <M3Ripple ref="ripple" :owner="ref(state)" />
        </div>

        <slot name="content">
            <div v-if="'media' in $slots" class="m3-card__media">
                <slot name="media" />
            </div>

            <div class="m3-card__content">
                <div
                    v-if="'heading' in $slots || 'subheading' in $slots || heading.length || subheading.length"
                    class="m3-card__head"
                >
                    <div
                        v-if="'heading' in $slots || heading.length"
                        :id="id + '-heading'"
                        class="m3-card__heading"
                    >
                        <slot name="heading">
                            {{ heading }}
                        </slot>
                    </div>

                    <div v-if="'subheading' in $slots || subheading.length" class="m3-card__subheading">
                        <slot name="subheading">
                            {{ subheading }}
                        </slot>
                    </div>
                </div>

                <slot />
            </div>
        </slot>
    </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Appearance } from '@modulify/m3-foundation/types/components/card'

import { M3Ripple } from '@/components/ripple'

import { ref } from 'vue'

import makeId from '@/utils/id'

defineProps({
  id: {
    type: String,
    default: () => makeId('m3-card'),
  },

  appearance: {
    type: String as PropType<Appearance>,
    default: 'filled',
  },

  heading: {
    type: String,
    default: '',
  },

  subheading: {
    type: String,
    default: '',
  },

  interactive: {
    type: Boolean,
    default: false,
  },

  landscape: {
    type: Boolean,
    default: false,
  },
})

const state = ref<HTMLElement | null>(null)
const ripple = ref<InstanceType<typeof M3Ripple> | null>(null)
</script>