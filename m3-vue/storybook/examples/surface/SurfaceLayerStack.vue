<template>
    <main class="surface-layer-stack">
        <h1>{{ text.title }}</h1>
        <p>{{ text.description }}</p>
        <button @click="first = true">
            {{ text.open }}
        </button>
        <M3SnackbarHost ref="snackbar" />

        <M3Surface
            :shown="first"
            :width="360"
            :height="280"
            :rounding="28"
            mode="modal"
            anchor="center"
            variant="surface-container-high"
            @update:shown="value => { if (!value) closeFirst() }"
        >
            <div class="surface-layer-stack__dialog">
                <h2>{{ text.first }}</h2>
                <button ref="menuTarget">
                    {{ text.menu }}
                </button>
                <M3Popper :target="() => menuTarget" :detach-timeout="null" animated>
                    <button>{{ text.menuAction }}</button>
                </M3Popper>
                <button @click="showSnackbar">
                    {{ text.snackbar }}
                </button>
                <button @click="second = true">
                    {{ text.next }}
                </button>
                <button @click="closeFirst">
                    {{ text.close }}
                </button>
            </div>
        </M3Surface>

        <M3Surface
            v-model:shown="second"
            :width="320"
            :height="180"
            :rounding="28"
            mode="modal"
            anchor="center"
            variant="surface-container-high"
        >
            <div class="surface-layer-stack__dialog">
                <h2>{{ text.second }}</h2>
                <button @click="second = false">
                    {{ text.close }}
                </button>
            </div>
        </M3Surface>
    </main>
</template>

<script setup lang="ts">
import type { SnackbarHostMethods } from '@/components/snackbar'
import type { StorybookLocale } from '../../i18n'

import { computed, ref } from 'vue'

import M3Popper from '@/components/popper/M3Popper.vue'
import M3SnackbarHost from '@/components/snackbar/M3SnackbarHost.vue'
import M3Surface from '@/components/surface/M3Surface.vue'

const props = defineProps<{ locale: StorybookLocale }>()

const copy = {
  'en-US': {
    title: 'UI layer stack',
    description: 'Open the first dialog, then its menu, snackbar, and second dialog. Escape closes the top interaction first.',
    open: 'Open first dialog',
    first: 'First dialog',
    second: 'Second dialog',
    menu: 'Open menu',
    menuAction: 'Menu action',
    snackbar: 'Show snackbar',
    snackbarMessage: 'Saved in the first dialog',
    next: 'Open second dialog',
    close: 'Close',
  },
  'ru-RU': {
    title: 'Стек слоёв интерфейса',
    description: 'Откройте первый диалог, затем его меню, snackbar и второй диалог. Escape закрывает верхнее взаимодействие первым.',
    open: 'Открыть первый диалог',
    first: 'Первый диалог',
    second: 'Второй диалог',
    menu: 'Открыть меню',
    menuAction: 'Пункт меню',
    snackbar: 'Показать snackbar',
    snackbarMessage: 'Сохранено в первом диалоге',
    next: 'Открыть второй диалог',
    close: 'Закрыть',
  },
}

const text = computed(() => copy[props.locale])
const first = ref(false)
const second = ref(false)
const menuTarget = ref<HTMLButtonElement | null>(null)
const snackbar = ref<SnackbarHostMethods | null>(null)

const closeFirst = () => {
  second.value = false
  first.value = false
  snackbar.value?.dismiss()
}

const showSnackbar = () => {
  void snackbar.value?.show({ message: text.value.snackbarMessage, duration: null })
}
</script>

<style scoped>
.surface-layer-stack {
  min-height: 100vh;
  padding: 32px;
  background: var(--m3-sys-surface);
}

.surface-layer-stack__dialog {
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 24px;
}
</style>
