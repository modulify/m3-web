<template>
    <Teleport to="body">
        <Transition name="m3-transition-fade">
            <div
                v-show="opened"
                class="m3-dialog-container"
            >
                <div
                    v-if="!fullscreen"
                    class="m3-scrim"
                    @click.self="emit('update:opened', false)"
                />

                <Transition name="m3-dialog-appear">
                    <section
                        v-if="opened"
                        :class="{
                            'm3-dialog': true,
                            'm3-dialog_fullscreen': fullscreen,
                        }"
                        v-bind="$attrs"
                    >
                        <div
                            v-if="'icon' in $slots"
                            class="m3-dialog__icon"
                        >
                            <slot name="icon" />
                        </div>

                        <header
                            v-if="'header' in $slots"
                            class="m3-dialog__header"
                        >
                            <slot name="header" />
                        </header>

                        <div class="m3-dialog__content">
                            <slot />
                        </div>

                        <footer
                            v-if="'footer' in $slots"
                            class="m3-dialog__footer"
                        >
                            <slot name="footer" />
                        </footer>
                    </section>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
defineProps({
  opened: {
    type: Boolean,
    default: false,
  },

  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:opened',
])
</script>